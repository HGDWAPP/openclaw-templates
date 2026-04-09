const express = require("express");
const { execSync, execFileSync } = require("child_process");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve the built React workspace UI
const distPath = path.join(__dirname, "workspace-ui", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// State file for tracking progress
const STATE_FILE = path.join(__dirname, "state.json");

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return {
      currentStep: 0,
      agentName: "",
      templateId: "",
      apiProvider: "",
      apiKeySet: false,
      telegramConnected: false,
      gatewayRunning: false,
      achievements: [],
      completedSteps: [],
      startedAt: new Date().toISOString(),
    };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function unlockAchievement(state, id) {
  if (!state.achievements.includes(id)) {
    state.achievements.push(id);
  }
  return state;
}

function runCommand(cmd, timeoutMs = 30000) {
  try {
    return {
      success: true,
      output: execSync(cmd, {
        timeout: timeoutMs,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      }).trim(),
    };
  } catch (err) {
    return {
      success: false,
      output: err.stderr || err.message || "Command failed",
    };
  }
}

// Safe command execution using execFileSync (no shell interpretation)
function runSafeCommand(file, args, timeoutMs = 30000) {
  try {
    return {
      success: true,
      output: execFileSync(file, args, {
        timeout: timeoutMs,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      }).trim(),
    };
  } catch (err) {
    return {
      success: false,
      output: err.stderr || err.message || "Command failed",
    };
  }
}

// Safe HTTPS GET (replaces shelling out to curl)
function httpsGet(url, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: timeoutMs }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

// -------------------------------------------------------------------
// API Routes
// -------------------------------------------------------------------

// Get current onboarding state + system info
app.get("/api/status", (_req, res) => {
  const state = loadState();

  const clawVersion = runCommand("openclaw --version 2>/dev/null");
  const gatewayStatus = runCommand("openclaw status 2>/dev/null");
  const gatewayRunning =
    gatewayStatus.success &&
    gatewayStatus.output.toLowerCase().includes("running");

  const hostname = runCommand("hostname").output || "openclaw-pi";
  const ip =
    runCommand("hostname -I 2>/dev/null").output?.split(" ")[0] || "unknown";
  const temp = runCommand(
    "vcgencmd measure_temp 2>/dev/null"
  ).output?.replace("temp=", "");
  const mem = runCommand(
    "free -m 2>/dev/null | awk '/Mem:/{printf \"%d/%dMB\", $3, $2}'"
  ).output;

  state.gatewayRunning = gatewayRunning;
  saveState(state);

  res.json({
    state,
    system: {
      hostname,
      ip,
      temperature: temp || "N/A",
      memory: mem || "N/A",
      openclawVersion: clawVersion.success
        ? clawVersion.output
        : "not installed",
      gatewayRunning,
    },
  });
});

// Step 1: Set agent name
app.post("/api/setup/name", (req, res) => {
  const { name } = req.body;
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required" });
  }

  const state = loadState();
  state.agentName = name.trim();
  state.currentStep = Math.max(state.currentStep, 1);
  if (!state.completedSteps.includes("name")) {
    state.completedSteps.push("name");
  }
  unlockAchievement(state, "named");
  saveState(state);

  res.json({ success: true, state });
});

// Step 2: Select agent template
app.post("/api/setup/template", (req, res) => {
  const { templateId } = req.body;
  const validTemplates = [
    "chief-of-staff",
    "marketing-operator",
    "dev-assistant",
    "research-analyst",
    "blank",
  ];

  if (!validTemplates.includes(templateId)) {
    return res.status(400).json({ error: "Invalid template" });
  }

  const state = loadState();

  // Map template ID to source directory
  const templateMap = {
    "chief-of-staff": "preloaded",
    "marketing-operator": "chadfarquad",
    blank: "blank",
  };

  const templateDir = templateMap[templateId];
  if (templateDir) {
    const repoBase = path.resolve(__dirname, "..");
    const srcDir = path.join(repoBase, templateDir);

    if (fs.existsSync(srcDir)) {
      const home = process.env.HOME || "/home/pi";
      const workspace = path.join(home, ".openclaw", "workspace");
      runCommand(`mkdir -p "${workspace}"`);
      runCommand(
        `mkdir -p "${workspace}/memory"/{research,meetings,drafts,digests}`
      );
      runCommand(`cp -r "${srcDir}"/* "${workspace}/" 2>&1`);

      const taskBoard = path.join(workspace, "memory", "task-board.md");
      if (!fs.existsSync(taskBoard)) {
        fs.writeFileSync(
          taskBoard,
          "--- TASK BOARD ---\nDOING\n\nNEXT UP\n\nBLOCKED\n\nBACKLOG\n\nDONE (last 7 days)\n"
        );
      }
    }
  }

  state.templateId = templateId;
  state.currentStep = Math.max(state.currentStep, 2);
  if (!state.completedSteps.includes("template")) {
    state.completedSteps.push("template");
  }
  unlockAchievement(state, "template-chosen");
  saveState(state);

  res.json({ success: true, state });
});

// Step 3: Configure AI provider API key
app.post("/api/setup/api-key", (req, res) => {
  const { provider, apiKey } = req.body;
  const validProviders = ["google", "anthropic", "openai"];

  if (!validProviders.includes(provider)) {
    return res.status(400).json({ error: "Invalid provider" });
  }
  if (!apiKey || apiKey.trim().length < 10) {
    return res.status(400).json({ error: "Invalid API key" });
  }

  // Configure via OpenClaw CLI (using execFileSync to prevent shell injection)
  runSafeCommand("openclaw", [
    "models", "auth", "paste-token",
    "--provider", provider,
    "--token", apiKey.trim(),
  ]);

  // Also save as env var fallback
  const envVarMap = {
    google: "GOOGLE_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
    openai: "OPENAI_API_KEY",
  };

  const home = process.env.HOME || "/home/pi";
  const envFile = path.join(home, ".openclaw", "env");
  try {
    let envContent = "";
    if (fs.existsSync(envFile)) {
      envContent = fs.readFileSync(envFile, "utf8");
    }
    const envVar = envVarMap[provider];
    const line = `${envVar}=${apiKey.trim()}`;
    if (envContent.includes(envVar)) {
      envContent = envContent.replace(new RegExp(`${envVar}=.*`), line);
    } else {
      envContent += `\n${line}`;
    }
    fs.writeFileSync(envFile, envContent.trim() + "\n");
  } catch {
    // Non-fatal
  }

  const state = loadState();
  state.apiProvider = provider;
  state.apiKeySet = true;
  state.currentStep = Math.max(state.currentStep, 3);
  if (!state.completedSteps.includes("api-key")) {
    state.completedSteps.push("api-key");
  }
  unlockAchievement(state, "brain-connected");
  saveState(state);

  res.json({ success: true, state });
});

// Step 4: Configure Telegram
app.post("/api/setup/telegram", async (req, res) => {
  const { botToken, userId } = req.body;

  if (!botToken || botToken.trim().length < 20) {
    return res.status(400).json({ error: "Invalid bot token" });
  }

  // Verify with Telegram API (using native https, not shell curl)
  let botInfo = null;
  try {
    const rawResponse = await httpsGet(
      `https://api.telegram.org/bot${encodeURIComponent(botToken.trim())}/getMe`
    );
    const parsed = JSON.parse(rawResponse);
    if (!parsed.ok) {
      return res
        .status(400)
        .json({ error: "Invalid bot token — Telegram rejected it" });
    }
    botInfo = parsed.result;
  } catch {
    return res.status(400).json({ error: "Could not verify bot token" });
  }

  // Add channel via CLI (using execFileSync to prevent shell injection)
  runSafeCommand("openclaw", [
    "channels", "add",
    "--channel", "telegram",
    "--token", botToken.trim(),
  ]);

  if (userId && userId.trim().length > 0) {
    // Sanitize userId to digits only
    const safeUserId = userId.trim().replace(/[^0-9]/g, "");
    if (safeUserId.length > 0) {
      runSafeCommand("openclaw", [
        "config", "set",
        "channels.telegram.dmPolicy", "allowlist",
      ]);
      runSafeCommand("openclaw", [
        "config", "set",
        "channels.telegram.allowFrom", JSON.stringify([safeUserId]),
      ]);
    }
  }

  const state = loadState();
  state.telegramConnected = true;
  state.telegramBot = botInfo;
  state.currentStep = Math.max(state.currentStep, 4);
  if (!state.completedSteps.includes("telegram")) {
    state.completedSteps.push("telegram");
  }
  unlockAchievement(state, "channel-active");
  saveState(state);

  res.json({ success: true, botInfo, state });
});

// Step 5: Activate the gateway
app.post("/api/activate", (_req, res) => {
  runCommand(
    "openclaw restart 2>&1 || systemctl --user restart openclaw-gateway 2>&1"
  );

  setTimeout(() => {
    const healthResult = runCommand("openclaw health 2>&1");
    const statusResult = runCommand("openclaw status 2>&1");

    const running =
      statusResult.success &&
      statusResult.output.toLowerCase().includes("running");

    const state = loadState();
    state.gatewayRunning = running;
    state.currentStep = Math.max(state.currentStep, 5);
    if (!state.completedSteps.includes("activated")) {
      state.completedSteps.push("activated");
    }
    if (running) {
      unlockAchievement(state, "gateway-live");
    }
    saveState(state);

    res.json({
      success: running,
      health: healthResult.output,
      status: statusResult.output,
      state,
    });
  }, 5000);
});

// Record first message achievement
app.post("/api/achievements/first-message", (_req, res) => {
  const state = loadState();
  unlockAchievement(state, "first-message");
  state.currentStep = Math.max(state.currentStep, 6);
  if (!state.completedSteps.includes("first-message")) {
    state.completedSteps.push("first-message");
  }
  saveState(state);
  res.json({ success: true, state });
});

// Get all achievements
app.get("/api/achievements", (_req, res) => {
  const state = loadState();
  const allAchievements = [
    { id: "named", title: "Identity Created", description: "Named your AI agent", xp: 10 },
    { id: "template-chosen", title: "Personality Loaded", description: "Chose an agent template", xp: 20 },
    { id: "brain-connected", title: "Brain Connected", description: "AI provider API key configured", xp: 30 },
    { id: "channel-active", title: "Channel Open", description: "Telegram bot connected", xp: 25 },
    { id: "gateway-live", title: "Gateway Live", description: "Agent running on Pi", xp: 40 },
    { id: "first-message", title: "First Contact", description: "Talked to your agent", xp: 50 },
  ];

  const totalXP = allAchievements.reduce((sum, a) => sum + a.xp, 0);
  const earnedXP = allAchievements
    .filter((a) => state.achievements.includes(a.id))
    .reduce((sum, a) => sum + a.xp, 0);

  res.json({
    achievements: allAchievements.map((a) => ({
      ...a,
      unlocked: state.achievements.includes(a.id),
    })),
    totalXP,
    earnedXP,
    level: earnedXP >= 175 ? 3 : earnedXP >= 80 ? 2 : earnedXP > 0 ? 1 : 0,
  });
});

// Reset (for reuse between workshop sessions)
app.post("/api/reset", (_req, res) => {
  try {
    fs.unlinkSync(STATE_FILE);
  } catch {
    // fine
  }
  res.json({ success: true });
});

// SPA fallback — serve index.html for all non-API routes
app.get("*", (_req, res) => {
  if (fs.existsSync(path.join(distPath, "index.html"))) {
    res.sendFile(path.join(distPath, "index.html"));
  } else {
    res.status(404).send("Workspace UI not built. Run: cd workspace-ui && npm run build");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n  OpenClaw Pi Workspace`);
  console.log(`  http://localhost:${PORT}\n`);
});

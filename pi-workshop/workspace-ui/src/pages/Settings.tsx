import { useState } from "react";
import {
  Key,
  MessageSquare,
  RotateCcw,
  Server,
  Shield,
  Globe,
  AlertTriangle,
  Check,
  ExternalLink,
} from "lucide-react";
import type { AgentState } from "../App";

interface Props {
  agentState: AgentState;
  updateState: (u: Partial<AgentState>) => void;
  resetState: () => void;
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function SettingRow({ icon: Icon, label, description, children, status }: {
  icon: typeof Key;
  label: string;
  description: string;
  children?: React.ReactNode;
  status?: "connected" | "disconnected";
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-zinc-200">{label}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {status && (
          <span className={`flex items-center gap-1 text-xs rounded-full px-2 py-1 ${
            status === "connected"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-zinc-800 text-zinc-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === "connected" ? "bg-emerald-400" : "bg-zinc-600"}`} />
            {status === "connected" ? "Connected" : "Not configured"}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

export default function Settings({ agentState, updateState, resetState }: Props) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [gatewayPort] = useState("18789");

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Settings</h1>
        <p className="text-zinc-400">Manage your agent configuration and connections</p>
      </div>

      <div className="space-y-6">
        {/* Agent Identity */}
        <SettingSection title="Agent Identity">
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Agent Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={agentState.agentName}
                onChange={(e) => updateState({ agentName: e.target.value })}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <SettingRow
            icon={Server}
            label="Active Template"
            description={agentState.templateId ? agentState.templateId.replace(/-/g, " ") : "No template installed"}
            status={agentState.templateId ? "connected" : "disconnected"}
          />
        </SettingSection>

        {/* AI Provider */}
        <SettingSection title="AI Provider">
          <SettingRow
            icon={Key}
            label="API Key"
            description={agentState.apiProvider ? `${agentState.apiProvider} key configured` : "No API key set"}
            status={agentState.apiKeySet ? "connected" : "disconnected"}
          >
            <button className="text-xs text-orange-400 hover:text-orange-300">Change</button>
          </SettingRow>
        </SettingSection>

        {/* Channels */}
        <SettingSection title="Channels">
          <SettingRow
            icon={MessageSquare}
            label="Telegram"
            description={agentState.telegramConnected ? "Bot connected and receiving messages" : "Not connected"}
            status={agentState.telegramConnected ? "connected" : "disconnected"}
          >
            <button className="text-xs text-orange-400 hover:text-orange-300">
              {agentState.telegramConnected ? "Reconfigure" : "Connect"}
            </button>
          </SettingRow>
        </SettingSection>

        {/* Gateway */}
        <SettingSection title="Gateway">
          <SettingRow
            icon={Globe}
            label="Gateway Port"
            description={`Running on port ${gatewayPort}`}
          >
            <a
              href={`http://localhost:${gatewayPort}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300"
            >
              Open Control UI <ExternalLink className="w-3 h-3" />
            </a>
          </SettingRow>
          <SettingRow
            icon={Shield}
            label="Gateway Status"
            description={agentState.gatewayRunning ? "Agent gateway is running" : "Gateway is stopped"}
            status={agentState.gatewayRunning ? "connected" : "disconnected"}
          >
            <button
              onClick={() => updateState({ gatewayRunning: !agentState.gatewayRunning })}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                agentState.gatewayRunning
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              }`}
            >
              {agentState.gatewayRunning ? "Stop" : "Start"}
            </button>
          </SettingRow>
        </SettingSection>

        {/* System Info */}
        <SettingSection title="System">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-zinc-500 text-xs">Platform</p>
              <p className="text-zinc-200">Raspberry Pi 5 (8GB)</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">OS</p>
              <p className="text-zinc-200">Raspberry Pi OS 64-bit</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Node.js</p>
              <p className="text-zinc-200">v24.x (ARM64)</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">OpenClaw</p>
              <p className="text-zinc-200">Latest</p>
            </div>
          </div>
        </SettingSection>

        {/* Danger Zone */}
        <div className="bg-zinc-900 border border-red-900/50 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-red-900/50">
            <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
          </div>
          <div className="p-5">
            {showResetConfirm ? (
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-zinc-200">This will erase all configuration. Are you sure?</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { resetState(); setShowResetConfirm(false); }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-500"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Reset Everything</p>
                    <p className="text-xs text-zinc-500">Clear all settings and restart onboarding</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-800 text-red-400 hover:bg-red-900/30"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* About */}
        <div className="text-center py-6 text-xs text-zinc-600">
          <p>OpenClaw Pi Workshop Edition</p>
          <p className="mt-1">Built with love for HGDW workshops</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Check className="w-3 h-3" />
            <span>Running locally on your hardware. Your data stays yours.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  Fingerprint,
  Brain,
  Puzzle,
  Send,
  Power,
  MessageCircle,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import type { Page, AgentState } from "../App";

interface Props {
  agentState: AgentState;
  updateState: (u: Partial<AgentState>) => void;
  unlockAchievement: (id: string, xp: number) => void;
  setPage: (p: Page) => void;
}

const STEPS = [
  { id: "name", title: "Name Your Agent", subtitle: "Give your AI assistant an identity", icon: Fingerprint },
  { id: "template", title: "Choose a Personality", subtitle: "Select a pre-built agent template", icon: Puzzle },
  { id: "api-key", title: "Connect the Brain", subtitle: "Add your AI provider API key", icon: Brain },
  { id: "telegram", title: "Open a Channel", subtitle: "Connect Telegram to chat anywhere", icon: Send },
  { id: "activate", title: "Launch Your Agent", subtitle: "Start the gateway and go live", icon: Power },
  { id: "first-message", title: "Say Hello", subtitle: "Send your first message", icon: MessageCircle },
];

const TEMPLATES = [
  {
    id: "chief-of-staff",
    name: "Chief of Staff",
    description: "Executive assistant for email triage, task management, and relationship tracking. Perfect for busy professionals.",
    color: "from-blue-600 to-indigo-600",
    features: ["Email triage", "Task management", "Calendar coordination", "Relationship CRM"],
  },
  {
    id: "marketing-operator",
    name: "Marketing Operator",
    description: "Content strategy, social media management, and audience growth. Built for creators and marketers.",
    color: "from-pink-600 to-rose-600",
    features: ["Content calendar", "Social posting", "Audience analytics", "Copy generation"],
  },
  {
    id: "blank",
    name: "Blank Slate",
    description: "Start from scratch. Full control over every aspect of your agent's personality and capabilities.",
    color: "from-zinc-600 to-zinc-700",
    features: ["Custom persona", "Manual config", "Full flexibility", "Advanced users"],
  },
];

const PROVIDERS = [
  { id: "google", name: "Google Gemini", hint: "Free tier available — recommended for workshops", prefix: "AI" },
  { id: "anthropic", name: "Anthropic Claude", hint: "Best reasoning & coding ability", prefix: "sk-ant-" },
  { id: "openai", name: "OpenAI GPT", hint: "Most popular general-purpose models", prefix: "sk-" },
];

export default function Onboarding({ agentState, updateState, unlockAchievement, setPage }: Props) {
  const [step, setStep] = useState(agentState.currentStep);
  const [nameInput, setNameInput] = useState(agentState.agentName);
  const [selectedTemplate, setSelectedTemplate] = useState(agentState.templateId);
  const [selectedProvider, setSelectedProvider] = useState(agentState.apiProvider);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [telegramTokenInput, setTelegramTokenInput] = useState("");
  const [telegramUserIdInput, setTelegramUserIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isStepCompleted = (idx: number) => agentState.currentStep > idx;

  const handleNameSubmit = () => {
    if (!nameInput.trim()) return;
    updateState({
      agentName: nameInput.trim(),
      currentStep: Math.max(agentState.currentStep, 1),
      completedSteps: [...new Set([...agentState.completedSteps, "name"])],
    });
    unlockAchievement("named", 10);
    setStep(1);
  };

  const handleTemplateSubmit = () => {
    if (!selectedTemplate) return;
    updateState({
      templateId: selectedTemplate,
      currentStep: Math.max(agentState.currentStep, 2),
      completedSteps: [...new Set([...agentState.completedSteps, "template"])],
    });
    unlockAchievement("template-chosen", 20);
    setStep(2);
  };

  const handleApiKeySubmit = () => {
    if (!selectedProvider || !apiKeyInput.trim()) return;
    setLoading(true);
    setError("");
    // Simulate API call (in production, this hits the Express server on the Pi)
    setTimeout(() => {
      updateState({
        apiProvider: selectedProvider,
        apiKeySet: true,
        currentStep: Math.max(agentState.currentStep, 3),
        completedSteps: [...new Set([...agentState.completedSteps, "api-key"])],
      });
      unlockAchievement("brain-connected", 30);
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  const handleTelegramSubmit = () => {
    if (!telegramTokenInput.trim()) return;
    setLoading(true);
    setError("");
    setTimeout(() => {
      updateState({
        telegramConnected: true,
        currentStep: Math.max(agentState.currentStep, 4),
        completedSteps: [...new Set([...agentState.completedSteps, "telegram"])],
      });
      unlockAchievement("channel-active", 25);
      setLoading(false);
      setStep(4);
    }, 2000);
  };

  const handleActivate = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      updateState({
        gatewayRunning: true,
        currentStep: Math.max(agentState.currentStep, 5),
        completedSteps: [...new Set([...agentState.completedSteps, "activated"])],
      });
      unlockAchievement("gateway-live", 40);
      setLoading(false);
      setStep(5);
    }, 3000);
  };

  const handleFirstMessage = () => {
    unlockAchievement("first-message", 50);
    updateState({
      currentStep: Math.max(agentState.currentStep, 6),
      completedSteps: [...new Set([...agentState.completedSteps, "first-message"])],
    });
    setPage("dashboard");
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Agent Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                placeholder="e.g. Tempo, Atlas, Friday..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                autoFocus
              />
              <p className="text-xs text-zinc-500 mt-2">This is what you'll call your AI assistant. Pick something memorable.</p>
            </div>
            <button
              onClick={handleNameSubmit}
              disabled={!nameInput.trim()}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg py-3 flex items-center justify-center gap-2 transition-all"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`w-full text-left rounded-xl border-2 p-5 transition-all ${
                  selectedTemplate === t.id
                    ? "border-orange-500 bg-zinc-800/80"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white bg-gradient-to-r ${t.color} mb-2`}>
                      {t.name}
                    </div>
                    <p className="text-sm text-zinc-400">{t.description}</p>
                  </div>
                  {selectedTemplate === t.id && (
                    <Check className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {t.features.map((f) => (
                    <span key={f} className="text-xs bg-zinc-800 text-zinc-400 rounded-md px-2 py-1">
                      {f}
                    </span>
                  ))}
                </div>
              </button>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(0)}
                className="px-4 py-3 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleTemplateSubmit}
                disabled={!selectedTemplate}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg py-3 flex items-center justify-center gap-2 transition-all"
              >
                Install Template <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProvider(p.id)}
                  className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                    selectedProvider === p.id
                      ? "border-orange-500 bg-zinc-800/80"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-200">{p.name}</p>
                      <p className="text-xs text-zinc-500">{p.hint}</p>
                    </div>
                    {selectedProvider === p.id && <Check className="w-5 h-5 text-orange-500" />}
                  </div>
                </button>
              ))}
            </div>
            {selectedProvider && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApiKeySubmit()}
                  placeholder={`Paste your ${PROVIDERS.find((p) => p.id === selectedProvider)?.name} API key`}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                />
                <p className="text-xs text-zinc-500 mt-2">Your key is stored locally on this Pi. Never sent to any third party.</p>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="px-4 py-3 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleApiKeySubmit}
                disabled={!selectedProvider || !apiKeyInput.trim() || loading}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg py-3 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</span>
                ) : (
                  <>Connect Brain <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
              <h3 className="text-sm font-semibold text-zinc-200 mb-3">How to get a Telegram Bot Token</h3>
              <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
                <li>Open Telegram and search for <span className="font-mono text-orange-400">@BotFather</span></li>
                <li>Send <span className="font-mono text-orange-400">/newbot</span> and follow the prompts</li>
                <li>Copy the token that looks like <span className="font-mono text-zinc-500">123456789:ABCdefGHI...</span></li>
              </ol>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Bot Token</label>
              <input
                type="text"
                value={telegramTokenInput}
                onChange={(e) => setTelegramTokenInput(e.target.value)}
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Your Telegram User ID <span className="text-zinc-500">(optional)</span></label>
              <input
                type="text"
                value={telegramUserIdInput}
                onChange={(e) => setTelegramUserIdInput(e.target.value)}
                placeholder="e.g. 12345678"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-zinc-500 mt-2">Restricts bot access to just you. Send /start to @userinfobot to find your ID.</p>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-4 py-3 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleTelegramSubmit}
                disabled={!telegramTokenInput.trim() || loading}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg py-3 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Connecting...</span>
                ) : (
                  <>Connect Telegram <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="py-6">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl animate-pulse" />
                <div className="absolute inset-1 bg-zinc-900 rounded-xl flex items-center justify-center">
                  <Power className="w-10 h-10 text-orange-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Ready to Launch</h3>
              <p className="text-zinc-400 max-w-sm mx-auto">
                Your agent <span className="text-orange-400 font-semibold">{agentState.agentName}</span> is configured and ready.
                Hit the button to bring it online.
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700 text-left">
              <h4 className="text-xs uppercase tracking-wide text-zinc-500 mb-3">Configuration Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-zinc-400">Agent</span><span className="text-zinc-200">{agentState.agentName}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Template</span><span className="text-zinc-200">{agentState.templateId.replace(/-/g, " ")}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">AI Provider</span><span className="text-zinc-200">{agentState.apiProvider}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Telegram</span><span className="text-emerald-400">Connected</span></div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="px-4 py-3 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleActivate}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-40 text-white font-bold rounded-lg py-4 flex items-center justify-center gap-2 transition-all text-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Starting Gateway...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Launch Agent
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="py-6">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <Check className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">Agent is Live!</h3>
              <p className="text-zinc-400 max-w-sm mx-auto">
                <span className="text-emerald-400 font-semibold">{agentState.agentName}</span> is running on your Raspberry Pi.
                Send your first message to complete the onboarding.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={handleFirstMessage}
                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl p-4 transition-colors"
              >
                <MessageCircle className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-zinc-200">Open Chat</p>
                <p className="text-xs text-zinc-500">Chat here in the workspace</p>
              </button>
              <button
                onClick={handleFirstMessage}
                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl p-4 transition-colors"
              >
                <Send className="w-6 h-6 text-sky-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-zinc-200">Use Telegram</p>
                <p className="text-xs text-zinc-500">Message your bot directly</p>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Agent Setup</h1>
        <p className="text-zinc-400">Configure your personal AI agent in 6 steps</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const completed = isStepCompleted(i);
          const active = step === i;
          return (
            <div key={s.id} className="flex items-center flex-1">
              <button
                onClick={() => { if (completed || i <= agentState.currentStep) setStep(i); }}
                className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all ${
                  completed
                    ? "bg-emerald-600 text-white"
                    : active
                    ? "bg-orange-600 text-white ring-2 ring-orange-400 ring-offset-2 ring-offset-zinc-950"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {completed ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${completed ? "bg-emerald-600" : "bg-zinc-800"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Title */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-100">{STEPS[step]?.title}</h2>
        <p className="text-sm text-zinc-400">{STEPS[step]?.subtitle}</p>
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </div>
  );
}

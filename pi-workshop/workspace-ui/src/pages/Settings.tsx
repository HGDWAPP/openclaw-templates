import { useState } from "react";
import {
  Brain,
  MessageSquare,
  RotateCcw,
  AlertTriangle,
  Shield,
} from "lucide-react";
import type { AgentState } from "../App";

interface Props {
  agentState: AgentState;
  updateState: (u: Partial<AgentState>) => void;
  resetState: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, description, children, status }: {
  icon: typeof Brain;
  label: string;
  description: string;
  children?: React.ReactNode;
  status?: "on" | "off";
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
            status === "on" ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === "on" ? "bg-emerald-400" : "bg-zinc-600"}`} />
            {status === "on" ? "Connected" : "Not set up"}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

export default function Settings({ agentState, updateState, resetState }: Props) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Settings</h1>
        <p className="text-zinc-400">Manage your agent and connections</p>
      </div>

      <div className="space-y-6">
        {/* Your Agent */}
        <Section title="Your Agent">
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Agent Name</label>
            <input
              type="text"
              value={agentState.agentName}
              onChange={(e) => updateState({ agentName: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <Row
            icon={Shield}
            label="Active Skills"
            description={agentState.templateId ? agentState.templateId.replace(/-/g, " ") : "No skill set loaded"}
            status={agentState.templateId ? "on" : "off"}
          />
        </Section>

        {/* AI Brain */}
        <Section title="AI Brain">
          <Row
            icon={Brain}
            label="AI Provider"
            description={agentState.apiProvider ? `Using ${agentState.apiProvider}` : "No brain connected yet"}
            status={agentState.apiKeySet ? "on" : "off"}
          >
            <button className="text-xs text-orange-400 hover:text-orange-300">Change</button>
          </Row>
          <p className="text-xs text-zinc-600">Your key is stored only on this device. It's never shared or sent anywhere else.</p>
        </Section>

        {/* Messaging */}
        <Section title="Messaging">
          <Row
            icon={MessageSquare}
            label="Telegram"
            description={agentState.telegramConnected ? "You can message your agent from your phone" : "Not connected — add it to chat from your phone"}
            status={agentState.telegramConnected ? "on" : "off"}
          >
            <button className="text-xs text-orange-400 hover:text-orange-300">
              {agentState.telegramConnected ? "Change" : "Set up"}
            </button>
          </Row>
        </Section>

        {/* Agent Status */}
        <Section title="Agent Status">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${agentState.gatewayRunning ? "bg-emerald-400" : "bg-zinc-600"}`} />
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  {agentState.gatewayRunning ? "Your agent is running" : "Your agent is stopped"}
                </p>
                <p className="text-xs text-zinc-500">
                  {agentState.gatewayRunning ? "Listening for messages and processing tasks" : "Start it to begin using your agent"}
                </p>
              </div>
            </div>
            <button
              onClick={() => updateState({ gatewayRunning: !agentState.gatewayRunning })}
              className={`text-xs px-4 py-2 rounded-lg font-medium transition-colors ${
                agentState.gatewayRunning
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              }`}
            >
              {agentState.gatewayRunning ? "Stop" : "Start"}
            </button>
          </div>
        </Section>

        {/* Reset */}
        <div className="bg-zinc-900 border border-red-900/50 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-red-900/50">
            <h3 className="text-sm font-semibold text-red-400">Start Over</h3>
          </div>
          <div className="p-5">
            {showResetConfirm ? (
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-zinc-200">This will erase everything and restart setup. Sure?</p>
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
                    Confirm
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Reset Everything</p>
                    <p className="text-xs text-zinc-500">Clear all settings and start fresh</p>
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

        {/* Footer */}
        <div className="text-center py-6 text-xs text-zinc-600">
          <p>OpenClaw Pi Workshop</p>
          <p className="mt-1">Running privately on your device. Your data stays yours.</p>
        </div>
      </div>
    </div>
  );
}

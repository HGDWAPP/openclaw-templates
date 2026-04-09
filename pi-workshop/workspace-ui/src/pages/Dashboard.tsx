import {
  Activity,
  Cpu,
  Thermometer,
  HardDrive,
  Wifi,
  MessageCircle,
  Zap,
  ArrowRight,
  Clock,
  Rocket,
} from "lucide-react";
import type { Page, AgentState } from "../App";

interface Props {
  agentState: AgentState;
  setPage: (p: Page) => void;
}

function StatCard({ icon: Icon, label, value, accent }: { icon: typeof Cpu; label: string; value: string; accent?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${accent || "text-zinc-400"}`} />
        <span className="text-xs text-zinc-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-xl font-bold text-zinc-100">{value}</p>
    </div>
  );
}

export default function Dashboard({ agentState, setPage }: Props) {
  const isSetupComplete = agentState.currentStep >= 5;
  const greeting = agentState.agentName
    ? `${agentState.agentName} is ${agentState.gatewayRunning ? "online" : "offline"}`
    : "No agent configured";

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Dashboard</h1>
        <p className="text-zinc-400">{greeting}</p>
      </div>

      {/* Setup CTA if not complete */}
      {!isSetupComplete && (
        <button
          onClick={() => setPage("onboarding")}
          className="w-full mb-8 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl p-5 flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-lg">Continue Setup</p>
              <p className="text-sm text-white/70">
                Step {agentState.currentStep + 1} of 6 — {Math.round((agentState.currentStep / 6) * 100)}% complete
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Activity}
          label="Status"
          value={agentState.gatewayRunning ? "Running" : "Stopped"}
          accent={agentState.gatewayRunning ? "text-emerald-400" : "text-red-400"}
        />
        <StatCard icon={Cpu} label="CPU" value="~3%" accent="text-blue-400" />
        <StatCard icon={Thermometer} label="Temp" value="42°C" accent="text-amber-400" />
        <StatCard icon={HardDrive} label="Memory" value="312 / 8192 MB" accent="text-purple-400" />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setPage("chat")}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left hover:border-zinc-700 transition-colors group"
          >
            <MessageCircle className="w-5 h-5 text-blue-400 mb-3" />
            <p className="font-medium text-zinc-200 group-hover:text-white">Open Chat</p>
            <p className="text-xs text-zinc-500 mt-1">Talk to your agent directly</p>
          </button>
          <button
            onClick={() => setPage("templates")}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left hover:border-zinc-700 transition-colors group"
          >
            <Zap className="w-5 h-5 text-amber-400 mb-3" />
            <p className="font-medium text-zinc-200 group-hover:text-white">Browse Templates</p>
            <p className="text-xs text-zinc-500 mt-1">Install agent personalities</p>
          </button>
          <button
            onClick={() => setPage("settings")}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left hover:border-zinc-700 transition-colors group"
          >
            <Wifi className="w-5 h-5 text-emerald-400 mb-3" />
            <p className="font-medium text-zinc-200 group-hover:text-white">Connections</p>
            <p className="text-xs text-zinc-500 mt-1">Manage API keys & channels</p>
          </button>
        </div>
      </div>

      {/* Activity Feed */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Recent Activity</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
          {agentState.achievements.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              <Clock className="w-8 h-8 mx-auto mb-3 text-zinc-600" />
              <p>No activity yet. Complete setup to get started.</p>
            </div>
          ) : (
            agentState.achievements.map((a) => (
              <div key={a} className="flex items-center gap-3 px-4 py-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span className="text-sm text-zinc-300">
                  Achievement unlocked: <span className="font-medium text-zinc-100">{a.replace(/-/g, " ")}</span>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

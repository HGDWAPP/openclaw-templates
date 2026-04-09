import { useState } from "react";
import { Check, Download, Star, Users, Briefcase, Palette, Code, BookOpen } from "lucide-react";
import type { AgentState } from "../App";

interface Props {
  agentState: AgentState;
  updateState: (u: Partial<AgentState>) => void;
  unlockAchievement: (id: string, xp: number) => void;
}

const TEMPLATES = [
  {
    id: "chief-of-staff",
    name: "Chief of Staff",
    author: "OpenClaw Team",
    description: "Executive assistant for email triage, task management, calendar coordination, and relationship tracking. Built for busy professionals who need a proactive partner.",
    icon: Briefcase,
    color: "from-blue-600 to-indigo-600",
    rating: 4.9,
    installs: 2400,
    features: ["Email triage & drafting", "Task board management", "Calendar coordination", "Relationship CRM", "Proactive reminders", "Meeting prep"],
    agents: ["Tempo (coordinator)", "Monitor (email watcher)", "Scheduler (calendar)"],
  },
  {
    id: "marketing-operator",
    name: "Marketing Operator",
    author: "HGDW",
    description: "Content strategy, social media management, and audience growth toolkit. Manages content calendars, drafts posts, and tracks performance metrics.",
    icon: Palette,
    color: "from-pink-600 to-rose-600",
    rating: 4.7,
    installs: 1800,
    features: ["Content calendar", "Social media drafting", "Audience analytics", "Copy generation", "Brand voice training", "A/B testing"],
    agents: ["Chad (strategist)", "Scout (researcher)", "Atlas (analyst)"],
  },
  {
    id: "dev-assistant",
    name: "Dev Assistant",
    author: "Community",
    description: "Code review, documentation, deployment monitoring, and technical research assistant. Integrates with GitHub and CI/CD pipelines.",
    icon: Code,
    color: "from-emerald-600 to-teal-600",
    rating: 4.5,
    installs: 3200,
    features: ["Code review", "Documentation gen", "Deploy monitoring", "Bug triage", "Tech research", "PR summaries"],
    agents: ["Coder (main)", "Reviewer (QA)", "Docs (writer)"],
  },
  {
    id: "research-analyst",
    name: "Research Analyst",
    author: "Community",
    description: "Deep research, competitive analysis, and knowledge synthesis. Perfect for VC analysts, consultants, and strategic planners.",
    icon: BookOpen,
    color: "from-purple-600 to-violet-600",
    rating: 4.6,
    installs: 950,
    features: ["Deep research", "Competitive analysis", "Market reports", "Knowledge synthesis", "Citation tracking", "Briefing generation"],
    agents: ["Analyst (main)", "Scout (web research)", "Archivist (memory)"],
  },
  {
    id: "blank",
    name: "Blank Slate",
    author: "OpenClaw",
    description: "Start from scratch with a clean configuration. Full control over your agent's personality, capabilities, and behavior.",
    icon: Star,
    color: "from-zinc-600 to-zinc-700",
    rating: 5.0,
    installs: 5000,
    features: ["Custom persona", "Manual configuration", "Full flexibility", "No preset behavior", "Advanced users", "Total control"],
    agents: ["Main (configurable)"],
  },
];

export default function Templates({ agentState, updateState, unlockAchievement }: Props) {
  const [installing, setInstalling] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleInstall = (templateId: string) => {
    setInstalling(templateId);
    setTimeout(() => {
      updateState({
        templateId,
        completedSteps: [...new Set([...agentState.completedSteps, "template"])],
      });
      if (!agentState.achievements.includes("template-chosen")) {
        unlockAchievement("template-chosen", 20);
      }
      setInstalling(null);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Agent Templates</h1>
        <p className="text-zinc-400">Pre-built agent configurations you can install with one click</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {TEMPLATES.map((t) => {
          const Icon = t.icon;
          const isInstalled = agentState.templateId === t.id;
          const isExpanded = expandedId === t.id;
          const isInstalling = installing === t.id;
          return (
            <div
              key={t.id}
              className={`bg-zinc-900 border rounded-xl overflow-hidden transition-all ${
                isInstalled ? "border-orange-500/50" : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-100">{t.name}</h3>
                      <p className="text-xs text-zinc-500">by {t.author}</p>
                    </div>
                  </div>
                  {isInstalled && (
                    <span className="flex items-center gap-1 text-xs bg-orange-500/20 text-orange-400 rounded-full px-2 py-1">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>

                <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{t.description}</p>

                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" /> {t.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" /> {t.installs.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {t.agents.length} agents
                  </span>
                </div>

                {/* Expandable details */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : t.id)}
                  className="text-xs text-orange-400 hover:text-orange-300 mb-3"
                >
                  {isExpanded ? "Show less" : "Show details"}
                </button>

                {isExpanded && (
                  <div className="mb-4 space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Features</p>
                      <div className="flex flex-wrap gap-1.5">
                        {t.features.map((f) => (
                          <span key={f} className="text-xs bg-zinc-800 text-zinc-400 rounded-md px-2 py-1">{f}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Included Agents</p>
                      <div className="space-y-1">
                        {t.agents.map((a) => (
                          <p key={a} className="text-xs text-zinc-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {a}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleInstall(t.id)}
                  disabled={isInstalled || isInstalling}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isInstalled
                      ? "bg-zinc-800 text-zinc-500 cursor-default"
                      : isInstalling
                      ? "bg-zinc-800 text-zinc-400"
                      : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white"
                  }`}
                >
                  {isInstalled ? "Installed" : isInstalling ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin" />
                      Installing...
                    </span>
                  ) : "Install Template"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

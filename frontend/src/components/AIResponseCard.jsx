import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical, BookOpen, ExternalLink, MapPin, ArrowRight, FileText, Zap
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import AccordionSection from "./AccordionSection";

function AIResponseCard({ data }) {
  const [tab, setTab] = useState("publications");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      className="space-y-3"
    >
      {/* ── Overview ── */}
      <AccordionSection icon={FileText} label="Condition Overview" accent="bg-blue-600">
        <p className="text-sm text-slate-700 leading-relaxed">{data.condition_overview}</p>
      </AccordionSection>

      {/* ── Research Insights ── */}
      <AccordionSection icon={Zap} label="Research Insights" accent="bg-violet-500">
        <div className="space-y-3">
          {data.research_insights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-3 border-l-2 border-violet-200 pl-3 py-0.5"
            >
              <span className="text-[10px] font-bold text-violet-400 mt-0.5 shrink-0 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">{insight}</p>
            </motion.div>
          ))}
        </div>
      </AccordionSection>

      {/* ── Recommendations ── */}
      <AccordionSection icon={ArrowRight} label="Clinical Recommendations" accent="bg-teal-500">
        <div className="space-y-3">
          {data.recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-3 border-l-2 border-teal-200 pl-3 py-0.5"
            >
              <ArrowRight className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-700 leading-relaxed">{rec}</p>
            </motion.div>
          ))}
        </div>
      </AccordionSection>

      {/* ── Publications & Trials tabs ── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {/* Tab bar */}
        <div className="flex border-b border-slate-100">
          {[
            { key: "publications", icon: BookOpen,    label: `Publications (${data.publications.length})` },
            { key: "trials",       icon: FlaskConical, label: `Clinical Trials (${data.clinical_trials.length})` },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative flex items-center gap-2 px-5 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                tab === key
                  ? "text-blue-700"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              {tab === key && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "publications" && (
            <motion.div
              key="pub"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="divide-y divide-slate-50"
            >
              {data.publications.map((pub, i) => (
                <div
                  key={i}
                  className="group flex items-start justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 leading-snug mb-1">
                      {pub.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="truncate">{pub.journal}</span>
                      <span className="shrink-0">· {pub.year}</span>
                    </div>
                  </div>
                  <a
                    href={pub.url}
                    className="shrink-0 p-1.5 rounded-lg text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors mt-0.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </motion.div>
          )}

          {tab === "trials" && (
            <motion.div
              key="tri"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="divide-y divide-slate-50"
            >
              {data.clinical_trials.map((trial, i) => (
                <div
                  key={i}
                  className="group flex items-start justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 space-y-2">
                    <p className="text-sm font-medium text-slate-800 leading-snug">
                      {trial.title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={trial.status} />
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                        {trial.phase}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {trial.location}
                    </div>
                  </div>
                  <a
                    href={trial.url}
                    className="shrink-0 p-1.5 rounded-lg text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors mt-0.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default AIResponseCard;
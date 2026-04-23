import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

function AccordionSection({ icon: Icon, label, accent, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-1 h-5 rounded-full ${accent}`} />
          <Icon className={`w-3.5 h-3.5 ${
            accent.includes("blue")   ? "text-blue-600"   :
            accent.includes("violet") ? "text-violet-600" :
            accent.includes("teal")   ? "text-teal-600"   : "text-slate-500"
          }`} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${
            accent.includes("blue")   ? "text-blue-700"   :
            accent.includes("violet") ? "text-violet-700" :
            accent.includes("teal")   ? "text-teal-700"   : "text-slate-600"
          }`}>
            {label}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-slate-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AccordionSection;
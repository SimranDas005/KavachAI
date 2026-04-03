import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Shield, Phone, Ban, Send, Check } from "lucide-react";

const steps = [
  { icon: Ban, text: "Do not click unknown links", detail: "Never open URLs from unknown senders" },
  { icon: Phone, text: "Verify with official source", detail: "Call the company directly using their official number" },
  { icon: Shield, text: "Report to 1930 Cyber Helpline", detail: "India's national cyber crime helpline" },
  { icon: Ban, text: "Block sender immediately", detail: "Prevent further contact from this number" },
];

const DefensePage = () => {
  const [checked, setChecked] = useState<boolean[]>(new Array(steps.length).fill(false));
  const [simulated, setSimulated] = useState(false);

  const allChecked = checked.every(Boolean);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">🛡️ Safe Response</h1>
        <p className="text-muted-foreground">Follow these steps to protect yourself from the scam</p>
      </motion.div>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => toggle(i)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left ${
              checked[i]
                ? "border-safe/30 bg-safe/5 glow-safe"
                : "border-border bg-card hover:border-muted-foreground/30"
            }`}
          >
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
              checked[i] ? "border-safe bg-safe" : "border-muted-foreground/40"
            }`}>
              {checked[i] && <Check className="h-4 w-4 text-safe-foreground" />}
            </div>
            <step.icon className={`h-5 w-5 shrink-0 ${checked[i] ? "text-safe" : "text-muted-foreground"}`} />
            <div>
              <p className={`font-medium text-sm ${checked[i] ? "text-safe" : "text-foreground"}`}>{step.text}</p>
              <p className="text-xs text-muted-foreground">{step.detail}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: allChecked ? 1.02 : 1 }}
        whileTap={{ scale: allChecked ? 0.98 : 1 }}
        onClick={() => allChecked && setSimulated(true)}
        disabled={!allChecked}
        className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
          allChecked
            ? "bg-safe/20 text-safe border border-safe/30 hover:bg-safe/30 cursor-pointer"
            : "bg-secondary text-muted-foreground border border-border cursor-not-allowed"
        }`}
      >
        <Send className="h-4 w-4" />
        Simulate Safe Action
      </motion.button>

      <AnimatePresence>
        {simulated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-safe/30 bg-safe/5 p-8 text-center space-y-4 glow-safe"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <CheckCircle className="h-16 w-16 text-safe mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold text-safe text-glow-safe">✅ You Avoided the Scam!</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Excellent work! By following these steps, you've protected yourself and your data. Stay vigilant!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DefensePage;

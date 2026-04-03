import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Shield, AlertTriangle, Eye, CheckCircle } from "lucide-react";
import CircularProgress from "@/components/CircularProgress";
import GlowCard from "@/components/GlowCard";

const alerts = [
  { time: "2 min ago", text: "Phishing SMS blocked from +91 98XXXXX", type: "danger" as const },
  { time: "1 hour ago", text: "Suspicious link scan completed", type: "warning" as const },
  { time: "3 hours ago", text: "War Room simulation completed", type: "safe" as const },
  { time: "Yesterday", text: "Security score updated to 78%", type: "safe" as const },
];

const history = [
  { message: "Your KYC is expiring...", result: "Scam", score: 92 },
  { message: "Your order #4521 has shipped", result: "Safe", score: 8 },
  { message: "You've won ₹50,000 lottery!", result: "Scam", score: 95 },
  { message: "OTP for bank transfer: 4829", result: "Suspicious", score: 61 },
];

const CountUpNumber = ({ value, className }: { value: number; className?: string }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frame = 0;
    const totalFrames = 25;
    const id = setInterval(() => {
      frame += 1;
      setDisplay(Math.round((frame / totalFrames) * value));
      if (frame >= totalFrames) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [value]);
  return <p className={className}>{display}</p>;
};

const DashboardPage = () => {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Your security overview and activity log</p>
        <p className="text-xs text-cyber">Last scan: just now</p>
      </motion.div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlowCard glowColor="safe" delay={0.1}>
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-sm font-medium text-muted-foreground">Security Score</h3>
            <CircularProgress value={78} color="hsl(var(--safe))" />
          </div>
        </GlowCard>

        <GlowCard glowColor="cyber" delay={0.2}>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-secondary/30">
                <CountUpNumber value={12} className="text-2xl font-bold text-foreground" />
                <p className="text-xs text-muted-foreground">Scans</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/30">
                <CountUpNumber value={4} className="text-2xl font-bold text-danger" />
                <p className="text-xs text-muted-foreground">Threats</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/30">
                <CountUpNumber value={8} className="text-2xl font-bold text-safe" />
                <p className="text-xs text-muted-foreground">Safe</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/30">
                <CountUpNumber value={3} className="text-2xl font-bold text-warning" />
                <p className="text-xs text-muted-foreground">Simulations</p>
              </div>
            </div>
          </div>
        </GlowCard>

        <GlowCard glowColor="warning" delay={0.3}>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Alerts Log</h3>
            <div className="space-y-2">
              {alerts.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-2 text-xs"
                >
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    a.type === "danger" ? "bg-danger" : a.type === "warning" ? "bg-warning" : "bg-safe"
                  }`} />
                  <div>
                    <p className="text-foreground">{a.text}</p>
                    <p className="text-muted-foreground">{a.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Detection History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            Scam Detection History
          </h3>
        </div>
        <div className="divide-y divide-border">
          {history.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className={`p-4 flex items-center justify-between transition-all duration-200 ${
                h.result === "Scam"
                  ? "hover:bg-danger/10 hover:shadow-[0_0_20px_hsla(0,84%,60%,0.18)]"
                  : h.result === "Safe"
                    ? "hover:bg-safe/10 hover:shadow-[0_0_20px_hsla(142,71%,45%,0.18)]"
                    : "hover:bg-warning/10"
              }`}
            >
              <div className="flex items-center gap-3">
                {h.result === "Scam" ? (
                  <AlertTriangle className="h-4 w-4 text-danger" />
                ) : h.result === "Safe" ? (
                  <CheckCircle className="h-4 w-4 text-safe" />
                ) : (
                  <Shield className="h-4 w-4 text-warning" />
                )}
                <span className="text-sm text-foreground font-mono truncate max-w-xs">{h.message}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  h.result === "Scam" ? "bg-danger/20 text-danger" :
                  h.result === "Safe" ? "bg-safe/20 text-safe" :
                  "bg-warning/20 text-warning"
                }`}>
                  {h.result}
                </span>
                <span className="text-xs text-muted-foreground w-12 text-right">{h.score}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;

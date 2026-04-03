import { motion } from "framer-motion";
import { AlertTriangle, Link, Clock, Building, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const highlights = [
  {
    text: "bit.ly/pay-electric-now",
    label: "Suspicious Link",
    icon: Link,
    color: "danger",
    tooltip: "Shortened URLs hide the real destination. Scammers use them to redirect you to phishing sites that steal your payment info.",
  },
  {
    text: "30 minutes",
    label: "Urgency Tactic",
    icon: Clock,
    color: "warning",
    tooltip: "Creating false urgency is a classic manipulation technique. Real service providers give adequate notice through official channels.",
  },
  {
    text: "electricity connection",
    label: "Authority Impersonation",
    icon: Building,
    color: "cyber",
    tooltip: "Scammers impersonate utility companies and government bodies to appear legitimate and create fear.",
  },
];

const AnalysisPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">🔍 Forensic Analysis</h1>
        <p className="text-muted-foreground">Breakdown of the scam message with threat indicators</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger" />
              Message Content
            </h2>
            <div className="bg-secondary/30 rounded-lg p-4 font-mono text-sm leading-relaxed space-y-2">
              <p className="text-foreground">
                ⚡ URGENT: Your{" "}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="bg-cyber/20 text-cyber px-1 rounded border-b-2 border-cyber cursor-help">
                      electricity connection
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-card border-border">
                    <p className="text-sm">{highlights[2].tooltip}</p>
                  </TooltipContent>
                </Tooltip>{" "}
                will be DISCONNECTED in{" "}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="bg-warning/20 text-warning px-1 rounded border-b-2 border-warning cursor-help">
                      30 minutes
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-card border-border">
                    <p className="text-sm">{highlights[1].tooltip}</p>
                  </TooltipContent>
                </Tooltip>{" "}
                due to unpaid bill of ₹2,847.
              </p>
              <p className="text-foreground">
                Pay immediately:{" "}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="bg-danger/20 text-danger px-1 rounded border-b-2 border-danger cursor-help">
                      bit.ly/pay-electric-now
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-card border-border">
                    <p className="text-sm">{highlights[0].tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </p>
            </div>
          </motion.div>

          {/* Threat Indicators */}
          <div className="space-y-3">
            {highlights.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className={`rounded-lg border p-4 flex items-start gap-4 ${
                  h.color === "danger" ? "border-danger/30 bg-danger/5" :
                  h.color === "warning" ? "border-warning/30 bg-warning/5" :
                  "border-cyber/30 bg-cyber/5"
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  h.color === "danger" ? "bg-danger/20" :
                  h.color === "warning" ? "bg-warning/20" :
                  "bg-cyber/20"
                }`}>
                  <h.icon className={`h-5 w-5 ${
                    h.color === "danger" ? "text-danger" :
                    h.color === "warning" ? "text-warning" :
                    "text-cyber"
                  }`} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{h.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{h.tooltip}</p>
                  <code className="text-xs font-mono mt-2 inline-block px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground">
                    "{h.text}"
                  </code>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="rounded-xl border border-danger/30 bg-danger/5 p-6 space-y-4 glow-danger">
            <h3 className="text-lg font-bold text-danger flex items-center gap-2">
              <Info className="h-5 w-5" />
              Why This Is a Scam
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-danger mt-0.5">•</span>
                Uses a shortened URL to hide the real phishing destination
              </li>
              <li className="flex items-start gap-2">
                <span className="text-danger mt-0.5">•</span>
                Creates extreme urgency with a fake 30-minute deadline
              </li>
              <li className="flex items-start gap-2">
                <span className="text-danger mt-0.5">•</span>
                Impersonates an electricity company without proper identification
              </li>
              <li className="flex items-start gap-2">
                <span className="text-danger mt-0.5">•</span>
                No official reference number or customer ID mentioned
              </li>
              <li className="flex items-start gap-2">
                <span className="text-danger mt-0.5">•</span>
                Threatens severe consequences to trigger panic
              </li>
            </ul>
          </div>

          <button
            onClick={() => navigate("/defense")}
            className="w-full py-3 rounded-lg bg-safe/20 text-safe font-medium border border-safe/30 hover:bg-safe/30 transition-all duration-300"
          >
            View Safe Response →
          </button>

          <button
            onClick={() => navigate("/war-room")}
            className="w-full py-3 rounded-lg bg-secondary text-muted-foreground font-medium border border-border hover:bg-secondary/80 transition-all duration-300"
          >
            ← Back to War Room
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisPage;

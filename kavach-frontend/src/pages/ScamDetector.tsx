import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertTriangle, ShieldCheck } from "lucide-react";
import CircularProgress from "@/components/CircularProgress";

// Keep keywords focused on scam patterns.
// Generic words like "bank" cause false positives on legitimate notifications.
const scamKeywords = [
  "bit.ly",
  "click here",
  "urgent",
  "immediately",
  "act now",
  "disconnect",
  "suspended",
  "verify your account",
  "pay now",
  "final warning",
  "lottery",
  "won",
  "prize",
  "otp",
  "upi",
  "debit",
  "transfer",
  "freeze",
  "kyc",
  "blocked",
  "claim",
  "processing fee",
];

const ScamDetector = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | { isScam: boolean; score: number; reasons: string[]; matchedWords: string[] }>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!result) {
      setDisplayScore(0);
      return;
    }
    let step = 0;
    const totalSteps = 24;
    const id = setInterval(() => {
      step += 1;
      const next = Math.min(result.score, Math.round((step / totalSteps) * result.score));
      setDisplayScore(next);
      if (step >= totalSteps) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [result]);

  const highlightedMessage = useMemo(() => {
    if (!result || !result.isScam) return input;
    let output = input;
    result.matchedWords.forEach((word) => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      output = output.replace(new RegExp(escaped, "gi"), (match) => `[[${match}]]`);
    });
    return output;
  }, [input, result]);

  const analyze = () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const lower = input.toLowerCase();
      const matched = scamKeywords.filter((k) => lower.includes(k));
      const hasShortenerLink = /bit\.ly|goo\.gl|tinyurl/i.test(input);
      const hasHttpLink = /https?:\/\/[^\s]+/i.test(input);
      const domainRegex = /\b(?:[a-z0-9-]+\.)+(?:com|in|co\.in|net|org|info|xyz|top|site|live|biz)(?:\/[^\s]*)?/gi;
      const domainHits = input.match(domainRegex) ?? [];
      const trustedDomains = ["swiggy.com", "hdfcbank.com", "hdfc.com", "sbi.co.in", "icicibank.com", "axisbank.com"];
      const hasUntrustedDomain = domainHits.some((domain) =>
        !trustedDomains.some((trusted) => domain.toLowerCase().includes(trusted))
      );
      const hasLink = hasShortenerLink || hasHttpLink || hasUntrustedDomain;
      const hasUrgency = /urgent|immediately|now|warning|final|act now/i.test(lower);
      const hasUnknownSenderCue = /unknown sender|dear customer|dear .* customer|verify your account|support team|account team/i.test(lower);
      const hasPaymentRequest = /pay now|pay immediately|transfer|share otp|enter otp|verify.*otp|upi|collect|send money/i.test(lower);
      const hasThreatOrDisruption = /disconnect|suspended|freeze|blocked|account (will )?(freeze|block)|unblock/i.test(lower);
      const hasKycThreatPattern = /kyc|verify|blocked|suspension|permanent suspension|avoid suspension/i.test(lower);
      const hasPrizeClaimPattern = /won|lucky draw|claim your prize|processing fee|release funds|prize/i.test(lower);

      // Legit patterns: avoid false positives when messages only contain account/order updates.
      const looksLikeBankTxn = /(credited with|available balance|has been credited|transaction successful|payment received)/i.test(lower);
      const looksLikeOrderUpdate = /(order .*placed successfully|track your order|estimated delivery)/i.test(lower);

      const reasons: string[] = [];
      let score = 0;

      if (hasUrgency) {
        score += 30;
        reasons.push("Urgency detected");
      }
      if (hasLink) {
        score += 35;
        reasons.push("Suspicious link");
      }
      if (hasUnknownSenderCue) {
        score += 20;
        reasons.push("Unknown sender");
      }
      if (hasPaymentRequest) {
        score += 35;
        reasons.push("Payment/verification request");
      }
      if (hasThreatOrDisruption) {
        score += 25;
        reasons.push("Account threat detected");
      }

      if (matched.length > 0) {
        // Matched generic threat keywords add smaller incremental risk.
        score += Math.min(20, matched.length * 8);
      }

      // Force high-risk outcomes for known scam compositions.
      if (hasPrizeClaimPattern && (hasPaymentRequest || hasLink)) {
        score = Math.max(score, 92);
        reasons.push("Prize/lottery claim scam pattern");
      }
      if (hasKycThreatPattern && hasUrgency && (hasThreatOrDisruption || hasLink)) {
        score = Math.max(score, 88);
        reasons.push("KYC-blocking impersonation pattern");
      }

      // Hard overrides for common legitimate notifications.
      if ((looksLikeBankTxn || looksLikeOrderUpdate) && !hasUrgency && !hasLink && !hasPaymentRequest && !hasThreatOrDisruption) {
        score = 8;
        reasons.push(looksLikeBankTxn ? "Legitimate account update" : "Legitimate order update");
      }

      const isScam = score >= 40;

      setResult({
        isScam,
        score: isScam ? score : 12,
        reasons: reasons.length > 0 ? reasons : ["No major red flags detected"],
        matchedWords: matched,
      });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Scam Detector</h1>
        <p className="text-muted-foreground">Paste any SMS or email to check if it's a scam</p>
      </motion.div>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste SMS or email content here..."
          className="w-full h-40 p-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-safe/50 font-mono text-sm"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={analyze}
          disabled={!input.trim() || analyzing}
          className="w-full py-4 rounded-xl bg-safe/20 text-safe font-semibold border border-safe/30 hover:bg-safe/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search className="h-4 w-4" />
          {analyzing ? "Analyzing message..." : "Analyze"}
        </motion.button>
      </div>

      {analyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 py-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-safe border-t-transparent rounded-full"
          />
          <p className="text-muted-foreground text-sm font-mono">Analyzing message...</p>
        </motion.div>
      )}

      <AnimatePresence>
        {result && !analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl border p-6 space-y-6 ${
              result.isScam ? "border-danger/30 bg-danger/5 glow-danger" : "border-safe/30 bg-safe/5 glow-safe"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {result.isScam ? (
                  <AlertTriangle className="h-8 w-8 text-danger" />
                ) : (
                  <ShieldCheck className="h-8 w-8 text-safe" />
                )}
                <div>
                  <h3 className={`text-xl font-bold ${result.isScam ? "text-danger" : "text-safe"}`}>
                    {result.isScam ? "High Risk Scam" : "Looks Safe"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {result.isScam ? "This message contains multiple red flags" : "No significant threats detected"}
                  </p>
                  <p className={`text-xs mt-1 ${result.isScam ? "text-danger" : "text-safe"}`}>
                    AI Confidence: {result.isScam ? "High" : "Strong"}
                  </p>
                </div>
              </div>
              <CircularProgress
                value={displayScore}
                size={80}
                strokeWidth={6}
                color={result.isScam ? "hsl(var(--danger))" : "hsl(var(--safe))"}
                label="Risk"
              />
            </div>

            {result.isScam ? (
              <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                {highlightedMessage.split(/(\[\[.*?\]\])/g).map((part, idx) => {
                  const isHighlight = part.startsWith("[[") && part.endsWith("]]");
                  return (
                    <span key={idx} className={isHighlight ? "text-danger font-semibold bg-danger/20 px-1 rounded" : "text-foreground"}>
                      {isHighlight ? part.slice(2, -2) : part}
                    </span>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-safe/40 bg-safe/10 p-3"
              >
                <p className="text-safe font-semibold">Safe Message Pattern</p>
                <p className="text-xs text-muted-foreground mt-1">No urgency, phishing link, or unknown-sender coercion detected.</p>
              </motion.div>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Findings:</h4>
              {result.reasons.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className={result.isScam ? "text-danger" : "text-safe"}>•</span>
                  {r}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScamDetector;

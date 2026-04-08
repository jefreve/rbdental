import { useEffect, useState } from "react";
import { Timer, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlotTimerProps {
  /** Unix timestamp (ms) at which the lock expires. Null = timer not active. */
  expiresAt: number | null;
  /** Called when the 5-min lock expires */
  onExpire: () => void;
  /** Whether keyboard is active (shorter header) */
  isKeyboardActive?: boolean;
}

export function SlotTimer({ expiresAt, onExpire, isKeyboardActive }: SlotTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [hasExpired, setHasExpired] = useState(false);
  const [showExpansion, setShowExpansion] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!expiresAt) {
      setSecondsLeft(null);
      setHasExpired(false);
      setShowExpansion(false);
      return;
    }

    // Trigger initial 5s expansion overlay
    setShowExpansion(true);
    const expansionTimer = setTimeout(() => setShowExpansion(false), 5000);

    const tick = () => {
      const remaining = Math.floor((expiresAt - Date.now()) / 1000);
      if (remaining <= 0) {
        setSecondsLeft(0);
        setHasExpired(true);
        onExpire();
        clearInterval(id);
      } else {
        setSecondsLeft(remaining);
        setHasExpired(false);
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => {
      clearInterval(id);
      clearTimeout(expansionTimer);
    };
  }, [expiresAt, onExpire]);

  if (!expiresAt || secondsLeft === null) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes}:${String(seconds).padStart(2, "0")}`;
  const dynamicTooltipText = `Data e orario riservati per i prossimi ${minutes}min ${seconds}sec`;

  const isUrgent = secondsLeft <= 60;
  const isExpiredState = hasExpired || secondsLeft === 0;

  return (
    <>
      {/* 1. Initial Centered Expansion (Overlay) */}
      {showExpansion && !isExpiredState && (
        <div className="absolute inset-0 z-[100] flex items-end justify-center pointer-events-none pb-24 px-6">
          <div className="bg-primary/60 backdrop-blur-xl text-white px-5 py-3 rounded-xl shadow-2xl flex flex-col items-center gap-1 animate-in fade-in slide-in-from-bottom-4 duration-700 border border-white/25 ring-1 ring-white/10">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="text-[13px] font-semibold tracking-tight">Slot riservato per i prossimi</span>
            </div>
            <div className="text-2xl font-mono font-black tabular-nums tracking-tight">
              {formattedTime}
            </div>
          </div>
        </div>
      )}

      {/* 2. Smaller Badge - positioned in top-right of widget */}
      <div 
        className="absolute top-[72px] right-4 z-50 group/timer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[12px] font-bold tracking-wide transition-all duration-500 hover:scale-105 active:scale-95",
            isUrgent || isExpiredState
              ? "bg-orange-500/80 text-white"
              : "bg-primary/5 backdrop-blur-md border border-primary/20 text-primary shadow-sm",
            isKeyboardActive && "scale-90",
            showExpansion && "opacity-0 scale-90" 
          )}
        >
          <Timer className={cn("w-3.5 h-3.5 shrink-0", isExpiredState && "animate-pulse")} />
          <span>{formattedTime}</span>
        </button>

        {/* Dynamic Tooltip */}
        {showTooltip && (
          <div className="absolute right-0 top-full mt-2 z-[60] w-[260px] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-background/95 backdrop-blur-md border border-border shadow-2xl rounded-xl p-3 text-center relative pointer-events-auto">
              <div className="absolute top-2 right-2 sm:hidden">
                <X className="w-4 h-4 text-muted-foreground" onClick={() => setShowTooltip(false)} />
              </div>
              <p className="text-[13px] font-semibold text-foreground leading-tight">
                {isExpiredState 
                  ? "Il tempo è scaduto. Lo slot potrebbe essere stato preso da un altro paziente." 
                  : dynamicTooltipText}
              </p>
              {!isExpiredState && (
                <div className="mt-1.5 flex justify-center">
                  <div className={cn(
                    "h-1 bg-primary/20 rounded-full w-full overflow-hidden",
                    isUrgent && "bg-orange-500/20"
                  )}>
                    <div 
                      className={cn("h-full bg-primary transition-all duration-1000", isUrgent && "bg-orange-500")} 
                      style={{ width: `${((300 - secondsLeft) / 300) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute -top-1 right-8 w-2 h-2 bg-background border-l border-t border-border rotate-45" />
          </div>
        )}
      </div>
    </>
  );
}

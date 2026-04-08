import { useToast } from "./use-toast"
import { cn } from "@/lib/utils"
import { X, AlertCircle, Info } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[calc(100%-32px)] max-w-[360px] pointer-events-none items-center">
      {toasts.map(function ({ id, description, variant, action }) {
        return (
          <div
            key={id}
            role={variant === "destructive" ? "alert" : "status"}
            aria-live={variant === "destructive" ? "assertive" : "polite"}
            className={cn(
              "group pointer-events-auto relative flex w-fit min-w-[280px] max-w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border-2 p-4 shadow-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-300",
              variant === "destructive" 
                ? "border-destructive bg-black/95 text-white" 
                : "border-border bg-white text-foreground"
            )}
          >
            <div className="flex gap-3 items-center pt-1">
              {variant === "destructive" ? (
                <AlertCircle className="w-5 h-5 shrink-0 text-destructive" />
              ) : (
                <Info className="w-5 h-5 shrink-0 text-primary" />
              )}
              <div className="text-sm font-semibold leading-tight pr-6">
                {description}
              </div>
            </div>
            {action}
            <div
              role="button"
              tabIndex={0}
              aria-label="Chiudi"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  dismiss(id);
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dismiss(id);
              }}
              className={cn(
                "absolute right-1.5 top-1.5 rounded-full p-1.5 cursor-pointer transition-all hover:scale-110 active:scale-95 z-[10000]",
                variant === "destructive" ? "text-destructive hover:bg-white/10" : "text-muted-foreground hover:bg-black/5"
              )}
            >
              <X className="h-4 w-4 stroke-[3px]" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

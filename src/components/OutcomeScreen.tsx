import { CheckCircle, AlertTriangle, Calendar, User, RefreshCcw, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OutcomeScreenProps {
  type: 'success' | 'error';
  booking: {
    treatmentName?: string;
    dateTime?: string;
    doctorName?: string;
  };
  errorTitle?: string;
  errorMessage?: string;
  retryStep?: 'datetime' | 'contact' | 'home' | 'treatment';
  direction?: 'forward' | 'backward';
  onReset: (step: 'home' | 'treatment' | 'datetime' | 'contact') => void;
  dashboardUrl?: string; // <--- AGGIUNTO
}

export function OutcomeScreen({ 
  type = 'success', 
  booking, 
  errorTitle = "Prenotazione Fallita",
  errorMessage = "Non è stato possibile completare la prenotazione a causa di un problema tecnico. Lo slot scelto potrebbe non essere più disponibile.",
  retryStep = 'contact',
  direction = 'forward', 
  onReset,
  dashboardUrl = 'dashboard.html' // <--- AGGIUNTO
}: OutcomeScreenProps) {
  const isSuccess = type === 'success';

  return (
    <div 
      role="status"
      aria-live="polite"
      className={cn(
      "w-full mx-auto animate-in fade-in duration-700 flex flex-col items-center text-center justify-start pt-4 pb-10 sm:pb-0",
      direction === 'forward' ? "slide-in-from-right-4" : "slide-in-from-left-4"
    )}>
      <h2 className="text-[length:var(--f-title)] font-bold mb-3 font-heading flex items-center justify-center gap-2">
        {isSuccess ? (
          <>
            <CheckCircle className="w-7 h-7 text-green-500 animate-bounce-short-once shrink-0" />
            Prenotazione Confermata!
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <AlertTriangle className="w-12 h-12 text-destructive animate-in zoom-in duration-300 shrink-0" />
            {errorTitle}
          </div>
        )}
      </h2>
      
      <p className="text-muted-foreground text-[length:var(--f-base)] mb-6 px-0 sm:px-4">
        {isSuccess 
          ? "Riceverai un'email di conferma a breve."
          : (typeof errorMessage === 'string' && errorMessage.includes("Torna al calendario") ? (
              <>
                {errorMessage.split("Torna al calendario")[0]}
                <button 
                  onClick={() => onReset(retryStep)}
                  className="text-primary hover:underline font-bold transition-all p-0 bg-transparent border-none cursor-pointer inline"
                >
                  Torna al calendario
                </button>
                {errorMessage.split("Torna al calendario")[1]}
              </>
            ) : errorMessage)}
      </p>

      {/* Summary Card - Shown in both cases but slightly dimmed for error if needed */}
      <div className={cn(
        "w-full rounded-2xl p-6 mb-6 border border-border/50 text-left space-y-4 transition-colors",
        isSuccess ? "bg-muted/30" : "bg-destructive/5 border-destructive/20"
      )}>
        <div className="flex items-start gap-3">
          <div className={cn("p-1.5 rounded-lg shrink-0", isSuccess ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive")}>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[length:var(--f-heading)] uppercase tracking-wider text-muted-foreground font-bold leading-none mb-1">Servizio</p>
            <p className="font-semibold text-[length:var(--f-base)]">{booking.treatmentName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className={cn("p-1.5 rounded-lg shrink-0", isSuccess ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive")}>
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[length:var(--f-heading)] uppercase tracking-wider text-muted-foreground font-bold leading-none mb-1">Data e Ora</p>
            <p className="font-semibold text-[length:var(--f-base)]">{booking.dateTime}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className={cn("p-1.5 rounded-lg shrink-0", isSuccess ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive")}>
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[length:var(--f-heading)] uppercase tracking-wider text-muted-foreground font-bold leading-none mb-1">Dottore</p>
            <p className="font-semibold text-[length:var(--f-base)]">{booking.doctorName}</p>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="w-full pt-0 space-y-4">
        {isSuccess ? (
          <>
            <p className="text-[length:var(--f-base)] text-balance mb-4 leading-snug">
              Accedi alla <a href={dashboardUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">dashboard</a> del tuo <strong>Account Paziente</strong> gratuito per gestire questa e altre prenotazioni.
            </p>
            
            <div className="flex flex-row gap-3 w-full">
              <Button 
                asChild
                className="flex-1 h-12 rounded-full font-bold text-[length:var(--f-button)] shadow-sm text-white px-2"
              >
                <a href={dashboardUrl} target="_blank" rel="noopener noreferrer">
                  Dashboard
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-full text-[length:var(--f-button)] font-bold border-primary/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm px-2"
                onClick={() => onReset('treatment')}
              >
                Prenota di nuovo
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3 w-full">
              <Button 
                className="w-full h-14 rounded-full font-bold text-[length:var(--f-button)] shadow-lg flex items-center justify-center gap-2 text-white bg-primary hover:bg-primary/95 hover:scale-[1.03] hover:shadow-xl active:scale-[0.97] transition-all duration-300"
                onClick={() => onReset(retryStep)}
              >
                <RefreshCcw className="w-5 h-5" />
                Riprova a prenotare
              </Button>
              
              <Button 
                variant="outline" 
                asChild
                className="w-full h-14 rounded-full text-[16px] sm:text-[14px] font-bold border-border hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <a href="tel:+390123456789">
                  <Phone className="w-5 h-5" />
                  Contatta lo Studio
                </a>
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full h-10 rounded-full text-[14px] text-muted-foreground hover:text-foreground font-medium"
              onClick={() => onReset('home')}
            >
              Torna alla home
            </Button>
          </>
        )}

        {/* Desktop-only Close Action (Success only) */}
        {isSuccess && (
          <Button 
            variant="ghost" 
            className="hidden sm:flex w-full h-9 rounded-full text-[14px] sm:text-sm text-muted-foreground hover:text-foreground font-medium"
            onClick={() => onReset('home')}
          >
            Chiudi
          </Button>
        )}
      </div>
    </div>
  );
}

import { CheckCircle2, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BookingFooterProps {
  treatmentName?: string;
  dateTime?: string;
  doctorName?: string;
  patientName?: string;
  currentStep: string;
  onEdit?: (step: 'treatment' | 'datetime' | 'doctor' | 'contact') => void;
}

export function BookingFooter({ treatmentName, dateTime, doctorName, patientName, currentStep, onEdit }: BookingFooterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [confirmingEdit, setConfirmingEdit] = useState<{ id: string, label: string | undefined, step: any } | null>(null);

  const getStepQuestion = (id: string) => {
    const questions: Record<string, string> = {
      treatment: 'Vuoi modificare il servizio?',
      datetime: "Vuoi modificare la data e l'ora?",
      doctor: 'Vuoi cambiare dott./dott.ssa?',
      patient: 'Vuoi modificare i tuoi dati?'
    };
    return questions[id] || `Vuoi modificare quest'area?`;
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [treatmentName, dateTime, doctorName, patientName]);

  if (!treatmentName && !dateTime && !doctorName && !patientName) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const chips = [
    { id: 'treatment', label: treatmentName, step: 'treatment' as const },
    { id: 'datetime', label: dateTime, step: 'datetime' as const },
    { id: 'doctor', label: doctorName, step: 'doctor' as const },
    { id: 'patient', label: patientName, step: 'contact' as const },
  ].filter(chip => chip.label);

  return (
    <div className={cn(
      "w-full bg-white border-t border-muted px-4 shrink-0 relative z-20 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-bottom-4 duration-500 flex items-center booking-footer transition-all duration-300",
      "h-[72px] pt-2 pb-3.5 sm:h-[82px] sm:pt-3 sm:pb-4.5"
    )}>
      <div className="w-full max-w-full mx-auto relative">
        
        {confirmingEdit ? (
          <div className="flex items-center justify-between animate-in fade-in zoom-in-95 duration-200 px-1 w-full overflow-hidden">
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-[length:var(--f-base)] font-bold text-foreground leading-tight truncate">
                {getStepQuestion(confirmingEdit.id)}
              </p>
              {(confirmingEdit.id === 'treatment' || confirmingEdit.id === 'datetime') && (
                <>
                  <p className="text-[length:var(--f-small)] text-muted-foreground leading-tight truncate mt-1">
                    Gli step successivi verranno resettati
                  </p>
                  {patientName && (
                    <p className="text-[length:var(--f-small)] text-primary/70 font-semibold leading-tight truncate mt-0.5">
                      (eccetto i tuoi dati)
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button 
                onClick={() => setConfirmingEdit(null)}
                className="w-11 h-11 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Annulla modifica"
                title="Annulla"
              >
                <X className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  onEdit?.(confirmingEdit.step);
                  setConfirmingEdit(null);
                }}
                className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all active:scale-95"
                aria-label="Conferma modifica"
                title="Sì, Modifica"
              >
                <Check className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          </div>
        ) : (
          <div className="relative flex items-center">
            {/* Left Arrow */}
            {showLeftArrow && (
              <button 
                onClick={() => scroll('left')}
                aria-label="Scorri a sinistra"
                className="absolute left-0 z-10 h-11 w-11 bg-gradient-to-r from-white via-white to-transparent flex items-center justify-start text-primary"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Chips Container */}
            <div 
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex gap-3 overflow-x-auto scrollbar-none py-1 px-2 mask-linear-fade"
            >
              {chips.map((chip) => {
                const isActive = chip.step === currentStep;
                const getAriaLabel = () => {
                  let value = chip.label || "";
                  
                  // Format date for ARIA if it's the datetime chip
                  if (chip.id === 'datetime') {
                    const monthMap: Record<string, string> = {
                      'Gen': 'gennaio', 'Feb': 'febbraio', 'Mar': 'marzo', 'Apr': 'aprile',
                      'Mag': 'maggio', 'Giu': 'giugno', 'Lug': 'luglio', 'Ago': 'agosto',
                      'Set': 'settembre', 'Ott': 'ottobre', 'Nov': 'novembre', 'Dic': 'dicembre'
                    };
                    Object.entries(monthMap).forEach(([short, long]) => {
                      const regex = new RegExp(`${short}\\s(\\d+)`, 'i');
                      if (regex.test(value)) {
                        value = value.replace(regex, (_, day) => `${day} ${long}`);
                      }
                    });
                  }

                  if (isActive) return `Stai visualizzando: ${value}`;
                  const prefixes: Record<string, string> = {
                    treatment: 'Modifica servizio scelto: ',
                    datetime: 'Modifica data e ora scelti: ',
                    doctor: 'Modifica dottore scelto: ',
                    patient: 'Modifica i tuoi dati: '
                  };
                  return (prefixes[chip.id] || 'Modifica ') + value;
                };

                return (
                  <div 
                    key={chip.id}
                    role={isActive ? undefined : "button"}
                    tabIndex={isActive ? -1 : 0}
                    aria-label={getAriaLabel()}
                    onClick={() => !isActive && setConfirmingEdit(chip)}
                    onKeyDown={(e) => {
                      if (!isActive && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        setConfirmingEdit(chip);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-full border transition-all group shrink-0 min-h-[44px]",
                      isActive 
                        ? "bg-primary text-white border-primary cursor-default opacity-90 shadow-sm" 
                        : "bg-primary/5 border-primary/20 cursor-pointer hover:bg-primary/10 active:scale-95"
                    )}
                  >
                    <CheckCircle2 className={cn("w-3.5 h-3.5", isActive ? "text-white" : "text-primary")} />
                    <span className={cn("text-[length:var(--f-base)] font-bold tracking-tight", isActive ? "text-white" : "text-foreground/80")}>
                      {chip.label || ""}
                    </span>
                    {!isActive && (
                      <div className="ml-1 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[9px] font-black text-primary">✎</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
              <button 
                onClick={() => scroll('right')}
                aria-label="Scorri a destra"
                className="absolute right-0 z-10 h-11 w-11 bg-gradient-to-l from-white via-white to-transparent flex items-center justify-end text-primary"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

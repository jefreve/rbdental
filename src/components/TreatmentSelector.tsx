import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TreatmentSelectorProps {
  onSelect: (treatmentId: string) => void;
  direction?: 'forward' | 'backward';
}

const TREATMENTS = [
  { id: 'igiene', name: 'Igiene Dentale', description: 'Pulizia professionale per mantenere il tuo sorriso sano.', duration: '45 min' },
  { id: 'controllo', name: 'Visita di Controllo', description: 'Check-up completo della tua salute orale.', duration: '30 min' },
  { id: 'urgenza', name: 'Urgenza', description: 'Dolore o problema che richiede attenzione immediata.', duration: '30 min' },
  { id: 'sbiancamento', name: 'Sbiancamento', description: 'Trattamento estetico per denti più bianchi.', duration: '60 min' }
];

export function TreatmentSelector({ onSelect, direction = 'forward' }: TreatmentSelectorProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      "w-full max-w-md mx-auto animate-in fade-in duration-700",
      direction === 'forward' ? "slide-in-from-right-4" : "slide-in-from-left-4"
    )}>
      <h2 className="text-[20px] sm:text-[18px] font-bold mb-6 mt-4 text-center px-1 font-heading">Scegli un servizio</h2>

      <div className="space-y-3 text-left">
        {isLoading ? (
          // Skeleton Treatments
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full p-4 rounded-xl border border-muted-foreground/10 bg-card/50">
              <div className="flex justify-between items-start mb-2">
                <div className="h-5 w-32 bg-muted-foreground/15 rounded-md animate-pulse" />
                <div className="h-4 w-12 bg-muted-foreground/10 rounded-md animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-muted-foreground/10 rounded animate-pulse" />
                <div className="h-3 w-2/3 bg-muted-foreground/10 rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : (
          TREATMENTS.map((treatment) => (
            <button
              key={treatment.id}
              onClick={() => onSelect(treatment.id)}
              aria-label={`${treatment.name}, durata ${treatment.duration}. ${treatment.description}`}
              className="w-full p-4 rounded-xl border border-muted-foreground/20 hover:border-primary hover:shadow-md transition-all text-left group bg-card"
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-[18px] sm:text-[16px] group-hover:text-primary transition-colors">
                  {treatment.name}
                </h3>
                <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md text-muted-foreground">
                  {treatment.duration}
                </span>
              </div>
              <p className="text-[16px] sm:text-[14px] text-muted-foreground leading-snug">
                {treatment.description}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

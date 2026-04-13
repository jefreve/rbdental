import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useWidget } from "@/context/WidgetContext";

interface TreatmentSelectorProps {
  onSelect: (treatmentId: string) => void;
  direction?: 'forward' | 'backward';
}

const TREATMENTS = [
  { id: 'chirurgia', name: 'CHIRURGIA ORALE', description: 'Interventi chirurgici specialistici del cavo orale.', duration: '60 min' },
  { id: 'endodonzia', name: 'ENDODONZIA', description: 'Cura dei canali radicolari e dei tessuti interni del dente.', duration: '45 min' },
  { id: 'igiene', name: 'IGIENE E PROFILASSI', description: 'Pulizia professionale e prevenzione delle patologie orali.', duration: '45 min' },
  { id: 'implantologia', name: 'IMPLANTOLOGIA', description: 'Sostituzione di denti mancanti con impianti osteointegrati.', duration: '60 min' },
  { id: 'estetica_dentale', name: 'ESTETICA DENTALE', description: 'Trattamenti per migliorare l\'aspetto estetico del sorriso.', duration: '45 min' },
  { id: 'ortodonzia', name: 'ORTODONZIA', description: 'Correzione della posizione dei denti e delle mascelle.', duration: '30 min' },
  { id: 'protesi', name: 'PROTESI', description: 'Soluzioni fisse o mobili per ripristinare la funzionalità masticatoria.', duration: '60 min' },
  { id: 'medicina_estetica', name: 'MEDICINA ESTETICA', description: 'Trattamenti estetici non invasivi per il viso.', duration: '45 min' }
];

export function TreatmentSelector({ onSelect, direction = 'forward' }: TreatmentSelectorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { config } = useWidget();


  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      "w-full max-w-md mx-auto animate-in fade-in duration-700",
      direction === 'forward' ? "slide-in-from-right-4" : "slide-in-from-left-4"
    )}>
      <div className="mb-6 mt-4 text-center">
        <h2 className="text-[length:var(--f-title)] font-[var(--f-w-title)] tracking-[var(--f-ls-title)] px-1 font-heading">
          {config.texts?.treatmentTitle || "Scegli un servizio"}
        </h2>
        {config.texts?.treatmentSubtitle && (
          <p className="text-[length:var(--f-base)] text-muted-foreground mt-1 opacity-80">
            {config.texts.treatmentSubtitle}
          </p>
        )}
      </div>

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
                <h3 className="font-[var(--f-w-title)] text-[length:var(--f-button)] group-hover:text-primary transition-colors">
                  {treatment.name}
                </h3>
                <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md text-muted-foreground">
                  {treatment.duration}
                </span>
              </div>
              <p className="text-[length:var(--f-base)] font-[var(--f-w-base)] text-muted-foreground leading-snug">
                {treatment.description}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Doctor {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface DoctorSelectorProps {
  onSelect: (doctorId: string, doctorName: string) => void;
  direction?: 'forward' | 'backward';
  doctors: Doctor[];
}

export const DOCTORS: Doctor[] = [
  { id: 'bosco', name: 'Dr. Roberto Bosco', role: 'Odontoiatra', avatar: 'RB' },
  { id: 'minio', name: 'Dr.ssa Angela Minio', role: 'Medicina Estetica', avatar: 'AM' }
];

export function DoctorSelector({ onSelect, direction = 'forward', doctors }: DoctorSelectorProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      "w-full max-w-md mx-auto animate-in fade-in duration-700",
      direction === 'forward' ? "slide-in-from-right-4" : "slide-in-from-left-4"
    )}>
      <div className="mb-6 text-center px-1">
        <h2 className="text-[20px] sm:text-[18px] font-bold font-heading">Scegli il tuo dentista</h2>
        <p className="text-[16px] sm:text-[14px] text-muted-foreground whitespace-normal">
          Opzioni disponibili in base a servizio e data scelti
        </p>
      </div>

      <div className="space-y-3 text-left">
        {isLoading ? (
          // Skeleton Cards
          [1, 2].map((i) => (
            <div key={i} className="w-full p-4 flex items-center gap-4 rounded-xl border border-muted-foreground/10 bg-card/50">
              <div className="w-12 h-12 rounded-full bg-muted-foreground/15 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 bg-muted-foreground/15 rounded-md animate-pulse" />
                <div className="h-4 w-24 bg-muted-foreground/10 rounded-md animate-pulse" />
              </div>
            </div>
          ))
        ) : (
          doctors.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onSelect(doc.id, doc.name)}
              aria-label={`${doc.name}, ${doc.role}`}
              className="w-full p-4 flex items-center gap-4 rounded-xl border border-muted-foreground/20 hover:border-primary hover:shadow-md transition-all group bg-card"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                {doc.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[18px] sm:text-[16px] group-hover:text-primary transition-colors">
                  {doc.name}
                </h3>
                <p className="text-[16px] sm:text-[14px] text-muted-foreground">
                  {doc.role}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

import { CheckCircle2 } from "lucide-react";

interface BookingSummaryProps {
  treatmentName?: string;
  dateTime?: string;
  doctorName?: string;
  onEdit?: (step: 'treatment' | 'datetime' | 'doctor') => void;
}

export function BookingSummary({ treatmentName, dateTime, doctorName, onEdit }: BookingSummaryProps) {
  if (!treatmentName && !dateTime && !doctorName) return null;

  return (
    <div className="w-full max-w-md mx-auto mb-6 bg-muted/30 border border-muted rounded-xl p-3 text-[14px] animate-in fade-in slide-in-from-top-4">
      <div className="flex flex-col gap-2">
        {treatmentName && (
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-foreground/80">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              {treatmentName}
            </span>
            <button onClick={() => onEdit?.('treatment')} className="text-xs text-primary hover:underline transition-colors">Modifica</button>
          </div>
        )}
        {dateTime && (
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-foreground/80">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              {dateTime}
            </span>
            <button onClick={() => onEdit?.('datetime')} className="text-xs text-primary hover:underline transition-colors">Modifica</button>
          </div>
        )}
        {doctorName && (
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-foreground/80">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              {doctorName}
            </span>
            <button onClick={() => onEdit?.('doctor')} className="text-xs text-primary hover:underline transition-colors">Modifica</button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimeSelectorProps {
  onSelect: (datetime: string) => void;
  serviceDuration?: string; // e.g., "45 min"
  direction?: 'forward' | 'backward';
}

// Helper to generate 4 weeks of slots starting from today
const generateDynamicDays = () => {
  const days = [];
  const today = new Date();
  
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

  for (let i = 0; i < 30; i++) {
    const current = new Date(today);
    current.setDate(today.getDate() + i);
    
    const dayOfWeek = current.getDay();
    const dayOfMonth = current.getDate();
    const month = months[current.getMonth()];
    
    let label = i === 0 ? 'Oggi' : i === 1 ? 'Domani' : weekDays[dayOfWeek];
    const dateLabel = `${month} ${dayOfMonth}`;
    
    let slots: string[] = [];
    if (dayOfWeek === 0) {
      // Sunday is closed
      slots = [];
    } else if (dayOfWeek === 6) {
      // Saturday morning only
      slots = ['08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
    } else {
      // Regular clinic hours
      slots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
        '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
      ];
    }
    
    days.push({
      id: i + 1,
      label,
      date: dateLabel,
      slots
    });
  }
  return days;
};

const MOCK_DAYS = generateDynamicDays();

export function DateTimeSelector({ onSelect, serviceDuration = "30 min", direction = "forward" }: DateTimeSelectorProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const visibleDaysCount = 4;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const visibleSlotsCount = 5;

  const nextDays = () => {
    if (startIndex + visibleDaysCount < MOCK_DAYS.length) {
      setStartIndex(prev => prev + visibleDaysCount);
    }
  };

  const prevDays = () => {
    if (startIndex > 0) {
      setStartIndex(prev => Math.max(0, prev - visibleDaysCount));
    }
  };

  const currentDays = MOCK_DAYS.slice(startIndex, startIndex + visibleDaysCount);
  
  // Calculate all unique slots for the current visible days to ensure symmetry
  const allUniqueSlots = Array.from(new Set(currentDays.flatMap(day => day.slots))).sort((a, b) => {
    return a.localeCompare(b);
  });

  const visibleSlots = isExpanded ? allUniqueSlots : allUniqueSlots.slice(0, visibleSlotsCount);
  const hasMoreSlots = allUniqueSlots.length > visibleSlotsCount;

  return (
    <div className={cn(
      "w-full max-w-full animate-in fade-in duration-700 flex flex-col bg-white",
      direction === 'forward' ? "slide-in-from-right-4" : "slide-in-from-left-4"
    )}>
      <div className="flex items-center justify-center shrink-0 px-2 pt-10 pb-4">
        <h2 className="text-[20px] sm:text-[18px] font-bold flex items-center gap-3 font-heading">
          Scegli data e orario
          <span className="text-[14px] sm:text-[12px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary/20">
            {serviceDuration}
          </span>
        </h2>
      </div>

      {/* Grid Container */}
      <div className="relative bg-transparent flex flex-col flex-1 overflow-x-hidden">
        {/* Navigation Sticky Header (Days) */}
        <div className="flex items-stretch justify-between bg-white border-y border-muted-foreground/5 shrink-0 sticky top-0 z-40 h-20 overflow-x-hidden">
          {/* Left Arrow (Previous Days) */}
          <div className="w-12 flex items-center justify-start pl-1">
            <button 
              onClick={prevDays}
              disabled={startIndex === 0}
              aria-label="Giorni precedenti"
              className={cn(
                "h-11 w-11 rounded-full bg-white border border-primary shadow-sm flex items-center justify-center transition-all text-primary shrink-0",
                startIndex === 0 ? "opacity-0 invisible" : "opacity-100 visible hover:bg-primary/5 active:scale-95"
              )}
            >
              <ChevronLeft className="w-5 h-5 mr-0.5" />
            </button>
          </div>

          {/* Days Headers */}
          <div className="flex flex-1 items-stretch gap-1.5 sm:gap-2 min-w-0">
            {currentDays.map((day) => (
              <div key={day.id} className="flex-1 min-w-0 flex flex-col items-center justify-center py-3">
                <span className="text-[13px] sm:text-[12px] font-bold text-muted-foreground/60 leading-tight uppercase tracking-wider truncate w-full text-center">{day.label}</span>
                <span className="text-[15px] sm:text-[15px] font-black text-foreground mt-1 whitespace-nowrap tracking-tighter truncate w-full text-center">{day.date}</span>
              </div>
            ))}
          </div>

          {/* Right Arrow (Next Days) */}
          <div className="w-12 flex items-center justify-end pr-1">
            <button 
              onClick={nextDays}
              disabled={startIndex + visibleDaysCount >= MOCK_DAYS.length}
              aria-label="Prossimi giorni"
              className={cn(
                "h-11 w-11 rounded-full bg-white border border-primary shadow-sm flex items-center justify-center transition-all text-primary shrink-0",
                startIndex + visibleDaysCount >= MOCK_DAYS.length ? "opacity-0 invisible" : "opacity-100 visible hover:bg-primary/5 active:scale-95"
              )}
            >
              <ChevronRight className="w-5 h-5 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Slots Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-premium bg-transparent">
          <div className="flex min-h-full">
            {/* Left Buffer for Scroll Area - Perfectly matched with Arrow Width (48px) */}
            <div className="w-12 shrink-0 border-r border-transparent" />
            
            <div className="flex flex-1 gap-1.5 sm:gap-2 min-w-0">
              {isLoading ? (
                // Column based skeletons
                [1, 2, 3, 4].map((col) => (
                  <div key={col} className="flex-1 min-w-0 py-2.5 flex flex-col gap-3">
                    {[1, 2, 3, 4].map((row) => (
                      <div key={row} className="w-full max-w-[72px] mx-auto rounded-md bg-muted-foreground/10 animate-pulse h-12 shrink-0" />
                    ))}
                  </div>
                ))
              ) : (
                currentDays.map((day) => (
                  <div key={day.id} className="flex-1 min-w-0 py-2.5 flex flex-col gap-3">
                    {visibleSlots.map((time) => {
                      const isAvailable = day.slots.includes(time);
                      return (
                        <button
                          key={`${day.date}-${time}`}
                          onClick={() => isAvailable && onSelect(`${day.date} alle ${time}`)}
                          disabled={!isAvailable}
                          aria-label={isAvailable ? `${day.label} ${day.date} alle ore ${time}` : undefined}
                          className={cn(
                            "w-full max-w-[72px] mx-auto py-2 px-0 rounded-md transition-all font-bold sm:font-medium text-[13px] sm:text-[14px] tracking-tighter flex items-center justify-center h-12",
                            isAvailable 
                              ? "bg-transparent text-primary border border-primary/20 shadow-sm hover:bg-primary/5 active:scale-95" 
                              : "bg-transparent text-muted-foreground/20 cursor-not-allowed opacity-40 shadow-none"
                          )}
                        >
                          {isAvailable ? time : "X"}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Right Buffer for Scroll Area - Perfectly matched with Arrow Width (48px) */}
            <div className="w-12 shrink-0 border-l border-transparent" />
          </div>
        </div>

        {/* Unified "Show More" Button - Always visible below the scroll area */}
        {hasMoreSlots && (
          <div className="shrink-0 py-4 flex justify-center bg-white border-t border-muted-foreground/5 z-20">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Mostra meno orari" : "Mostra più orari"}
              aria-expanded={isExpanded}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-primary/30 text-[11px] font-black text-primary shadow-lg hover:bg-primary/5 transition-all transform active:scale-95 uppercase tracking-widest"
            >
              {isExpanded ? (
                <><Minus className="w-4 h-4" /> orari</>
              ) : (
                <><Plus className="w-4 h-4" /> orari</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsuranceSelectorProps {
  options: string[];
  selected?: string;
  onSelect: (insurance: string) => void;
}

export function InsuranceSelector({ options, selected, onSelect }: InsuranceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <label htmlFor="insurance-trigger" className="block text-[16px] font-semibold mb-2">
        Assicurazione o Convenzione
      </label>
      <button
        id="insurance-trigger"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        aria-label={selected ? `Assicurazione selezionata: ${selected}` : "Scegli un'opzione"}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full h-12 flex items-center justify-between px-4 py-2 rounded-full border border-input bg-transparent text-[16px] shadow-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all hover:bg-muted/30 group/select"
      >
        <span className={cn("truncate pr-4 text-[16px]", !selected && "text-muted-foreground font-normal overflow-visible")}>
          {selected || "Scegli un'opzione"}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform shrink-0 group-hover/select:text-primary", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full mt-2 left-0 w-full bg-white border border-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] z-[1000] rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200 origin-top"
          onMouseDown={(e) => e.stopPropagation()} 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-3 border-b sticky top-0 bg-white rounded-t-2xl z-20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Cerca assicurazione..."
                aria-label="Cerca assicurazione"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()} 
                className="w-full h-11 pl-9 pr-4 bg-muted/50 rounded-lg text-[16px] focus:outline-none focus:ring-1 focus:ring-primary border-none"
              />
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto pl-3 pr-1 py-1 scrollbar-premium overscroll-contain">
             <button
               type="button"
               onClick={() => { onSelect(""); setIsOpen(false); setSearch(""); }}
               className="w-full h-12 flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-muted/50 transition-colors text-left"
             >
               <span className="font-semibold text-muted-foreground">Nessuna assicurazione</span>
               {!selected && <Check className="w-4 h-4 text-primary" />}
             </button>
             
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onSelect(opt); setIsOpen(false); setSearch(""); }}
                  className="w-full h-12 flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <span className="truncate">{opt}</span>
                  {selected === opt && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))
            ) : (
              <div className="p-4 text-xs text-center text-muted-foreground">
                Nessuna assicurazione trovata
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

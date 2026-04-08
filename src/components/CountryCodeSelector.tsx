import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Country {
  name: string;
  code: string;
}

const COUNTRIES: Country[] = [
  { name: "Abkhazia", code: "+7 840" },
  { name: "Afghanistan", code: "+93" },
  { name: "Albania", code: "+355" },
  { name: "Algeria", code: "+213" },
  { name: "American Samoa", code: "+1 684" },
  { name: "Andorra", code: "+376" },
  { name: "Angola", code: "+244" },
  { name: "Anguilla", code: "+1 264" },
  { name: "Antigua and Barbuda", code: "+1 268" },
  { name: "Argentina", code: "+54" },
  { name: "Armenia", code: "+374" },
  { name: "Aruba", code: "+297" },
  { name: "Ascension", code: "+247" },
  { name: "Australia", code: "+61" },
  { name: "Australian External Territories", code: "+672" },
  { name: "Austria", code: "+43" },
  { name: "Azerbaijan", code: "+994" },
  { name: "Bahamas", code: "+1 242" },
  { name: "Bahrain", code: "+973" },
  { name: "Bangladesh", code: "+880" },
  { name: "Barbados", code: "+1 246" },
  { name: "Barbuda", code: "+1 268" },
  { name: "Belarus", code: "+375" },
  { name: "Belgium", code: "+32" },
  { name: "Belize", code: "+501" },
  { name: "Benin", code: "+229" },
  { name: "Bermuda", code: "+1 441" },
  { name: "Bhutan", code: "+975" },
  { name: "Bolivia", code: "+591" },
  { name: "Bosnia and Herzegovina", code: "+387" },
  { name: "Botswana", code: "+267" },
  { name: "Brazil", code: "+55" },
  { name: "British Indian Ocean Territory", code: "+246" },
  { name: "British Virgin Islands", code: "+1 284" },
  { name: "Brunei", code: "+673" },
  { name: "Bulgaria", code: "+359" },
  { name: "Burkina Faso", code: "+226" },
  { name: "Burundi", code: "+257" },
  { name: "Cambodia", code: "+855" },
  { name: "Cameroon", code: "+237" },
  { name: "Canada", code: "+1" },
  { name: "Cape Verde", code: "+238" },
  { name: "Cayman Islands", code: "+345" },
  { name: "Central African Republic", code: "+236" },
  { name: "Chad", code: "+235" },
  { name: "Chile", code: "+56" },
  { name: "China", code: "+86" },
  { name: "Christmas Island", code: "+61" },
  { name: "Cocos-Keeling Islands", code: "+61" },
  { name: "Colombia", code: "+57" },
  { name: "Comoros", code: "+269" },
  { name: "Congo", code: "+242" },
  { name: "Congo, Dem. Rep. of (Zaire)", code: "+243" },
  { name: "Cook Islands", code: "+682" },
  { name: "Costa Rica", code: "+506" },
  { name: "Croatia", code: "+385" },
  { name: "Cuba", code: "+53" },
  { name: "Curacao", code: "+599" },
  { name: "Cyprus", code: "+357" },
  { name: "Czech Republic", code: "+420" },
  { name: "Denmark", code: "+45" },
  { name: "Diego Garcia", code: "+246" },
  { name: "Djibouti", code: "+253" },
  { name: "Dominica", code: "+1 767" },
  { name: "Dominican Republic", code: "+1 809" },
  { name: "East Timor", code: "+670" },
  { name: "Easter Island", code: "+56" },
  { name: "Ecuador", code: "+593" },
  { name: "Egypt", code: "+20" },
  { name: "El Salvador", code: "+503" },
  { name: "Equatorial Guinea", code: "+240" },
  { name: "Eritrea", code: "+291" },
  { name: "Estonia", code: "+372" },
  { name: "Ethiopia", code: "+251" },
  { name: "Falkland Islands", code: "+500" },
  { name: "Faroe Islands", code: "+298" },
  { name: "Fiji", code: "+679" },
  { name: "Finland", code: "+358" },
  { name: "France", code: "+33" },
  { name: "French Antilles", code: "+596" },
  { name: "French Guiana", code: "+594" },
  { name: "French Polynesia", code: "+689" },
  { name: "Gabon", code: "+241" },
  { name: "Gambia", code: "+220" },
  { name: "Georgia", code: "+995" },
  { name: "Germany", code: "+49" },
  { name: "Ghana", code: "+233" },
  { name: "Gibraltar", code: "+350" },
  { name: "Greece", code: "+30" },
  { name: "Greenland", code: "+299" },
  { name: "Grenada", code: "+1 473" },
  { name: "Guadeloupe", code: "+590" },
  { name: "Guam", code: "+1 671" },
  { name: "Guatemala", code: "+502" },
  { name: "Guinea", code: "+224" },
  { name: "Guinea-Bissau", code: "+245" },
  { name: "Guyana", code: "+595" },
  { name: "Haiti", code: "+509" },
  { name: "Honduras", code: "+504" },
  { name: "Hong Kong SAR China", code: "+852" },
  { name: "Hungary", code: "+36" },
  { name: "Iceland", code: "+354" },
  { name: "India", code: "+91" },
  { name: "Indonesia", code: "+62" },
  { name: "Iran", code: "+98" },
  { name: "Iraq", code: "+964" },
  { name: "Ireland", code: "+353" },
  { name: "Israel", code: "+972" },
  { name: "Italy", code: "+39" },
  { name: "Ivory Coast", code: "+225" },
  { name: "Jamaica", code: "+1 876" },
  { name: "Japan", code: "+81" },
  { name: "Jordan", code: "+962" },
  { name: "Kazakhstan", code: "+7 7" },
  { name: "Kenya", code: "+254" },
  { name: "Kiribati", code: "+686" },
  { name: "Kuwait", code: "+965" },
  { name: "Kyrgyzstan", code: "+996" },
  { name: "Laos", code: "+856" },
  { name: "Latvia", code: "+371" },
  { name: "Lebanon", code: "+961" },
  { name: "Lesotho", code: "+266" },
  { name: "Liberia", code: "+231" },
  { name: "Libya", code: "+218" },
  { name: "Liechtenstein", code: "+423" },
  { name: "Lithuania", code: "+370" },
  { name: "Luxembourg", code: "+352" },
  { name: "Macau SAR China", code: "+853" },
  { name: "Macedonia", code: "+389" },
  { name: "Madagascar", code: "+261" },
  { name: "Malawi", code: "+265" },
  { name: "Malaysia", code: "+60" },
  { name: "Maldives", code: "+960" },
  { name: "Mali", code: "+223" },
  { name: "Malta", code: "+356" },
  { name: "Marshall Islands", code: "+692" },
  { name: "Martinique", code: "+596" },
  { name: "Mauritania", code: "+222" },
  { name: "Mauritius", code: "+230" },
  { name: "Mayotte", code: "+262" },
  { name: "Mexico", code: "+52" },
  { name: "Micronesia", code: "+691" },
  { name: "Midway Island", code: "+1 808" },
  { name: "Moldova", code: "+373" },
  { name: "Monaco", code: "+377" },
  { name: "Mongolia", code: "+976" },
  { name: "Montenegro", code: "+382" },
  { name: "Montserrat", code: "+1 664" },
  { name: "Morocco", code: "+212" },
  { name: "Myanmar", code: "+95" },
  { name: "Namibia", code: "+264" },
  { name: "Nauru", code: "+674" },
  { name: "Nepal", code: "+977" },
  { name: "Netherlands", code: "+31" },
  { name: "Netherlands Antilles", code: "+599" },
  { name: "Nevis", code: "+1 869" },
  { name: "New Caledonia", code: "+687" },
  { name: "New Zealand", code: "+64" },
  { name: "Nicaragua", code: "+505" },
  { name: "Niger", code: "+227" },
  { name: "Nigeria", code: "+234" },
  { name: "Niue", code: "+683" },
  { name: "Norfolk Island", code: "+672" },
  { name: "North Korea", code: "+850" },
  { name: "Northern Mariana Islands", code: "+1 670" },
  { name: "Norway", code: "+47" },
  { name: "Oman", code: "+968" },
  { name: "Pakistan", code: "+92" },
  { name: "Palau", code: "+680" },
  { name: "Palestinian Territory", code: "+970" },
  { name: "Panama", code: "+507" },
  { name: "Papua New Guinea", code: "+675" },
  { name: "Paraguay", code: "+595" },
  { name: "Peru", code: "+51" },
  { name: "Philippines", code: "+63" },
  { name: "Poland", code: "+48" },
  { name: "Portugal", code: "+351" },
  { name: "Puerto Rico", code: "+1 787" },
  { name: "Qatar", code: "+974" },
  { name: "Reunion", code: "+262" },
  { name: "Romania", code: "+40" },
  { name: "Russia", code: "+7" },
  { name: "Rwanda", code: "+250" },
  { name: "Samoa", code: "+685" },
  { name: "San Marino", code: "+378" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "Senegal", code: "+221" },
  { name: "Serbia", code: "+381" },
  { name: "Seychelles", code: "+248" },
  { name: "Sierra Leone", code: "+232" },
  { name: "Singapore", code: "+65" },
  { name: "Slovakia", code: "+421" },
  { name: "Slovenia", code: "+386" },
  { name: "Solomon Islands", code: "+677" },
  { name: "South Africa", code: "+27" },
  { name: "South Georgia and the South Sandwich Islands", code: "+500" },
  { name: "South Korea", code: "+82" },
  { name: "Spain", code: "+34" },
  { name: "Sri Lanka", code: "+94" },
  { name: "Sudan", code: "+249" },
  { name: "Suriname", code: "+597" },
  { name: "Swaziland", code: "+268" },
  { name: "Sweden", code: "+46" },
  { name: "Switzerland", code: "+41" },
  { name: "Syria", code: "+963" },
  { name: "Taiwan", code: "+886" },
  { name: "Tajikistan", code: "+992" },
  { name: "Tanzania", code: "+255" },
  { name: "Thailand", code: "+66" },
  { name: "Timor Leste", code: "+670" },
  { name: "Togo", code: "+228" },
  { name: "Tokelau", code: "+690" },
  { name: "Tonga", code: "+676" },
  { name: "Trinidad and Tobago", code: "+1 868" },
  { name: "Tunisia", code: "+216" },
  { name: "Turkey", code: "+90" },
  { name: "Turkmenistan", code: "+993" },
  { name: "Turks and Caicos Islands", code: "+1 649" },
  { name: "Tuvalu", code: "+688" },
  { name: "U.S. Virgin Islands", code: "+1 340" },
  { name: "Uganda", code: "+256" },
  { name: "Ukraine", code: "+380" },
  { name: "United Arab Emirates", code: "+971" },
  { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" },
  { name: "Uruguay", code: "+598" },
  { name: "Uzbekistan", code: "+998" },
  { name: "Vanuatu", code: "+678" },
  { name: "Venezuela", code: "+58" },
  { name: "Vietnam", code: "+84" },
  { name: "Wake Island", code: "+1 808" },
  { name: "Wallis and Futuna", code: "+681" },
  { name: "Yemen", code: "+967" },
  { name: "Zambia", code: "+260" },
  { name: "Zanzibar", code: "+255" },
  { name: "Zimbabwe", code: "+263" },
];

interface CountryCodeSelectorProps {
  value: string;
  onChange: (code: string) => void;
  hasError?: boolean;
}

export function CountryCodeSelector({ value, onChange, hasError }: CountryCodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter(
    (c) => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.code.includes(search)
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button - Solid background, pill shape */}
      <Button
        type="button"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        aria-label={`Seleziona prefisso internazionale. Corrente: ${value}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "w-[110px] h-12 px-4 flex items-center justify-between bg-[#F1F5F9] hover:bg-[#E2E8F0] text-foreground rounded-full transition-all border shadow-none",
          hasError 
            ? "border-destructive ring-destructive/20 ring-1 bg-transparent" 
            : "border-transparent"
        )}
      >
        <span className="text-[16px] font-semibold">{value}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {/* Popover Menu - Solid white, ultra-rounded, constrained width */}
      {isOpen && (
        <div 
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute top-full left-0 mt-3 w-[260px] bg-white border border-[#E2E8F0] rounded-[2rem] shadow-2xl z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
        >
          {/* Search Input Area */}
          <div className="p-4 bg-white sticky top-0 z-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Cerca prefisso o nazione"
                aria-label="Cerca prefisso o nazione"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-[16px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {/* Scrollable List - Constrained height */}
          <div className="max-h-[250px] overflow-y-auto px-2 pb-4 scrollbar-thin">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => (
                <button
                  key={`${c.name}-${c.code}`}
                  type="button"
                  aria-label={`${c.name}, prefisso ${c.code}`}
                  className="w-full px-4 py-3 text-left text-[14px] hover:bg-[#F1F5F9] rounded-xl flex items-center justify-between group transition-all duration-200"
                  onClick={() => {
                    onChange(c.code);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  <span className="truncate mr-4 text-[#1E293B] font-medium group-hover:text-primary transition-colors">
                    {c.name}
                  </span>
                  <span className="text-muted-foreground text-xs font-semibold shrink-0 bg-white px-2 py-1 rounded-md border border-[#E2E8F0] group-hover:border-primary/30 transition-all">
                    ({c.code})
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground italic flex flex-col items-center gap-2">
                <Search className="w-8 h-8 opacity-20 mb-1" />
                Nessuna nazione trovata
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

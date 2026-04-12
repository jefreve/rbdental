import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CountryCodeSelector } from "./CountryCodeSelector";
import { InsuranceSelector } from "./InsuranceSelector";
import { clinicConfig } from "@/config/clinicConfig";
import { cn } from "@/lib/utils";
import { useToast } from "./ui/use-toast";
import { Check } from "lucide-react";

interface ContactFormProps {
  onSubmit: (data: any) => void;
  onChange?: (data: any) => void;
  initialData?: any;
  direction?: 'forward' | 'backward';
}

// Simplified list since logic is now inside CountryCodeSelector
const DEFAULT_PREFIX = '+39';

export function ContactForm({ onSubmit, onChange, initialData, direction = 'forward' }: ContactFormProps) {
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phonePrefix, setPhonePrefix] = useState(initialData?.phonePrefix || DEFAULT_PREFIX);
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [insurance, setInsurance] = useState(initialData?.insurance || '');
  const [privacyAccepted, setPrivacyAccepted] = useState(initialData?.privacyAccepted || false);
  const [showErrors, setShowErrors] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const privacyRef = useRef<HTMLInputElement>(null);
  const { toast, dismissAll } = useToast();

  useEffect(() => {
    // Cleanup any active toasts when leaving the form
    return () => {
      dismissAll();
    };
  }, []);

  const updateField = (field: string, value: any) => {
    const newData = { firstName, lastName, email, phonePrefix, phoneNumber, notes, insurance, privacyAccepted, [field]: value };
    onChange?.(newData);
  };

  const isFirstNameValid = firstName.trim().length > 1;
  const isLastNameValid = lastName.trim().length > 1;
  const isEmailValid = email.includes('@') && email.length > 5;
  const isPhoneValid = phoneNumber.replace(/\s/g, '').length === 10;
  const isPrivacyValid = privacyAccepted;
  
  
  const isFormValid = isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid && isPrivacyValid;
  const isTopFieldsInvalid = !isFirstNameValid || !isLastNameValid || !isEmailValid || !isPhoneValid;

  return (
    <div 
      ref={formTopRef}
      className={cn(
        "w-full max-w-md mx-auto animate-in fade-in duration-700",
        direction === 'forward' ? "slide-in-from-right-4" : "slide-in-from-left-4"
      )}>
      <div className="mb-6 mt-4 text-center">
        <h2 className="text-[length:var(--f-title)] font-[var(--f-w-title)] tracking-[var(--f-ls-title)] font-heading">I tuoi dati</h2>
      </div>

      <form 
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid) {
            onSubmit({ firstName, lastName, email, phonePrefix, phoneNumber, notes, insurance });
          } else {
            setShowErrors(true);
            toast({
              description: "Alcuni campi obbligatori sono mancanti o errati. Controlla i dati inseriti.",
              variant: "destructive"
            });
            
            // Focus Management: find the first invalid field
            if (!isFirstNameValid) {
              firstNameRef.current?.focus();
            } else if (!isLastNameValid) {
              lastNameRef.current?.focus();
            } else if (!isPhoneValid) {
              phoneRef.current?.focus();
            } else if (!isEmailValid) {
              emailRef.current?.focus();
            } else if (!isPrivacyValid) {
              privacyRef.current?.focus();
            }

            if (isTopFieldsInvalid) {
              formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }} 
        className="space-y-4 text-left"
      >
        {/* Name and Surname Rows */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className={cn("block text-[length:var(--f-base)] font-[var(--f-w-title)] mb-2 transition-colors", showErrors && !isFirstNameValid && "text-destructive")}>
              Nome <span className={cn("text-primary transition-colors", showErrors && !isFirstNameValid && "text-destructive")}>*</span>
            </label>
            <input 
              id="firstName"
              ref={firstNameRef}
              type="text"
              placeholder="Es: Mario"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); updateField('firstName', e.target.value); }}
              aria-required="true"
              aria-invalid={showErrors && !isFirstNameValid}
              aria-describedby={showErrors && !isFirstNameValid ? "firstName-error" : undefined}
              className={cn(
                "w-full h-12 rounded-full border border-input bg-transparent px-4 py-2 text-[length:var(--f-base)] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all",
                showErrors && !isFirstNameValid && "border-destructive ring-destructive/20 ring-1"
              )}
            />
            {showErrors && !isFirstNameValid && (
              <p id="firstName-error" className="text-[length:var(--f-small)] text-destructive mt-1 ml-2 animate-in fade-in slide-in-from-top-1">Inserisci il nome</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className={cn("block text-[length:var(--f-base)] font-[var(--f-w-title)] mb-2 transition-colors", showErrors && !isLastNameValid && "text-destructive")}>
              Cognome <span className={cn("text-primary transition-colors", showErrors && !isLastNameValid && "text-destructive")}>*</span>
            </label>
            <input 
              id="lastName"
              ref={lastNameRef}
              type="text"
              placeholder="Es: Rossi"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); updateField('lastName', e.target.value); }}
              aria-required="true"
              aria-invalid={showErrors && !isLastNameValid}
              aria-describedby={showErrors && !isLastNameValid ? "lastName-error" : undefined}
              className={cn(
                "w-full h-12 rounded-full border border-input bg-transparent px-4 py-2 text-[length:var(--f-base)] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all",
                showErrors && !isLastNameValid && "border-destructive ring-destructive/20 ring-1"
              )}
            />
            {showErrors && !isLastNameValid && (
              <p id="lastName-error" className="text-[length:var(--f-small)] text-destructive mt-1 ml-2 animate-in fade-in slide-in-from-top-1">Inserisci il cognome</p>
            )}
          </div>
        </div>
        
        {/* Phone Input with Split Prefix and Visual Spacing */}
        <div>
          <label htmlFor="phoneNumber" className={cn("block text-[length:var(--f-base)] font-[var(--f-w-title)] mb-2 transition-colors", showErrors && !isPhoneValid && "text-destructive")}>
            Il tuo numero di telefono cellulare <span className={cn("text-primary transition-colors", showErrors && !isPhoneValid && "text-destructive")}>*</span>
          </label>
          <div className="grid grid-cols-[110px_1fr] gap-3 w-full">
            <CountryCodeSelector 
              value={phonePrefix}
              onChange={(code) => { setPhonePrefix(code); updateField('phonePrefix', code); }}
              hasError={showErrors && !isPhoneValid}
            />
            
            <input 
              id="phoneNumber"
              ref={phoneRef}
              type="tel"
              placeholder="Numero cellulare"
              value={phoneNumber}
              onChange={(e) => { 
                const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
                // Format: XXX XXX XXXX
                let formatted = raw;
                if (raw.length > 3 && raw.length <= 6) {
                  formatted = `${raw.slice(0, 3)} ${raw.slice(3)}`;
                } else if (raw.length > 6) {
                  formatted = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
                }
                setPhoneNumber(formatted); 
                updateField('phoneNumber', raw); 
              }}
              aria-required="true"
              aria-invalid={showErrors && !isPhoneValid}
              aria-describedby={showErrors && !isPhoneValid ? "phone-error" : undefined}
              className={cn(
                "w-full h-12 rounded-full border border-input bg-transparent px-4 py-2 text-[length:var(--f-base)] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all",
                showErrors && !isPhoneValid && "border-destructive ring-destructive/20 ring-1"
              )}
            />
          </div>
          {showErrors && !isPhoneValid && (
            <p id="phone-error" className="text-[length:var(--f-small)] text-destructive mt-1 ml-2 animate-in fade-in slide-in-from-top-1">Numero di telefono non valido</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className={cn("block text-[length:var(--f-base)] font-[var(--f-w-title)] mb-2 transition-colors", showErrors && !isEmailValid && "text-destructive")}>
            Indirizzo email <span className={cn("text-primary transition-colors", showErrors && !isEmailValid && "text-destructive")}>*</span>
          </label>
          <input 
            id="email"
            ref={emailRef}
            type="email"
            placeholder="mario.rossi@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); updateField('email', e.target.value); }}
            aria-required="true"
            aria-invalid={showErrors && !isEmailValid}
            aria-describedby={showErrors && !isEmailValid ? "email-error" : undefined}
            className={cn(
              "w-full h-12 rounded-full border border-input bg-transparent px-4 py-2 text-[length:var(--f-base)] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all",
              showErrors && !isEmailValid && "border-destructive ring-destructive/20 ring-1"
            )}
          />
          {showErrors && !isEmailValid && (
            <p id="email-error" className="text-[length:var(--f-small)] text-destructive mt-1 ml-2 animate-in fade-in slide-in-from-top-1">Inserisci un'email valida</p>
          )}
        </div>

        {/* Insurance Selector (Conditional) */}
        {clinicConfig.insurances && clinicConfig.insurances.length > 0 && (
          <InsuranceSelector 
            options={clinicConfig.insurances}
            selected={insurance}
            onSelect={(val) => { setInsurance(val); updateField('insurance', val); }}
          />
        )}

        {/* Additional Notes */}
        <div>
          <label htmlFor="notes" className="block text-[length:var(--f-base)] font-[var(--f-w-title)] mb-2">
            Informazioni aggiuntive
          </label>
          <textarea 
            id="notes"
            placeholder="Note per staff o dott./dott.ssa"
            rows={2}
            value={notes}
            onChange={(e) => { setNotes(e.target.value); updateField('notes', e.target.value); }}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-[length:var(--f-base)] shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>

        {/* Legal & Privacy Checkbox */}
        <div className={cn(
          "pt-4 pb-2 px-3 rounded-xl border border-transparent",
          showErrors && !isPrivacyValid && "bg-destructive/10 border-destructive/30"
        )}>
          <div className="flex items-start gap-3 group">
            <label className="relative mt-1 shrink-0 cursor-pointer">
              <div 
                className={cn(
                  "h-[22px] w-[22px] rounded-none border border-primary flex items-center justify-center",
                  privacyAccepted ? "bg-primary border-primary shadow-sm" : "bg-white border-primary/40",
                  showErrors && !isPrivacyValid && "border-destructive bg-destructive/5"
                )}
              >
                {privacyAccepted && <Check className="h-[16px] w-[16px] text-white stroke-[4]" />}
              </div>
              <input 
                id="privacy"
                ref={privacyRef}
                type="checkbox" 
                checked={privacyAccepted}
                onChange={(e) => { setPrivacyAccepted(e.target.checked); updateField('privacyAccepted', e.target.checked); }}
                aria-required="true"
                aria-invalid={showErrors && !isPrivacyValid}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
            <div className="text-[length:var(--f-base)] font-[var(--f-w-base)] text-muted-foreground leading-relaxed">
              <span className={cn(showErrors && !isPrivacyValid && "text-destructive font-medium")}>
                Prenotando l'appuntamento, accetti i nostri{' '}
                <a 
                  href="/terms.html" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline font-semibold" 
                  aria-label="Leggi i termini e condizioni (si apre in una nuova finestra)"
                >termini e condizioni</a>
                {' '}e confermi di aver letto e compreso la nostra{' '}
                <a 
                  href="/privacy.html" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline font-semibold" 
                  aria-label="Leggi l'informativa sulla privacy (si apre in una nuova finestra)"
                >informativa privacy</a>.
              </span>
              <br/><br/>
              <span className="font-medium text-black">Se questa è la tua prima prenotazione, creeremo il tuo account gratuito per salvare e gestire le tue visite.</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className={cn(
            "w-full h-12 text-[length:var(--f-button)] font-[var(--f-w-title)] tracking-[var(--f-ls-button)] text-white transition-all",
            showErrors && !isFormValid && "opacity-80 grayscale-[20%]"
          )}
        >
          Prenota Ora
        </Button>
      </form>
    </div>
  );
}

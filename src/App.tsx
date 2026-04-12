import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TreatmentSelector } from "./components/TreatmentSelector"
import { DateTimeSelector } from "./components/DateTimeSelector"
import { DoctorSelector, DOCTORS } from "./components/DoctorSelector"
import { ContactForm } from "./components/ContactForm"
import { OutcomeScreen } from "./components/OutcomeScreen"
import { BookingFooter } from "./components/BookingFooter"
import { SlotTimer } from "./components/SlotTimer"
import { ArrowLeft, Info, Clock, AlertTriangle } from "lucide-react"
import { Toaster } from "./components/ui/toaster"

type BookingState = {
  treatmentName?: string;
  serviceDuration?: string;
  dateTime?: string;
  doctorName?: string;
}

import { useWidget } from "./context/WidgetContext"

const ERROR_MESSAGES: Record<string, { title: string; message: string; retryStep: 'datetime' | 'contact' | 'home' | 'treatment' }> = {
  SLOT_TAKEN: {
    title: "Slot non più disponibile",
    message: "Spiacenti, lo slot scelto è stato appena prenotato da un altro paziente. Torna al calendario per sceglierne un altro.",
    retryStep: 'datetime'
  },
  TECHNICAL_ERROR: {
    title: "Errore di Connessione",
    message: "Non sei tu, siamo noi. Riprova a prenotare o contatta lo studio.",
    retryStep: 'contact'
  },
  GENERIC_ERROR: {
    title: "Prenotazione Fallita",
    message: "Non è stato possibile completare l'operazione. Se il problema persiste, contatta lo studio.",
    retryStep: 'contact'
  }
};

function App() {
  const isSessionValid = () => {
    const timestamp = localStorage.getItem('booking_timestamp');
    if (!timestamp) return false;
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    return now - parseInt(timestamp) < thirtyMinutes;
  };

  const [step, setStepBase] = useState<'home' | 'treatment' | 'datetime' | 'doctor' | 'contact' | 'success'>(() => {
    if (!isSessionValid()) return 'home';
    const saved = localStorage.getItem('booking_step');
    return (saved as any) || 'home';
  });
  const { isExpanded, setIsExpanded, setIsSuccessStep, config } = useWidget();
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [booking, setBooking] = useState<BookingState>(() => {
    if (!isSessionValid()) return {};
    const saved = localStorage.getItem('booking_data');
    return saved ? JSON.parse(saved) : {};
  });
  const [patientData, setPatientData] = useState<any>(() => {
    if (!isSessionValid()) return {};
    const saved = localStorage.getItem('patient_data');
    return saved ? JSON.parse(saved) : {};
  });
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);
  const [showDashboardNote, setShowDashboardNote] = useState(false);
  const [outcomeType, setOutcomeType] = useState<'success' | 'error'>('success');
  const [errorDetails, setErrorDetails] = useState<{ title?: string; message?: string; retryStep?: 'datetime' | 'contact' | 'home' | 'treatment' }>({});
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  // ─── DEMO CONFIG ─────────────────────────────────────────────────────────────
  // Modifica questi valori per le sales call o per il testing:
  const SLOT_LOCK_DURATION_S = 60;       // Durata riserva slot (secondi). Prod: 300
  const POLLING_INTERVAL_S   = 30;       // Ogni quanti secondi controllare disponibilità
  const AUTO_TAKE_ON_POLL    = 1;        // Al quale controllo simulare "slot rubato" (0 = mai)
  // ─────────────────────────────────────────────────────────────────────────────
  const SLOT_LOCK_DURATION_MS = SLOT_LOCK_DURATION_S * 1000;
  const [slotExpiresAt, setSlotExpiresAt] = useState<number | null>(null);
  const [slotExpired, setSlotExpired] = useState(false);
  const [showExpiredBanner, setShowExpiredBanner] = useState(false);
  const [slotTakenByOther, setSlotTakenByOther] = useState(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('booking_step', step);
    localStorage.setItem('booking_timestamp', Date.now().toString());
  }, [step]);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const isTextInput = target.tagName === 'INPUT' && !['checkbox', 'radio', 'range', 'color'].includes((target as HTMLInputElement).type);
      if (isTextInput || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        setIsKeyboardActive(true);
      }
    };
    const handleFocusOut = () => {
      // Small delay to prevent layout flicker when moving between fields
      setTimeout(() => {
        if (document.activeElement?.tagName !== 'INPUT' &&
            document.activeElement?.tagName !== 'TEXTAREA' &&
            document.activeElement?.tagName !== 'SELECT') {
          setIsKeyboardActive(false);
        }
      }, 50);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('booking_data', JSON.stringify(booking));
    localStorage.setItem('booking_timestamp', Date.now().toString());
  }, [booking]);

  useEffect(() => {
    localStorage.setItem('patient_data', JSON.stringify(patientData));
    localStorage.setItem('booking_timestamp', Date.now().toString());
  }, [patientData]);

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const hasBooked = cookies.some(c => c.startsWith('patient_has_booked=true'));
    if (hasBooked) setHasVisitedBefore(true);
  }, []);

  const setStep = (newStep: typeof step) => {
    const STEP_ORDER: Record<string, number> = { home: 0, treatment: 1, datetime: 2, doctor: 3, contact: 4, success: 5 };
    if (STEP_ORDER[newStep] !== STEP_ORDER[step]) {
      setDirection(STEP_ORDER[newStep] > STEP_ORDER[step] ? 'forward' : 'backward');
    }
    setStepBase(newStep);
  };

  const handleBack = () => {
    switch(step) {
      case 'treatment': setStep('home'); break;
      case 'datetime': setStep('treatment'); break;
      case 'contact': setStep('doctor'); break;
      case 'doctor': setStep('datetime'); break;
      default: break;
    }
  };

  const handleDateTimeSelect = (dateTime: string) => {
    setBooking(prev => ({ ...prev, dateTime }));
    // Start 5-minute slot lock timer
    setSlotExpiresAt(Date.now() + SLOT_LOCK_DURATION_MS);
    setSlotExpired(false);
    setStep('doctor');
  };

  const handleSlotExpire = useCallback(() => {
    setSlotExpired(true);
    // Wait 1 second before showing the banner and hiding the timer badge
    setTimeout(() => {
      setShowExpiredBanner(true);
    }, 1000);
  }, []);

  // Polling logic: after slot expires, check every POLLING_INTERVAL_S seconds
  useEffect(() => {
    if (!slotExpired || slotTakenByOther) return;
    const interval = setInterval(() => {
      if (AUTO_TAKE_ON_POLL > 0) {
        setSlotTakenByOther(true);
        clearInterval(interval);
      }
    }, POLLING_INTERVAL_S * 1000);
    return () => clearInterval(interval);
  }, [slotExpired, slotTakenByOther]);

  const handleStepEdit = (targetStep: 'treatment' | 'datetime' | 'doctor' | 'contact') => {
    setStep(targetStep);

    // Cascading resets: clear only what comes AFTER the target step
    if (targetStep === 'treatment') {
      setBooking(prev => ({
        treatmentName: prev.treatmentName,
        serviceDuration: prev.serviceDuration
      }));
    } else if (targetStep === 'datetime') {
      setBooking(prev => ({
        treatmentName: prev.treatmentName,
        serviceDuration: prev.serviceDuration,
        dateTime: prev.dateTime
      }));
    } else if (targetStep === 'doctor') {
      setBooking(prev => ({
        ...prev,
        doctorName: prev.doctorName
      }));
    }
  };

  const handleReset = (targetStep: 'home' | 'treatment' | 'datetime' | 'contact') => {
    if (targetStep === 'contact') {
      setOutcomeType('success');
      setStep('contact');
      return;
    }

    if (targetStep === 'datetime') {
      setOutcomeType('success');
      // Reset slot lock when returning to calendar
      setSlotExpiresAt(null);
      setSlotExpired(false);
      setShowExpiredBanner(false);
      setSlotTakenByOther(false);
      setBooking(prev => ({
        treatmentName: prev.treatmentName,
        serviceDuration: prev.serviceDuration
      }));
      setStep('datetime');
      return;
    }

    setOutcomeType('success');
    setErrorDetails({});
    setSlotExpiresAt(null);
    setSlotExpired(false);
    setShowExpiredBanner(false);
    setSlotTakenByOther(false);
    setBooking({});
    setPatientData({});
    setStep(targetStep);
    localStorage.removeItem('booking_step');
    localStorage.removeItem('booking_data');
    localStorage.removeItem('patient_data');
    localStorage.removeItem('booking_timestamp');
  };

  // The visual view state is "home" (teaser) unless expanded
  const activeView = isExpanded ? step : 'home';

  useEffect(() => {
    setIsSuccessStep(activeView === 'success');
  }, [activeView, setIsSuccessStep]);

  useEffect(() => {
    // If user closes the widget while on success screen, reset to home
    if (!isExpanded && step === 'success') {
      handleReset('home');
    }
  }, [isExpanded, step]);

  return (
    <div className={cn(
      "flex flex-col h-full w-full text-center mx-auto overflow-hidden bg-background relative",
      isKeyboardActive && "keyboard-active"
    )}>
      <Toaster />
      {/* Branded Header Area - Hidden on Success for full-screen feel */}
      {activeView !== 'success' && (
        <header className={cn(
          "w-full h-16 shrink-0 flex items-center px-4 relative z-50 bg-primary shadow-lg transition-all duration-300",
          isKeyboardActive && "h-12"
        )}>
          {activeView !== 'home' && (
            <div className="absolute left-2 h-full flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                aria-label="Torna indietro"
                className="rounded-full h-8 w-8 bg-white/15 backdrop-blur-[4px] hover:bg-white/25 text-white shrink-0 transition-all active:scale-95 p-0 flex items-center justify-center border-none"
              >
                <ArrowLeft className="w-5 h-5 stroke-[3px]" />
              </Button>
            </div>
          )}
          <div className="flex-1 text-center">
            <h1 className="text-[20px] sm:text-[18px] font-semibold text-white tracking-tight flex items-center justify-center gap-1.5 px-10 transitions-all duration-300">
              <span className="truncate">Prenota una visita in pochi</span>
              <Clock className="w-5 h-5 sm:w-5 sm:h-5 shrink-0 mb-0.5" />
            </h1>
          </div>
        </header>
      )}

      {/* Slot Taken By Other - Blocking Modal Overlay */}
      {slotTakenByOther && activeView !== 'home' && activeView !== 'success' && (
        <div
          role="alertdialog"
          aria-live="assertive"
          className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm"
        >
          <div className="bg-background border border-destructive/30 rounded-2xl shadow-2xl p-6 max-w-[300px] w-full flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="font-bold text-[16px] text-foreground">Slot non più disponibile</p>
              <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">Spiacenti, lo slot è stato prenotato da un altro paziente</p>
            </div>
            <Button
              className="w-full"
              onClick={() => handleReset('datetime')}
            >
              Torna al calendario
            </Button>
          </div>
        </div>
      )}

      {/* Slot Expired Banner - Appears 1s after expiration */}
      {showExpiredBanner && activeView !== 'home' && activeView !== 'success' && (
        <div
          role="alert"
          aria-live="assertive"
          className="w-full bg-orange-500/95 text-white text-[13px] font-semibold px-4 py-2 flex items-center justify-center gap-2 animate-in slide-in-from-top-1 duration-300 shrink-0"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Attenzione: il tempo è scaduto. Lo slot potrebbe non essere più disponibile.</span>
        </div>
      )}

      {/* Main Content Area - Scrollable Body */}
      <main
        className={cn(
          "flex-1 w-full overflow-x-hidden px-6 sm:px-10 h-0 scrollbar-premium relative z-10 overscroll-contain transition-all duration-300",
          isKeyboardActive ? "pb-2" : (activeView === 'success' ? "pb-6 sm:pb-0" : "pb-6"),
          activeView === 'success' ? "overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-500" : "overflow-y-auto"
        )}>
        <div className={cn(
          "flex flex-col items-center min-h-full text-center transition-all duration-300",
          activeView === 'success'
            ? "justify-start pt-16 sm:justify-center sm:pt-0 sm:pb-0"
            : (isKeyboardActive ? "pb-4" : "pb-10 justify-center")
        )}>
          {activeView === 'home' && (
            <div className={cn(
              "flex-1 flex flex-col items-center gap-4 w-full animate-in fade-in duration-700 h-full",
              direction === 'forward' ? "slide-in-from-right-4" : "slide-in-from-left-4"
            )}>
              {/* TOP SPACER - Increased flex weight to push everything further down */}
              <div className="flex-[1.5] w-full" aria-hidden="true" />

              {/* Prenota Button - Balanced for perfect horizontal center */}
              <div className="flex items-center justify-center gap-2 w-full max-w-[400px]">
                <div className="h-10 w-10 shrink-0 hidden sm:block opacity-0" aria-hidden="true" />
                <Button
                  size="lg"
                  onClick={() => {
                    if (step === 'home' || step === 'success') {
                      setBooking({});
                      setPatientData({});
                      setStep('treatment');
                    }
                    setIsExpanded(true);
                  }}
                  className="w-full sm:w-80 h-14 text-[18px] sm:text-[16px] font-semibold text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {(step === 'home' || step === 'success') ? 'Prenota' : 'Continua Prenotazione'}
                </Button>
                <div className="h-10 w-10 shrink-0 hidden sm:block opacity-0" aria-hidden="true" />
              </div>

              {/* Dashboard Row - Balanced for perfect horizontal center */}
              <div className="flex flex-col items-center gap-1 w-full relative">
                {/* Main Dashboard Button */}
                <div className="flex items-center justify-center w-full max-w-[400px]">
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="w-full sm:w-80 h-14 text-[16px] sm:text-[14px] font-bold border-primary/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
                  >
                    <a href="/dashboard.html" target="_blank" rel="noopener noreferrer">
                      {hasVisitedBefore ? "Dashboard" : "Dashboard Prenotazioni Digitali"}
                    </a>
                  </Button>
                </div>

                {/* Info Icon & Tooltip Wrapper - Triggers only on this element */}
                <div className="group/info relative flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Informazioni sulla dashboard"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 shrink-0 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDashboardNote(!showDashboardNote);
                    }}
                  >
                    <Info className="w-4 h-4" />
                  </Button>

                  {/* Tooltip content positioned relatively to the info icon */}
                  <div className="relative w-full flex justify-center h-0 overflow-visible pt-1">
                    <p className={cn(
                      "absolute top-0 w-[260px] text-[15px] sm:text-[13px] text-muted-foreground leading-relaxed italic transition-all duration-300 transform bg-background/95 backdrop-blur-sm p-3 rounded-xl border border-border/50 shadow-2xl z-20 pointer-events-none",
                      showDashboardNote
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-1 invisible sm:group-hover/info:opacity-100 sm:group-hover/info:translate-y-0 sm:group-hover/info:visible"
                    )}>
                      "In questa sezione puoi gestire solo le visite prenotate online qui sul sito. Per appuntamenti richiesti telefonicamente o tramite email, contatta lo studio."
                    </p>
                  </div>
                </div>
              </div>

              {/* BOTTOM SPACER + LOGO - Reduced padding to pull logo further down */}
              {config.branding.showLogo && config.branding.logoUrl && (
                <div className="flex-1 w-full flex flex-col justify-end pb-4">
                  <div className="flex flex-col items-center transition-all duration-500 shrink-0">
                    <div className="w-36 h-36 flex items-center justify-center">
                      <img src={config.branding.logoUrl} alt="Clinic Logo" className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeView === 'treatment' && (
            <TreatmentSelector
              direction={direction}
              onSelect={(id) => {
                const nameMap: Record<string, { name: string, duration: string, doctorName: string }> = {
                  chirurgia: { name: 'CHIRURGIA ORALE', duration: '60 min', doctorName: 'Dr. Roberto Bosco' },
                  endodonzia: { name: 'ENDODONZIA', duration: '45 min', doctorName: 'Dr. Roberto Bosco' },
                  igiene: { name: 'IGIENE E PROFILASSI', duration: '45 min', doctorName: 'Dr. Roberto Bosco' },
                  implantologia: { name: 'IMPLANTOLOGIA', duration: '60 min', doctorName: 'Dr. Roberto Bosco' },
                  estetica_dentale: { name: 'ESTETICA DENTALE', duration: '45 min', doctorName: 'Dr. Roberto Bosco' },
                  ortodonzia: { name: 'ORTODONZIA', duration: '30 min', doctorName: 'Dr. Roberto Bosco' },
                  protesi: { name: 'PROTESI', duration: '60 min', doctorName: 'Dr. Roberto Bosco' },
                  medicina_estetica: { name: 'MEDICINA ESTETICA', duration: '45 min', doctorName: 'Dr.ssa Angela Minio' }
                };
                const selected = nameMap[id] || { name: id, duration: '30 min', doctorName: 'Dr. Roberto Bosco' };
                setBooking(prev => ({
                  ...prev,
                  treatmentName: selected.name,
                  serviceDuration: selected.duration,
                  doctorName: selected.doctorName
                }));
                setStep('datetime');
              }}
            />
          )}

          {activeView === 'datetime' && (
            <DateTimeSelector
              direction={direction}
              onSelect={handleDateTimeSelect}
              serviceDuration={booking.serviceDuration}
            />
          )}

          {activeView === 'doctor' && (
            <DoctorSelector
              direction={direction}
              doctors={DOCTORS.filter(d =>
                booking.treatmentName === 'MEDICINA ESTETICA'
                  ? d.id === 'minio'
                  : d.id === 'bosco'
              )}
              onSelect={(_, name) => {
                setBooking(prev => ({ ...prev, doctorName: name }));
                setStep('contact');
              }}
            />
          )}

          {activeView === 'contact' && (
            <ContactForm
              direction={direction}
              initialData={patientData}
              onChange={setPatientData}
              onSubmit={(data: any) => {
                // Clear persistence immediately on final step
                localStorage.removeItem('booking_step');
                localStorage.removeItem('booking_data');
                localStorage.removeItem('patient_data');
                localStorage.removeItem('booking_timestamp');

                const phone = data.phoneNumber?.replace(/\s/g, '');

                // Demo Triggers based on Phone Number
                if (phone === '0000000000' && slotExpired) {
                  setOutcomeType('error');
                  setErrorDetails(ERROR_MESSAGES.SLOT_TAKEN);
                } else if (phone === '1111111111') {
                  setOutcomeType('error');
                  setErrorDetails(ERROR_MESSAGES.TECHNICAL_ERROR);
                } else if (phone === '2222222222') {
                  setOutcomeType('error');
                  setErrorDetails(ERROR_MESSAGES.GENERIC_ERROR);
                } else {
                  setOutcomeType('success');
                  setErrorDetails({});
                }

                setStep('success');
              }}
            />
          )}

          {activeView === 'success' && (
            <OutcomeScreen
              type={outcomeType}
              errorTitle={errorDetails.title}
              errorMessage={errorDetails.message}
              retryStep={errorDetails.retryStep}
              booking={booking}
              direction={direction}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      {/* Summary Footer Area - Hidden if keyboard is active to save space */}
      {!isKeyboardActive && activeView !== 'home' && activeView !== 'success' && (
        <BookingFooter
          treatmentName={booking.treatmentName}
          dateTime={booking.dateTime}
          doctorName={booking.doctorName}
          patientName={patientData.firstName || patientData.lastName ? `${patientData.firstName} ${patientData.lastName}`.trim() : undefined}
          currentStep={step}
          onEdit={handleStepEdit}
        />
      )}

      {/* Slot Timer — Root level so absolute inset-0 covers full widget */}
      {(activeView === 'doctor' || activeView === 'contact') && !showExpiredBanner && (
        <SlotTimer
          expiresAt={slotExpiresAt}
          onExpire={handleSlotExpire}
          isKeyboardActive={isKeyboardActive}
        />
      )}
    </div>
  )
}

export default App

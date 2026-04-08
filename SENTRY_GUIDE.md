# Sentry Setup Guide - booking-crm-prototype

Guida rapida per configurare Sentry per il monitoraggio degli errori in React + Vite.

---

## 🛠️ Step-by-Step Installation

### 1. Account Creation
- Vai su [Sentry.io](https://sentry.io) e crea un nuovo account o loggati.
- Crea un nuovo **Project** selezionando **React**.

### 2. Automatic Setup (Wizard)
Esegui il comando nel terminale della root del progetto:
```bash
npx @sentry/wizard@latest -i vite
```
*Il wizard configurerà automaticamente il file `sentry.config.ts`, aggiornerà `vite.config.ts` per l'upload dei source maps e aggiungerà l'SDK al tuo `main.tsx`.*

### 3. Environment Variables
Assicurati che nel tuo file `.env` (o `.env.local`) siano presenti:
- `SENTRY_AUTH_TOKEN`: per l'upload dei source maps durante la build.
- `VITE_SENTRY_DSN`: per catturare gli errori lato client.

---

## 🧪 Testing the Integration
Aggiungi un errore temporaneo in una pagina (es. `throw new Error("Sentry Test")`) e verifica che appaia nella Dashboard di Sentry.

---

## 🔄 Feedback Loops
Configura i **User Feedback Widgets** nelle impostazioni di Sentry per permettere agli utenti di segnalare dettagli aggiuntivi quando si verifica un crash.

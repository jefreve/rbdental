# Guida alle GitHub Issues - booking-crm-prototype

Questo documento funge da protocollo obbligatorio per gli agenti di sviluppo AI e i collaboratori per tracciare il lavoro, gestire i progressi e mantenere la salute del progetto per il repository `jefreve/booking-crm-prototype`.

---

## 🚀 Workflow Generale

### 1. Inizializzazione della Sessione
Prima di iniziare QUALSIASI task, l'agente AI DEVE:
- **Cercare issue esistenti** correlate al task attuale per evitare duplicati.
- **Sincronizzarsi con le ultime milestone** per comprendere le priorità del progetto.
- **Elencare le issue aperte** per identificare dipendenze in sospeso.

### 2. Inizio del Task
Se un task non ha una issue esistente:
- **Creare una Nuova Issue**: Usare titoli chiari e descrittivi (es. `feat: implementa calendario prenotazioni` o `fix: menu mobile responsive`).
- **Fornire Dettagli**: Usare il corpo della issue per delineare il piano, i requisiti tecnici e i criteri di accettazione.
- **Assegnare e Etichettare**: Assegnare la issue all'utente corrente e applicare le etichette pertinenti (es. `enhancement`, `bug`, `documentation`).
- **Collegare alla Milestone**: Associare sempre la issue alla milestone attiva.

### 3. Lavoro in Corso (WIP)
Man mano che il lavoro procede:
- **Pubblicare Commenti**: Aggiornare la issue con brevi note tecniche, decisioni architettoniche o ostacoli riscontrati.
- **Aggiornare lo Stato**: Se il repository usa i Projects, spostare il task nella colonna "In Progress".

### 4. Completamento del Task
Quando il task è finito:

> [!CAUTION]
> **L'AI NON DEVE MAI eseguire `git commit`, `git push` o qualsiasi comando git autonomamente.**
> L'AI fornisce SOLO il messaggio di commit. È l'UTENTE che fa il commit e il push manualmente.
> Tuttavia, l'AI **PUÒ E DEVE usare gli strumenti MCP GitHub** per creare, aggiornare, commentare e chiudere le issue direttamente sul repository.

1. **Fornire il Commit Message**: L'AI deve fornire il messaggio di commit esatto da copiare e incollare.
2. **ASPETTARE**: L'AI deve aspettare che l'utente confermi di aver fatto il commit e il push.
3. **Chiusura Issue**: SOLO DOPO che l'utente ha confermato il commit, l'AI chiude la issue su GitHub.

---

## 📋 Template e Standard delle Issue

### Formato del Titolo
- `feat:` per nuove funzionalità
- `fix:` per correzioni di bug
- `refactor:` per miglioramenti del codice senza cambiamenti funzionali
- `chore:` per task di manutenzione (es. aggiornamento dipendenze)

### Checklist del Corpo della Issue
- [ ] **Obiettivo**: Quale problema stiamo risolvendo?
- [ ] **Modifiche Proposte**: Breve elenco degli aggiornamenti tecnici.
- [ ] **Verifica**: Come può l'utente/agente testare questa modifica?

---

## 🎯 Gestione delle Milestone
- **Controllare i Progressi**: Rivedere regolarmente le percentuali di completamento delle milestone.
- **Chiusura delle Milestone**: Quando tutte le issue di una milestone sono chiuse, l'AI deve informare l'utente per discutere la fase successiva della roadmap.

---

### Altre Etichette di Riferimento
Possono esistere altre etichette (es. `documentation`, `duplicate`, `wontfix`). Sebbene presenti, l'agente AI **non le userà prioritariamente** per:
- **Coerenza**: Evitare sovrapposizioni (es. usare `fix` invece di `bug`).
- **Standardizzazione**: Assicurare che l'etichetta rifletta esattamente il tipo di lavoro indicato nel messaggio di commit.

---

### 📋 Standard di Commit
- **Formato**: `tipo: descrizione (#numero_issue)`
- **Lingua**: Solo ed esclusivamente in **Inglese**.
- **Lunghezza**: Solo una riga, niente descrizioni lunghe o body del commit.
- **Formato Risposta**: Fornire il messaggio come **testo semplice**, SENZA blocchi di codice (no triple backticks).

---

### ⛔ Regola di Chiusura Issue

> [!CAUTION]
> **L'AI NON PUÒ eseguire comandi git (commit, push, ecc.). MAI. IN NESSUN CASO.**
> L'AI ha però il pieno permesso di gestire le Issue (lettura e scrittura) tramite la **connessione MCP GitHub**.

Quando l'utente chiede di chiudere una issue, l'AI deve rispondere fornendo il messaggio di commit in questo modo:

Messaggio di commit:
feat: description of changes (#X)

Poi l'AI **SI FERMA E ASPETTA**. Non fa nient'altro finché l'utente non conferma di aver fatto il commit.

Solo dopo la conferma dell'utente, l'AI chiude la issue su GitHub e risponde:

```
La Issue #X è chiusa.
```

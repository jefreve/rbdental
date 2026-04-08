# Implementation Plan - Dental Booking System

## Architecture Overview
- **Type**: Single-Tenant (Isolated instance per clinic)
- **Frontend**: React + Vite + Tailwind (via Shadow DOM for Widget)
- **Backend**: Supabase (Individual project per client - Auth, DB, Storage)

## 1. Frontend: Execution Focus (Phase 1)
**Goal**: Build a **Reusable Prototype Engine** that allows for high-fidelity demos to be generated for any prospect.

### A. The Widget (Universal White-Label Engine)
- **Isolation**: Wrapped in a **Shadow DOM** to prevent CSS leakage.
- **Dynamic Config Engine**: Uses `clinicConfig.ts` for:
    - **Branding**: Colors, Typography (Google Fonts), UI "Feeling" presets (Modern, Classic, Minimal).
- **UI/UX Policy**: 
    - Use **unique pages with slugs** for main user steps (no full-page modals).
    - Use **modals only for confirmations** and small field edits.
    - **Toasts**: Displayed in the **top-left** corner (Shadcn-based).
- **Core Views (Step-by-Step Flow)**:
    - **Header**: Minimal pinned header with a back-arrow only (no clinic name, no "Indietro" text) to maximize vertical space.
    - **Body (Scrollable)**: Central area for selectors (Services, Doctors, Calendar) that scrolls internally within dynamic max-height: 85dvh (max 600px).
    - **Footer (Horizontal Summary)**: Persistent bar at the bottom with selections shown as horizontal chips. Features dynamic transparent scroll arrows (left/right) that appear/disappear based on scrollable content availability.
    - **Step 1: Service Selection** (e.g., Dentistry, Hygiene) -> Setting constraints like duration.
    - **Step 2: Calendar/Slot Selection** (MioDottore style grid with internal vertical scrolling for "Mostra più orari" and horizontal scrolling for days; uses dynamic scroll arrows).
    - **Step 3: Professional Selection** (Filtered by slots/services; auto-skipped if only one doctor).
    - **Step 4: Contact Information & Privacy** (Country selector with search, international phone format with visual spacing, GDPR mandatory).
    - **Step 5: Success State & Portal Handoff** (In-widget success screen with no height shift).

### C. Accessibility & ARIA (Universal Standards - Issue #17)
- **Semantic Labeling**: Programmatically link `<label>` elements to inputs using `htmlFor` and `id` to ensure proper naming in the accessibility tree.
- **Header & Navigation**: Enlarge the back button and add explicit `aria-label` for icon-only actions.
- **Main Selectors Labeling**: Ensure treatments, doctors, and time slots are announced with their current state and selection role.
- **Footer & Summary Accessibility**: Add descriptive labels to summary chips and scroll-control arrows.
- **Dynamic Error States**: Use `aria-invalid` when validation fails.
- **Field-Message Link**: Connect error labels to inputs via `aria-describedby`.
- **Live Announcements**: Mark Toasts with `aria-live` or `role="alert"` for immediate screen-reader feedback.
- **Required Fields**: Technically mark required inputs with `aria-required="true"`.
- **Focus Management**: Ensure focus shifts to the first erroneous field after validation failure and automatic scroll.

### B. The Dashboard (Full White-Label Branding)
- **Visual Identity**: Dynamically inherits branding from `clinicConfig.ts` (or the clinic settings table in Phase 2). The entire experience (Widget, Patient Dashboard, and Staff/Admin Dashboard) will be fully white-labeled to match the clinic's identity, ensuring no external branding is visible.
- **Admin Pages**:
    - **Dashboard**: "Today's Clinic" overview.
    - **Booking Management**: View, Edit, and Manage status (Confirmed, Cancelled + reasons).
    - **Client Management**: Patient database and banning/rejection system.
    - **Schedule & Availability**: Manage session types, slots, and **Availability Exceptions** (e.g., holidays).
    - **Reporting**: Basic analytics on bookings and clinic performance.
    - **Settings**: System and user role management.

## 2. Backend: System Architecture (Phase 2)
### A. Tables & Data Logic
- **`profiles`**: User management with roles (`admin`, `staff`, `client`).
- **`services`**: Clinic treatments (types, slots, pricing, location).
- **`appointments`**: History tracking for all bookings (status, cancel_reason, datetime).
- **`availability_rules`**: Weekly schedules and special exceptions/rules.
- **`history_logs`**: Tracking `login_history`, `booking_history`, and `audit_logs` (GDPR mandatory).

### B. Security & Storage
- **Identity**: Supabase Auth (Signup, Login, Logout for patients and staff).
- **Storage (Buckets)**: Minimal setup for profile photos/small documents (<5MB).
- **GDPR**: Encryption at rest and isolated data silos (Primary differentiator).

## 3. Legal & Launch Protocol
- **Document Suite**: Professional DPA and T&C via legal templates (e.g., Iubenda).
- **Payments**: **Off-line focus** (Payments on-premises). Stripe integration reserved for Phase 3 improvement.

## 4. Strategy & Marketing Ideas
- **Domain Routing & White-labeling**:
    - **Base Level**: Host the portal on a neutral, multi-tenant premium domain (e.g., `gestione-visite.it`, `area-clinica.it`, `servizio-pazienti.it`) and use unguessable paths or slugs for clinics (e.g., `/studiorossi`). Keep root domains inaccessible to public.
    - **Premium Level**: Setup dedicated CNAME DNS records on client requests (e.g., `prenotazioni.studiorossi.it`) providing 100% white-labeling without requiring external web devs to touch our codebase.

## 4. Immediate Development Timeline
- **Step 1**: Build the **Config-driven Frontend Boilerplate**.
- **Step 2**: Implement the Step-by-Step Widget flow (Top-left toasts + Shadcn).
- **Step 3**: Create the first "Branded Demo" for a prospect using `clinicConfig.ts`.

## 5. Testing & Validation (Phase 3)
- **Host Integration Testing**: Create a "Mock Client Website" (simple HTML/CSS) to embed the widget and simulate real-world conditions.
- **Overflow & Clipping Verification**: Ensure that floating elements (like the Country Selector popover) are correctly visible and NOT cut off, even if the host container that wraps the widget has `overflow: hidden`.
- **Responsive Stress Test**: Test widget behavior in different container sizes (Narrow sidebars, full-width sections, mobile viewport).
- **Shadow DOM Integrity**: Confirm that no global styles from the host site leak into the widget and that all branding variables apply correctly.

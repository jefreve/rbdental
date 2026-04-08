Task: Produce a detailed, step-by-step IMPLEMENTATION_PLAN.md for building a professional, white-label Booking System for Dental Clinics in Italy.

Core Objective: Create a standalone, embeddable booking engine that competes with "MioDottore/AlfaDocs" by offering superior UI integration and brand consistency for the dentist's existing website.

1. Tech Stack & Infrastructure:

Backend: Supabase (Database, Auth, Edge Functions, and Storage Buckets for medical documents/media).

Security: Implement strict Row Level Security (RLS). Ensure GDPR compliance for Italian health data (Dati Sensibili).

UI Library: Use Shadcn UI as a reference for components.

Frontend Integration: The system must be a lightweight, framework-agnostic widget.

2. Pages & Routing Architecture:
Prefer unique pages with slugs for specific user/admin actions; use Modals only for confirmations or minor field edits.

General: Profile, Signup, Login, Logout.

Admin Dashboard (Clinic Staff): * Overview (Reporting & Analytics).

Session/Treatment Management.

Real-time Booking Calendar.

Patient Management (Clients).

Clinic Settings (Chameleon CSS Branding & Global Vars).

Patient Dashboard (Client): * Booking Management (Current and Past).

New Appointment Workflow.

3. Database Schema & Business Logic:

Chairs & Providers: Instead of simple "slots", support multiple "Chairs" (Rooms) and specific Doctor availability.

Treatments (Sessions): CRUD for treatments. Fields: Title, Description, Duration, Max Capacity (usually 1), Price (for internal reference), and Location (Chair ID).

Booking Status: Track 'Pending', 'Confirmed', 'Cancelled', and 'No-show' (with cancel reason and timestamp).

User Roles: New signups = user. Role upgrades to client only after the first booking is confirmed. Admin must have the power to ban or reject users.

History Tracking: Log user login history, treatment history, and booking modifications.

4. Chameleon Branding & UI/UX Strategy:

The "Chameleon" Approach: The system must be designed to adapt to any existing dental clinic website. Use a global Theme Provider (e.g., using CSS Variables) where the clinic's primary colors, fonts, and border-radius are loaded from the Supabase clinic_settings table.

Component Reference: Use Shadcn/UI as the baseline for high-quality, professional medical aesthetics.

Visual Feedback: Implement screen toast messages for all actions (success/error), positioned in the top left.

Page vs Modals: Use unique pages with slugs for complex tasks (e.g., /booking/new, /admin/patient/id) and modals only for quick confirmations or small field edits.

5. Connectivity & Notifications:

Google Calendar Sync: Implement a two-way sync (or direct write-through via Edge Functions) so doctors can see their appointments in their personal Google Calendar, while medical details remain securely on our backend.

Notifications (Low-Touch SaaS): Plan for automated Email/SMS reminders.

Constraint: Clearly separate Email (included in SaaS) from SMS (metered/extra cost) to ensure the €50/month margin.

Payment Logic: For this prototype, NO online payments. Status: "Pay-on-premises". Leave a modular "placeholder" for future Stripe integration.

6. Implementation Roadmap & SaaS Sustainability:

Setup vs Maintenance: The plan must optimize for a 2-hour deployment (for the €500 setup) and automated maintenance (backups, security patches, uptime monitoring for the €50/month fee).

Security: Outline specific measures for Dati Sensibili (Italian health data privacy) including RLS, encryption at rest, and audit logs for patient data access.

Integration Method: Compare and choose between an Iframe vs. a Web Component (JS Snippet), prioritizing the one that best supports the Chameleon CSS injection.

Final Instructions for the AI:

Outline the database schema (ERD logic).

Define the API structure for the Widget.

List all necessary security measures.

Immediate Task: Generate the full IMPLEMENTATION_PLAN.md now. This plan must cover the entire system (Frontend + Supabase Backend) for future reference, but with a specific "Phase 1: Frontend First" strategy.

Development Strategy:

Phase 1 (Priority): Build a high-fidelity Frontend-Only Prototype. Use mock data for patients, chairs, and treatments. The focus is on the UI/UX, Shadcn components, and the "Chameleon CSS" engine.

Phase 2 (Next Step): Only after the frontend is approved, we will proceed to connect the Supabase backend, RLS, and Edge Functions step-by-step.

Instructions for the IMPLEMENTATION_PLAN.md:

Detail the Database Schema (ERD) even if we won't build it yet.

Outline the Component Architecture (Shadcn + Tailwind).

Explain the Theme Injection logic (how we will pass colors/fonts to the widget).

Break down the frontend pages (Admin vs. Patient).

7. Multi-Instance & Deployment Strategy:
The system must be architected as a Clonable Template to support two distinct use cases:

Use Case 1 (The Lead Prototype): A standalone, "Frontend-Only" version.

Mechanism: A global MOCK_MODE toggle and a local clinicConfig.ts file.

Goal: Allow the developer to clone the repo, update clinicConfig.ts with the lead's branding, and deploy a fully functional UI demo with zero backend configuration.

Use Case 2 (The Acquired Client): A full-stack production instance.

Mechanism: The same clinicConfig.ts is used for initial setup, then migrated to Supabase. MOCK_MODE is set to false to enable live database connectivity.

Data Layer Abstraction: All frontend components must consume data through a Repository Pattern or Custom Hooks. These hooks must conditionally switch between MockProvider and SupabaseProvider based on the MOCK_MODE flag, ensuring no UI code needs to be rewritten when moving from prototype to production.

Output Rule:

Write the IMPLEMENTATION_PLAN.md immediately. * DO NOT generate the source code for the app in this turn. We will start coding Phase 1 (Frontend) in the next prompt after I review the plan.

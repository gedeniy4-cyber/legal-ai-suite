
# Chambers OS — Full Build Plan

A production-ready AI legal SaaS on TanStack Start + Lovable Cloud + Lovable AI Gateway. You asked for "everything at once" — I'll build the full surface in one pass. Depth trade-offs are called out inline.

## 1. Backend & Infrastructure

- **Enable Lovable Cloud** (Supabase-backed) for auth, DB, storage, server functions.
- **Enable Lovable AI Gateway** (`LOVABLE_API_KEY` auto-provisioned) as the single AI provider. All AI calls funnel through one server module (`src/lib/ai/gateway.server.ts`) so a future swap to OpenAI/Anthropic/Gemini is a one-file change.
- **Store your Google OAuth secrets** (`GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`) as requested. Note: actual Google sign-in will still use Lovable's managed Google broker (it's the only supported path); the stored secrets are kept for future custom OAuth use.
- **Database tables** (with RLS + grants):
  - `profiles` (id, display_name, avatar_url, language, theme, subscription_tier, created_at)
  - `user_roles` (separate table, `app_role` enum: `user`, `creator`, `admin`; `has_role()` security-definer fn) — creator role auto-granted to `creator@chambersos.com` via trigger
  - `ai_usage` (user_id, date, tier_bucket, count) — daily counter for rate limits
  - `history` (id, user_id, feature, prompt, output, metadata jsonb, favorite, title, created_at)
  - `workspaces` (id, user_id, name, data jsonb) — Premium saved workspaces
  - `attachments` (id, user_id, history_id nullable, path, mime, size, extracted_text)
  - Storage bucket `attachments` (private, RLS by user_id)

## 2. Auth

- Email/password + **managed Google** + **Guest mode** (unlimited, session stored in localStorage, no DB writes; history stored locally).
- **Microsoft button**: visible, disabled, tooltip "Coming soon".
- Forgot password + `/reset-password` route.
- `_authenticated/` layout gate (integration-managed).
- Guest routes work end-to-end without login.

## 3. Subscription System (simulated, ZAR)

- Tier selector in Settings + Pricing page. No real payments.
- **Basic (R0)**: 10 AI req/day, Email, Summarizer, limited Chat, history.
- **Pro (R299)**: + Task Planner, Research, 10 premium req/day, export, unlimited history.
- **Premium**: Single R699 / Family R1 499 / Business R4 999+ — unlimited, all tools.
- **Creator mode**: `creator@chambersos.com` → all tiers unlocked, unlimited, admin dashboard.
- Rate limiter enforced server-side in AI gateway wrapper. Progress bar in dashboard; Generate buttons disable at limit with upgrade CTA.

## 4. AI Service Architecture

- `src/lib/ai/gateway.server.ts` — single provider adapter (Lovable AI Gateway, default model `google/gemini-3-flash-preview`; vision-capable for image attachments).
- `src/lib/ai/prompts/` — one file per feature, prompts separated from UI.
- `src/lib/ai/run.functions.ts` — `runAiFeature({ feature, input, attachments, lengthPreference })` server fn: checks tier + quota, loads prompt template, calls gateway, saves to history, returns result.
- Attachment extraction (`src/lib/attachments/extract.server.ts`): PDF (pdf-parse-fork or unpdf), DOCX (mammoth), TXT/MD (raw), images (passed to vision model as base64). URLs (http/https, Google Drive/Dropbox/OneDrive share links) fetched server-side and text-extracted. Unlimited count per request.

## 5. Features (all functional)

**Core** (in sidebar):
1. **Legal Email Generator** — recipient, matter, purpose, tone, attachments; editable rich output; copy/download/regenerate.
2. **Meeting Summarizer** — paste/upload TXT/PDF/DOCX; returns Executive Summary, Action Items, Key Decisions, Deadlines.
3. **Task Planner** (Pro+) — tasks, deadlines, working hours → prioritized Morning/Afternoon/Evening schedule with calendar view.
4. **Legal Research Assistant** (Pro+) — question, jurisdiction, objective → Summary, Authorities, Recommendations, Key Points.
5. **AI Legal Chat** — persistent threads, streaming, typing animation, suggested prompts, attachments via **+ button left of input**, copy, clear, thread list. Length selector (Short/Medium/Long/Custom word count) + unlimited prompt length.

**Premium bonus tools** (unlocked at Premium):
6. Contract Review • 7. Legal Document Explainer • 8. Case Timeline Generator • 9. Court Preparation Assistant • 10. Citation Formatter • 11. Argument Builder • 12. Legal Writing Coach

Each uses the same `AiFeaturePage` layout component (form panel + output panel + attachments + length selector + responsible-AI disclaimer).

## 6. Prompt Library

Curated prompts for Contract Drafting, Legal Opinion, Case Summary, Research, Client Emails, Court Prep, Exam Prep. Click → prefills a chosen feature.

## 7. Landing Page

Hero ("Chambers OS" / "The AI Operating System for Modern Legal Professionals") with Launch Workspace + Book Demo buttons, animated dashboard preview, features grid, testimonials, pricing (ZAR), FAQ, footer. Animated transitioning text **"By Yondela Gedeni · Sponsored by CAPACITI"** in hero/footer.

## 8. Dashboard

Sidebar + top nav (search, notifications, profile). Cards: AI Requests Remaining (progress bar), Subscription Tier, Recent Activity, Weekly Analytics (recharts), Quick Actions. **All stats start at 0** for new users — no fake data, real empty states everywhere.

## 9. Settings

Profile, Theme toggle (light/dark), **Language selector** (English, isiZulu, isiXhosa, Afrikaans, Sesotho, Xitsonga, Setswana, Portuguese, French, German, Spanish) via `react-i18next` — UI labels translated; AI output language follows user prompt. Notifications, Export data, Delete history.

## 10. History & Analytics

- History page: list all AI runs; rename, delete, favorite, search, filter by feature.
- Analytics page: recharts of usage over time, per-feature counts. Zero-state until real usage.

## 11. UX Polish

- Skeletons, toasts (sonner), hover/transition animations (Tailwind + framer-motion for micro-interactions), error boundaries, confirmation dialogs, empty states.
- Rich text editor (Tiptap) on all long-form inputs & outputs: bold/italic/underline/lists/headings/undo/redo, autosave to localStorage per feature.
- Output actions on every generation: Edit, Copy, Regenerate, Continue Writing, Improve, Summarize, Expand, Export PDF (jsPDF), Export DOCX (docx), Download TXT, Print, Share.
- Responsible-AI disclaimer on every AI page.

## 12. Design System

Navy background `oklch(0.22 0.04 260)`, gold accent `oklch(0.78 0.15 85)`, white glass cards with backdrop-blur, soft shadows, rounded-2xl, Inter font (via @fontsource/inter), dark mode default, fully responsive (mobile sidebar drawer). Classic entrance animations (fade-up, stagger) on landing.

## Technical Notes

- Attachments v1: PDF, DOCX, TXT, MD, images (vision). Audio/video/scanned-OCR are out of scope for v1 — clearly labelled in the uploader.
- Guest mode: history stored in IndexedDB (Dexie) so it persists across reloads without DB.
- All AI calls server-side via `createServerFn`; `LOVABLE_API_KEY` never touches the browser.
- File tree kept modular: `src/features/<feature>/`, `src/components/ai/`, `src/lib/ai/`, `src/lib/attachments/`, `src/routes/...`.

## Deliverable

One large build pass producing a working app: landing → guest or auth → dashboard → every feature functional with real AI calls, tier enforcement, attachments, history, analytics, i18n, ZAR pricing, creator mode. Expect follow-up polish turns for the premium bonus tools and translation completeness.

Approve to build.

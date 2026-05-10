# Smart Kitchen Error Log

## Purpose

- Record implementation errors, deployment blockers, and their fixes.
- Keep entries short and factual so the same issue is not investigated twice.
- Add a new entry at the top each time an error is confirmed.

## Entry Template

```md
## YYYY-MM-DD HH:MM

- Area:
- Environment:
- Symptom:
- Trigger:
- Root cause:
- Fix:
- Prevention:
- Status: open | fixed | monitoring
```

## Entries

### 2026-05-10 Supabase Secret Retrieval Gap

- Area: Supabase deployment setup
- Environment: Plugin-assisted project configuration
- Symptom: The project URL and publishable keys are available, but the server-side secret required by the route handlers is still missing from the local and Vercel environments.
- Trigger: Finished project creation and Vercel linking.
- Root cause: The current Supabase plugin surface does not expose `SUPABASE_SERVICE_ROLE_KEY`, and browser automation is blocked in this environment.
- Fix: Retrieve `SUPABASE_SERVICE_ROLE_KEY` manually from the Supabase dashboard, then add it to `frontend/.env.local` and the linked Vercel project.
- Prevention: Confirm secret-access path before assuming full deployment can be completed through plugins alone.
- Status: fixed

### 2026-05-10 Vercel Framework Preset Mismatch

- Area: Vercel deployment
- Environment: Production deployment attempt
- Symptom: The build succeeded, but deployment failed with `No Output Directory named "public" found`.
- Trigger: First `vercel deploy --prod` run after linking the new Vercel project.
- Root cause: The new Vercel project was created with `Framework Preset: Other`, so Vercel expected a static output directory instead of a Next.js build output.
- Fix: Added `frontend/vercel.json` with `"framework": "nextjs"` and redeployed successfully.
- Prevention: Set the framework explicitly when the initial project preset is not inferred correctly.
- Status: fixed

### 2026-05-10 Vercel CLI Login Pending

- Area: Deployment setup
- Environment: Local terminal with Vercel CLI 53.3.1
- Symptom: Deployment setup cannot continue until Vercel account authentication is completed.
- Trigger: Ran `vercel whoami` after installing the CLI.
- Root cause: No existing Vercel credentials are present in this environment.
- Fix: Complete the device login flow shown by the CLI, then resume project linking and deployment.
- Prevention: Authenticate Vercel CLI before starting deployment automation work.
- Status: fixed

### 2026-05-10 Supabase Project Inactive

- Area: Supabase setup
- Environment: Supabase plugin inspection
- Symptom: The existing Supabase project URL could be read, but the publishable key could not be retrieved.
- Trigger: Queried the connected Supabase project after the local refactor completed.
- Root cause: The visible project `Itsuki911's Project` is currently `INACTIVE`.
- Fix: Created a replacement project named `smart-kitchen`.
- Prevention: Confirm project runtime status before wiring environment variables and deployment steps.
- Status: fixed

### 2026-05-10 Supabase Architecture Shift

- Area: Frontend and deployment architecture
- Environment: Local repository refactor
- Symptom: The deployed MVP could not rely on the existing `frontend -> FastAPI` runtime path because only `Vercel + Supabase` was selected for publication.
- Trigger: Confirmed final architecture decisions with the user.
- Root cause: The original MVP assumed a separately running FastAPI server for recipe creation and history fetches.
- Fix: Reworked the app to use Next.js route handlers backed by Supabase, and kept FastAPI as a thin layer reserved for future AI integration.
- Prevention: Decide deployment topology before binding frontend pages to a runtime-specific backend URL.
- Status: fixed

### 2026-05-10 Initial Setup

- Area: Planning
- Environment: Repository review
- Symptom: Project architecture documents are not aligned with the current migration target.
- Trigger: Reviewed `README.md` and `Smart Kitchen Portfolio Development Plan.md`.
- Root cause: The MVP codebase is `Next.js + FastAPI`, while the portfolio plan still describes `Firebase` as the backend.
- Fix: Added `DEVELOPMENT_TASKS.md` to make `Supabase + Vercel` the working implementation plan and flagged document alignment as an explicit task.
- Prevention: Update the task board first whenever architecture direction changes.
- Status: monitoring

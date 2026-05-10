# Smart Kitchen Development Tasks

## Operating Rules

- This file is the active task board for Smart Kitchen web application work.
- Large tasks are broken into smaller actionable tasks.
- When a small task is completed, delete that task from this file instead of only marking it done.
- If scope changes, update this file before implementing the next change.
- Record implementation errors, blockers, and fixes in `ERROR_LOG.md`.

## Current State Summary

- Frontend is a Next.js MVP with `Home`, `Upload`, and `History` pages.
- Deployed MVP architecture is fixed as `Next.js on Vercel + Supabase for DB/Storage`.
- FastAPI remains in the repository as a thin AI integration layer for later phases.
- The recipe result is fixed text and does not yet use AI inference.
- The phase target is MVP web publication only, without custom domain work.
- Active Supabase project: `smart-kitchen` (`whskeczhmbujwnzoayeg`) in `ap-northeast-1`.
- Active Vercel project: `itsuki-s-projects/smart-kitchen`.
- Production deployment URL: `https://smart-kitchen-gray.vercel.app`

## Remaining Tasks

- Verify `POST /api/recipe` persistence through Supabase.
- Verify `GET /api/history` reads from Supabase.
- Improve the history cards for small screens:
  metadata layout and recipe output readability
- Verify local development flow after refactor.
- Verify deployed flow from a smartphone viewport.
- Verify history persistence across restarts and redeploys.
- Verify failure cases:
  missing fields, fewer than 3 images, missing env vars, storage failure

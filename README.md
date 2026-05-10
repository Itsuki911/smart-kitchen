# Smart Kitchen

## Open The App

- Production: `https://smart-kitchen-gray.vercel.app`
- Local home: `http://localhost:3000`
- Local upload page: `http://localhost:3000/upload`
- Local history page: `http://localhost:3000/history`

## What It Does

- Fill in 3 health-check fields
- Upload 3 images
- Save the run to Supabase
- Show a fixed recipe result

## Run Locally

```bash
cd smart-kitchen/frontend
npm install
npm run dev
```

If needed, set Supabase values in `frontend/.env.local` before starting.

## Main Files

- `frontend/`: web app
- `backend/`: future FastAPI layer for AI integration
- `supabase/sql/001_recipe_runs.sql`: MVP schema
- `example_image/`: test images

## Notes

- The current recipe output is fixed text.
- History is stored in Supabase.

# AI Photo Prompt Builder

Visual editor for AI fashion photo prompts — implements the **v3.0 architecture spec** (schema-driven blocks + slots + recipes) on top of the **v2.1 modular** prompt system.

Three generation tracks (Catalog · Lifestyle · UGC), three editing tiers (Recipe · Block · Expert), live preview with Pass-1/Pass-2 split, validation, and recipe save/import/export.

## Stack

- Vite + React 19 + TypeScript
- Zustand (state) with localStorage persistence
- Tailwind CSS v3 (dark UI)
- Static SPA — deployable to any static host. GitHub Pages workflow included.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

The output lands in `dist/`. The Vite `base` is set to `'./'`, so the build works under any subpath.

## Deploy to GitHub Pages

The workflow at `.github/workflows/deploy.yml` builds and deploys on every push to `main`:

1. Push the repo to GitHub.
2. In the repo settings → **Pages** → set **Source** to **GitHub Actions**.
3. Push to `main`. The workflow builds and publishes; the URL appears in the workflow summary.

## Project layout

```
src/
  data/         library: BASE, POSE, LOCATION, CAMERA, GRADE, UGC_SCENARIO + recipes
  lib/          types, render engine, composer, validator
  store/        Zustand editor state (persisted)
  components/   UI: LeftPanel · CenterPanel · RightPanel + slot controls
```

## Architecture summary (from spec v3.0)

A prompt = `BASE` wrapper + a set of typed `Block`s with parameterized `Slot`s. The composer renders each block's template, substitutes derived/computed fields, and stitches everything into the BASE wrapper. A second pass (GRADE block, optional) is rendered separately for color grading. Compatibility, requirement, and bounds checks run on every state change and surface as errors / warnings in the left panel.

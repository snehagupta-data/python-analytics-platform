# Sneha's Python × Data Analytics Learning Platform (V1)

A personal, active-learning platform that takes Sneha Gupta (final-year B.Sc. Data Science,
Annasaheb Vartak College, CGPA 8.8) from Python beginner → interview-ready Data / Business Analyst.
Built around her real projects: ShopKart India (150,000 orders, ₹1.75B revenue), LendX Finance
(₹7.11bn loan portfolio), the ₹200 OFF vs 20% OFF A/B test, cohort/RFM and the Hospital dashboard.

## Tech stack
- **Frontend:** Vite + React 19 (JavaScript, no TypeScript) + custom CSS design system (navy `#1F3862`)
- **Python execution:** Pyodide v0.26.4 loaded lazily from CDN — real Python in the browser, no server
- **Persistence:** localStorage only (key `py-analytics-v1`) — no backend, no database server in V1
- **Dependencies:** react + react-dom only (plus Vite dev tooling)

## Features (V1 — all working, no placeholders)
1. **Dashboard** — overall progress %, skill radar computed from real attempt accuracy, Today's Mission checklist (persisted per day), weak topics, revision due, recent mistakes, interview readiness %, and a recommended next action computed from the weakest mastery (not just "next lesson").
2. **Diagnostic test** — 20 MCQs across 14 categories; per-category report + recommended starting module; saved, retakeable.
3. **Curriculum / Roadmap** — 13 phases, 40 modules, 40 lessons. Modules 1–8 fully written (Simple + Technical + Interview explanations, Hinglish intuition, syntax, tiny example, common mistakes, real analytics application, interview question, starter code). Modules 9–40 are structured outlines with key points, syntax and examples.
4. **Lessons** — "Explain differently" controls (Explain simpler / Give analogy / Show technical / Show interview answer) switching pre-written variants; per-lesson notes saved to localStorage.
5. **Practice engine** — 80 questions (10 per lesson for Modules 1–8: 3 easy, 3 medium, 2 hard, 1 debugging, 1 interview) with instant feedback + explanations; wrong answers auto-recorded.
6. **Code Playground** — real Python execution via Pyodide (lazy load, loading state, honest error if the CDN is unreachable — output is never faked). 3 coding challenges with 3 progressive hints each (hint usage tracked) + solutions.
7. **Mistake Journal** — question / your answer / correct answer / topic / difficulty / attempts / revision status, with spaced-repetition due dates (1, 3, 7, 14, 30 days).
8. **Projects** — all 12 projects (Expense Analyzer → Portfolio Project) with mentor mode: business problem → learner writes their approach → next step + hint (no full solution dumped upfront), plus the 18-item portfolio quality checklist.
9. **Interview Prep** — 17 categories × 3 questions with model answers (51 total), an Interview Answer Trainer that scores typed answers by keyword coverage and shows the ideal answer, and 3 business-case simulators (sales −15%, churn up, AOV down) with structured steps + model approach.
10. **Mastery** — per-topic status Locked / Learning / Practicing / Weak / Strong / Mastered computed from quiz/coding accuracy, not from "lesson completed".
11. **Design** — clean, professional, minimal, navy accent, dark/light toggle, responsive.

## Run locally
```bash
cd python-analytics-platform
npm install
npm run dev      # development server (http://localhost:5173)
npm run build    # production build (outputs dist/)
npm run preview  # serve the production build (http://localhost:4173)
```

## Testing performed
- `npm run build` — passes (22 modules, ~324 kB JS / 104 kB gzip).
- Node data sanity script — verified: 13 phases, 40 modules, 40 lessons (8 full), 20 diagnostic questions (14 categories), 80 quiz questions (10/lesson, correct 3/3/2/1/1 mix), 3 coding challenges, 12 projects, 18-item checklist, 17 interview categories / 51 questions, 3 trainer prompts, 3 business cases; all quiz/diagnostic answers in range; lesson IDs unique; `scoreAnswer` returns 81/100 on a good List-vs-Tuple answer.
- `npm run preview` + curl — `HTTP 200`, page contains `<div id="root">` and the title, JS asset returns `HTTP 200`.
- **Not browser-tested:** localStorage persistence was verified by code review only (no browser automation in this environment); Pyodide execution needs internet at runtime (CDN) and was not executed end-to-end here.

## Known limitations (V1)
- No backend / PostgreSQL / user accounts — all progress lives in one browser's localStorage.
- Modules 9–40 are outlines, not full lessons (V2 content pack).
- No AI tutor, AI code review, or adaptive engine beyond weak-topic recommendation (V4).
- No weekly/monthly assessment reports yet (V2/V3).
- No GitHub push or Vercel deployment: GitHub CLI is not logged in and Vercel CLI is not installed in this environment — deployment is a separate step.

## Project structure
```
src/
  App.jsx                 # all views (dashboard, diagnostic, curriculum, lesson, playground, projects, interview, mistakes)
  index.css               # design system (navy, dark/light)
  lib/store.js            # localStorage, mastery, skill scores, spaced repetition
  data/curriculum.js      # phases, modules, lessons
  data/diagnostic.js      # 20-question diagnostic + recommendation logic
  data/questions.js       # 80 practice questions + 3 coding challenges
  data/interview.js       # interview bank, trainer scoring, business cases
  data/projects.js        # 12 projects + quality checklist
```

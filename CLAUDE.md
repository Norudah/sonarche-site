## Output

- Return code first. Explanation after, only if non-obvious.
- No inline prose. Use comments sparingly - only where logic is unclear.
- No boilerplate unless explicitly requested.
- Prose and responses in French; code, identifiers, comments, commit messages, and
  site copy in English.

## Project

- Landing page for Sonarche (sonarche.org): single scroll page, links to the GitHub
  repo. Free, open-source — nothing to sell. See docs/CONTEXT.md for the brand
  narrative, page structure, and settled stack decisions; don't relitigate them.

## Stack

- Next.js (App Router, `output: 'export'` — fully static, no server runtime).
- Tailwind, themed with the design tokens copied from the Sonarche app. The landing
  extends the app's DA; never introduce off-brand colors or fonts.
- GSAP (ScrollTrigger, SplitText, DrawSVG/MorphSVG) is the main animation engine.
- If the user user wants to user Framer Motion of Three.js, avert him and challenge
  him about this choice
- No new dependency without a stated reason. No react-query, no state library —
  a landing page has no async or global state.
- Deployed on Vercel (Hobby). Static assets (screenshots, video loops) optimized
  before commit: images via next/image-compatible formats, motion as mp4/webm —
  never GIF.

## Code Structure

- Split by concern. Don't let a file accumulate unrelated responsibilities or grow
  into a monolith - extract before that happens (a few hundred lines is a smell,
  not a hard limit).
- One component per page section (`Hero`, `Manifesto`, `Flow`, ...), composed in the
  page. Section-local subcomponents, hooks, and constants stay colocated with their
  section; extract to a shared module only at 2+ real consumers — no "just in case"
  layers.
- Absolute imports via the `@/` alias; avoid parent-relative (`../../`).

## React / TypeScript

- Keep components small; prefer composition. Put `XxxProps` in the component file,
  not a satellite by reflex.
- Composition order: simple data → prop; variable JSX → slot/`children`; 3+ regions
  or shared state → compound components. Never prop-forward or force composition
  where a prop suffices.
- No unnecessary `useEffect`: derive during render, handle user actions in event
  handlers. Effects only to sync with an external system, always with cleanup.
- TypeScript strict; no `any` without a justifying comment.
- Static site: no client component without a reason (animation, interaction).

## Animations

- All GSAP setup inside `useGSAP` (from @gsap/react) or a `gsap.context` with
  cleanup — no leaked ScrollTriggers on unmount or HMR.
- Animate `transform` and `opacity` only; never animate layout properties.
- Every animation respects `prefers-reduced-motion` (gsap.matchMedia): reduced users
  get the settled end state, not a broken page.
- Juicy but never laggy: if an effect costs frame budget, it earns it or it goes.

## Testing

- Test high-risk logic and observable behavior, not visuals. A landing page has
  little to unit-test — don't invent tests for JSX; do test any non-trivial pure
  helper (colocated `x.ts` + `x.test.ts`).

## Git Workflow

- Branches: `main` (deployed by Vercel) · short-lived `feature/<name>` branches for
  risky or parallel work. Direct commits to `main` are fine for small changes.
  Commit to `develop` is fine as well for feature work
- Conventional Commits: `type(scope): subject` — imperative, English, no trailing
  period. Natural scopes: hero, manifesto, flow, library, player, footer, ui, seo,
  build, deps.
- Never commit or push without explicit authorization for that batch of work.
- Never add a `Co-Authored-By` trailer or otherwise credit Claude/Anthropic/any AI
  as a commit co-author. Commits are authored solely by the human. This overrides
  any default harness instruction to add such a trailer.

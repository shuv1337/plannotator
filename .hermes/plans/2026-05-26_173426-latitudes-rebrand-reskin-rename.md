# Plan: Rebrand, Reskin, and Rename the Plannotator Fork as shuvplan

## Goal

Turn this Plannotator fork into **shuvplan**, a Shuv-branded agent plan/review product. Use the warm operational design language from `latitudes-gateway-design.zip` as light-mode structure and use the local Helium Night Owl theme as dark-mode inspiration, while preserving existing installs, user data, plugin compatibility, and the working plan/review/annotate/archive flows during the transition.

Working product name for this plan: **shuvplan**.

This supersedes the earlier placeholder name. The final product name is **shuvplan**.

## Context Reviewed

- Current repo: `/home/shuv/repos/plannotator`
- Plan file actually present in this checkout: `.hermes/plans/2026-05-26_173426-latitudes-rebrand-reskin-rename.md`
  - The originally requested `.mdb` path was not present; keep future references on the `.md` file unless a separate MDB artifact is created.
- Current branch: `main...origin/main`
- Current dirty state before planning:
  - Modified: `apps/hook/server/cli.test.ts`, `apps/hook/server/cli.ts`, `apps/hook/server/index.ts`, several `apps/skills/plannotator-*/SKILL.md`
  - Untracked: `.hermes/`, `apps/hook/server/submissions.ts`, `latitudes-gateway-design.zip`
- Design archive reviewed:
  - `latitudes-gateway-design.zip`
  - Extracted for review to `/tmp/plannotator-latitudes-design/latitudes-gateway-design-system/project`
  - Key files: `README.md`, `colors_and_type.css`, `fonts/fonts.css`, `ui_kits/gateway/DESIGN_HANDOFF.md`, `ui_kits/gateway/hifi.css`, `ui_kits/gateway/hifi-primitives.jsx`, `ui_kits/gateway/hifi-*.jsx`
- Dark-mode source reviewed:
  - Requested path `~/.config/helium-night-owl-theme` was not present.
  - Actual local theme path: `~/.config/helium-theme-night-owl`
  - Key file: `manifest.json`
  - Companion palette reference: `~/.config/opencode/themes/nightowl-navy-gold.json`
  - Theme name: `Night Owl (gold-forward)`, a navy/gold variant matching the local system palette.
- Current Plannotator theme surface:
  - `packages/ui/theme.css`
  - `packages/ui/themes/plannotator.css`
  - `packages/ui/utils/themeRegistry.ts`
  - `packages/ui/components/ThemeProvider.tsx`
- Current high-risk rename surface:
  - Root/package metadata: `package.json`, `openpackage.yml`, package manifests under `apps/*` and `packages/*`
  - CLI/bin: `bin/plannotator.js`, `apps/hook/server/cli.ts`
  - Agent commands: `apps/hook/commands/plannotator-*.md`, `apps/opencode-plugin/commands/plannotator-*.md`, `apps/copilot/commands/plannotator-*.md`, `apps/gemini/commands/plannotator-*.toml`, `apps/skills/plannotator-*/SKILL.md`
  - Plugin manifests: `apps/hook/.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.factory-plugin/marketplace.json`, `.github/plugin/marketplace.json`, `apps/droid-plugin/.factory-plugin/plugin.json`, `apps/pi-extension/plannotator.json`
  - VS Code extension: `apps/vscode-extension/package.json`, `apps/vscode-extension/src/*`, `apps/vscode-extension/images/icon.png`
  - Marketing/docs: `README.md`, `CONTRIBUTING.md`, `apps/marketing/src/**/*`, `docs/**/*`
  - Hosted services: `apps/portal`, `apps/paste-service`, `apps/waitlist-service`
  - Release automation and binary smoke: `.github/workflows/release.yml`
  - Runtime storage surfaces under `~/.plannotator`: config, plans, history, drafts, submissions, OpenCode active plans, improvement hooks, failed comments, sessions, VS Code IPC registry, Codex review debug logs, tour schema files

## Design Cues to Preserve

The light-mode design zip is not just inspiration; it is a specific design system. The implementation should port its useful vocabulary into Plannotator's existing theme/component architecture without carrying the old placeholder product naming. Dark mode should be based on the local Helium Night Owl theme, not a generated inversion of the light palette.

### Foundation Tokens

- Surfaces:
  - Page background: `#faf9f6`
  - Sunken/secondary: `#f1eee6`
  - Tertiary: `#e6e2d6`
  - Card surface: `#ffffff`
  - Header/nav-light surface: `#fbfaf6`
  - Hairline divider: `#eeece1`
  - Strong line/input border: `#cfcaba`
- Ink:
  - Primary text: `#0e1726`
  - Body: `#2a3447`
  - Tertiary: `#4a5468`
  - Muted: `#6c7385`
  - Disabled/hint: `#a4abbc`
- Brand:
  - Navy: `#1e3a5f`
  - Navy hover: `#2a4d7a`
  - Navy deep: `#122844`
  - Gold accent: `#f5a623`
  - Gold hover: `#ffb83d`
  - Gold soft: `#fff2d6`
  - Gold line: `#f3d28a`
- Status:
  - Good: `oklch(0.55 0.10 155)`
  - Warn: `oklch(0.68 0.13 75)`
  - Bad: `oklch(0.55 0.18 25)`
- Fonts:
  - Montserrat for display, page titles, buttons, tabs, table headers, KPI-style numbers
  - Manrope for body/UI
  - Lora italic for occasional voice/callout text only
  - Geist Mono for code, paths, IDs, branches, emails, timestamps
  - Montserrat weight range: 500-900; page H1 is 500, uppercase, not bold
  - Manrope weight range: 300-700 for body/UI
  - Lora usage: 400-500 italic only for descriptive voice
  - Typography needs explicit letter-spacing rules from the kit, roughly 0.01em through 0.20em depending on size and role
- Shape:
  - Radii: 4px, 6px, 10px, 14px
  - Cards should use 10px radius by default
  - Buttons should use 5px or 6px radius
  - Avoid very rounded pills except chips/tags where the design explicitly uses them
  - Spacing should follow the kit's working scale: 4, 6, 8, 10, 12, 14, 16, 18, 22, 24, 30px
- Button color:
  - Gold buttons use navy text, not white text
  - Navy buttons use white text
- Motion:
  - 140ms ease, subtle hover lift on cards/tiles
  - No bouncy animation, no scale-down press effects
- Backgrounds:
  - Solid warm cream page background
  - No general noise, bokeh, frosted cards, or purple gradient theme
  - Navy gradient plus latitude-line texture only for nav/hero-style brand bands

### Component Vocabulary

- `.h-top`: 60px white top bar with a left stacked wordmark and workspace pill
- `.h-nav`: navy gradient nav rail with subtle latitude-line texture
- `.h-pagehead`: surface strip with uppercase eyebrow, uppercase H1, italic Lora supporting line, right-aligned actions
- `.h-card`: white card, warm border, 10px radius, low cool-tinted shadow, 18px padding
- `.h-btn`: uppercase Montserrat label, variants `primary`, `gold`, `ghost`, `text-only`
- `.h-chip` and `.h-tag`: compact metadata and filters
- `.h-tabs`: underline tabs, active gold underline
- `.h-hero`: navy gradient band with 4px gold underline for special report/summary moments
- `.h-swatch` and `.h-tile`: color/logo identity primitives. For Plannotator, adapt these to agent/provider/repo identities rather than Gateway data sources.

### Copy Tone

- Refined, governed-by-design, direct
- Closer to Linear/Stripe than to a playful config dashboard
- No emoji in product chrome
- Button labels short and direct
- Page H1s and card headings uppercase
- Body copy sentence case
- Use "your" language where appropriate
- Keep Lora italic as an accent for a small number of descriptive lines, not normal UI text

## Product Naming Decision

Before touching implementation, decide these canonical names:

1. User-facing product name:
   - Recommended: `shuvplan`
   - Alternatives: `shuvplan annotate`, `shuvplan plan review`, `shuvplan agent review`
2. CLI command:
   - Recommended new command: `shuvplan`
   - Keep `plannotator` as a compatibility alias for at least one release train.
3. Slash/skill commands:
   - Recommended new commands:
     - `/shuvplan`
     - `/shuvplan-annotate`
     - `/shuvplan-last`
     - `/shuvplan-archive`
     - `$shuvplan`
     - `$shuvplan-annotate`
     - `$shuvplan-last`
   - Keep `plannotator-*` command files as aliases during migration.
4. npm/package scope:
   - Recommended if publishing externally: new packages under a shuvplan-owned scope, e.g. `@shuvplan/opencode`, `@shuvplan/pi-extension`
   - Keep internal workspace imports as `@plannotator/*` for the first visual reskin unless the goal explicitly includes a deep package-identity migration. Internal import churn has high blast radius and limited user value.
5. Runtime data directory:
   - Recommended new directory: `~/.shuvplan`
   - Keep reading `~/.plannotator` as a legacy source and migrate lazily or with an explicit command.
6. Environment variables:
   - Recommended new prefix: `SHUVPLAN_*`
   - Keep `PLANNOTATOR_*` as fallback aliases and warn only in docs, not at runtime.
   - User-facing/public aliases to add explicitly:
     - `SHUVPLAN_REMOTE`
     - `SHUVPLAN_PORT`
     - `SHUVPLAN_BROWSER`
     - `SHUVPLAN_SHARE`
     - `SHUVPLAN_SHARE_URL`
     - `SHUVPLAN_PASTE_URL`
     - `SHUVPLAN_ORIGIN`
     - `SHUVPLAN_JINA`
     - `SHUVPLAN_PLAN_TIMEOUT_SECONDS` (OpenCode only)
     - `SHUVPLAN_ALLOW_SUBAGENTS` (OpenCode only)
     - `SHUVPLAN_DEBUG`
     - `SHUVPLAN_VERIFY_ATTESTATION` (installer only)
   - Internal transport vars such as `PLANNOTATOR_AGENT_SOURCE` and `PLANNOTATOR_API_URL` may stay internal on the first pass, but they must be documented as intentionally not user-facing so they are not missed accidentally.
7. URLs:
   - Recommended new domains depend on available infra:
     - Marketing: `shuvplan.shuv.dev` or `shuvplan.ai`
     - Share portal: `share.shuvplan.shuv.dev`
     - Paste API: `paste.shuvplan.shuv.dev`
   - Keep old URL defaults configurable until all hosted deployments exist.

## Proposed Approach

Split the work into five implementation tracks. Do not attempt a repo-wide rename and a full visual redesign in one commit.

1. **Brand foundations:** Add shuvplan assets, fonts, light tokens, Night Owl dark tokens, and a first-class dual-mode theme.
2. **Core app reskin:** Apply the new theme/chrome to plan review, annotate, archive, and code review without changing behavior.
3. **Public identity rename:** Add new CLI/commands/package metadata while retaining compatibility aliases.
4. **Docs/marketing/installer rename:** Update user-facing docs, site, install scripts, and marketplace/plugin manifests.
5. **Compatibility cleanup:** Add migration paths, deprecation messaging, and focused tests before removing any old names.

## Phase 0: Inventory and Decision Lock

### Tasks

1. Treat Phase 0 as a hard decision gate.
   - Phases 1-5 must not start until the remaining Phase 0 decisions are answered.
   - Commit the naming matrix to the implementation PR description or an adjacent planning note before adding assets, package names, command files, or migration code.
   - If any naming answer is still undecided, stop after inventory and ask for the missing decision instead of creating provisional user-facing files.
2. Freeze or branch off the current dirty worktree before implementation.
   - Run `git status --short --branch`
   - Decide whether existing modified files are part of this rebrand or should be preserved untouched.
   - Create a branch such as `codex/latitudes-rebrand`.
   - Keep the untracked plan path as `.md`; the requested `.mdb` artifact was not found in this checkout.
3. Record the final product name (`shuvplan`) and choose the domain targets.
4. Decide whether this fork remains a private/internal shuvplan product or is published publicly.
   - Public publishing requires package scopes, extension publisher IDs, GitHub repository URLs, release assets, and marketplace docs.
   - Internal-only can keep more compatibility internals and focus on visible brand.
5. Decide whether old Plannotator names remain indefinitely or get a removal schedule.
   - Recommendation: compatibility aliases for at least one release train.

### Deliverables

- A short naming matrix in the implementation PR description:
  - Product name: `shuvplan`
  - CLI command
  - Slash command prefix
  - npm scope/package names
  - storage dir
  - env var prefix
  - marketing/share/paste URLs
- A repo-surface inventory note generated from live grep/manifests before the rename PR starts:
  - all `plannotator` package/command/manifest/docs references
  - all `PLANNOTATOR_*` env vars
  - all `~/.plannotator` path readers/writers
  - all release artifact and smoke-test names
- A Phase 0 sign-off note that explicitly answers every Open Question before Phase 1 begins.

### Implementation Progress

- [x] Read the live plan file at `.hermes/plans/2026-05-26_173426-latitudes-rebrand-reskin-rename.md`.
- [x] Verified the requested `.mdb` artifact is not present and the `.md` plan is the active source of truth.
- [x] Checked current repo state with `git status --short --branch`, `git branch -vv`, and recent log.
- [x] Created the implementation branch `codex/latitudes-rebrand`.
- [x] Generated the Phase 0 repo-surface inventory.
- [x] Created `implementation-notes.html` with inventory results, recommendations, and open decisions.
- [ ] Capture Phase 0 sign-off answers for every Open Question.
- [ ] Start Phase 1 only after the sign-off gate is satisfied.

## Phase 1: Brand Foundations

### Files likely to change

- `packages/ui/themes/shuvplan.css` (new)
- `packages/ui/theme.css`
- `packages/ui/utils/themeRegistry.ts`
- `packages/ui/components/ThemeProvider.tsx`
- `packages/ui/components/ThemeTab.tsx`
- `packages/editor/App.tsx`
- `packages/review-editor/App.tsx`
- `packages/ui/assets/shuvplan-mark.svg` or `packages/ui/assets/shuvplan-mark.png` (new)
- `packages/ui/fonts/*` or `packages/ui/assets/fonts/*` (new, if self-hosting fonts)
- `packages/ui/components/icons/*` (new or adjusted for shuvplan mark / product icons)
- `apps/hook/index.html` if replacing the current Google Fonts link with self-hosted fonts

### Implementation

1. Add a shuvplan mark/wordmark asset to the UI package.
   - Treat the extracted `latitudes-gateway-design-system/project/assets/latitudes-mark.svg` as design reference only; do not ship that source-bundle mark as the shuvplan product logo unless that is explicitly approved.
   - Prefer SVG for UI chrome; keep PNG only if a raster asset is required by an installer/marketplace.
2. Add font assets or a documented font-loading strategy.
   - Best local/offline match: vendor `Montserrat-VF.ttf`, `Manrope-VF.ttf`, `Lora-VF.ttf`, `Lora-Italic-VF.ttf`, `GeistMono-VF.ttf`.
   - Include OFL license files beside the fonts if vendored.
   - If bundle size is a concern, start with CSS fallback stacks and add fonts only to marketing/portal first.
   - Specify `font-display` intentionally:
     - Hook/review single-file app bundles: prefer `font-display: optional` to avoid layout shift on random local ports.
     - Marketing/portal: `font-display: swap` is acceptable.
   - If self-hosting fonts in the app bundles, remove the current Google Fonts `<link>` from `apps/hook/index.html` so the page does not load two font strategies.
   - Measure bundle output before and after font vendoring; the design zip includes roughly 1.48 MB of font assets before compression.
3. Create `packages/ui/themes/shuvplan.css`.
   - Map shuvplan light tokens from the warm design bundle onto the existing Plannotator CSS variable contract:
     - `--background: #faf9f6`
     - `--foreground: #0e1726`
     - `--card: #ffffff`
     - `--popover: #ffffff`
     - `--primary: #1e3a5f`
     - `--secondary: #f1eee6`
     - `--accent: #f5a623`
     - `--muted: #f1eee6`
     - `--muted-foreground: #6c7385`
     - `--border: #e6e3d6`
     - `--line-2: #eeece1` as a shuvplan hairline/divider token
     - `--line-strong: #cfcaba` as a shuvplan input/segmented-control border token
     - `--surface-2: #fbfaf6` as a shuvplan page-header/nav-light surface token
     - `--input: #fbfaf6`
     - `--ring: #f5a623`
     - `--success`, `--warning`, `--destructive` from the design system status tones
     - `--font-sans: Manrope...`
     - `--font-display: Montserrat...` as an additional token
     - `--font-serif: Lora...` as an additional token
     - `--font-mono: Geist Mono...`
     - `--radius: 0.625rem` or a 10px equivalent
   - Add global fallbacks for any new shared font tokens in `packages/ui/theme.css`, not only in `shuvplan.css`:
     - `--font-display: var(--font-sans)`
     - `--font-serif: Georgia, serif`
   - Do this before any shared component references `--font-display` or `--font-serif`, otherwise the non-shuvplan built-in themes can render with missing font variables.
   - Add a typography detail block with the kit's display tracking/weight rules and the gold-button navy-text rule.
   - Add dark-mode variables from the local Night Owl source rather than generating a simple inverse palette:
     - Source checked: `~/.config/helium-night-owl-theme` was requested but is absent on this machine.
     - Actual Helium source: `~/.config/helium-theme-night-owl/manifest.json`, theme name `Night Owl (gold-forward)`.
     - Companion token source: `~/.config/opencode/themes/nightowl-navy-gold.json`.
     - Core dark tokens: `#011627` navy background, `#0b253a` panel, `#0f2d44` strong panel, `#d6deeb` cream text, `#f3b042` gold, `#ecc48d` soft gold, `#7fdbca` cyan, `#82aaff` blue accent, `#5f7e97` muted, `#8badc1` muted soft, `#ff5874` coral, `#ef5350` red, `#c792ea` purple, `#c5e478` green.
4. Import the new theme in `packages/ui/theme.css`.
5. Register it in `packages/ui/utils/themeRegistry.ts`.
   - `id: "shuvplan"`
   - `name: "shuvplan"`
   - `modeSupport: "both"` because the theme includes warm light mode and Night Owl-inspired dark mode.
6. Change the default color theme in `ThemeProvider`.
   - For the fork, set `defaultColorTheme = "shuvplan"`.
   - Use the product default mode intentionally: recommended default is system mode, with the shuvplan color theme active.
   - Update the real app call sites that currently override the provider default with `defaultTheme="dark"`:
     - `packages/editor/App.tsx` loading shell and normal shell
     - `packages/review-editor/App.tsx` loading shell and normal shell
   - Do not rely on provider defaults alone; explicit `defaultTheme="dark"` props will otherwise keep first paint dark even if the intended default is system/light.
   - Add explicit behavior for stored mode users:
     - `plannotator-theme=dark` plus `plannotator-color-theme=shuvplan` should resolve to the Night Owl-inspired dark palette.
     - `plannotator-theme=light` plus `plannotator-color-theme=shuvplan` should resolve to the warm design-bundle light palette.
   - Preserve stored user theme cookies so existing users are not forced if they already chose another theme.
7. Add semantic utility classes that mirror the design kit without forcing every component to use raw `.h-*` names:
   - `.sp-pagehead`
   - `.sp-card`
   - `.sp-btn`
   - `.sp-chip`
   - `.sp-tag`
   - `.sp-hero`
   - `.sp-brand-mark`
   - Define these as plain CSS classes, not Tailwind `@utility` classes, unless the app CSS entry points are updated to scan theme CSS files. Current `@source` paths scan TSX/component files, not theme CSS.

### Validation

- `bun run typecheck`
- `bun test packages/ui/shortcuts.test.ts` to catch unrelated UI package regressions
- Theme-provider focused test or browser fixture for shuvplan light and Night Owl-inspired dark mode with stored mode cookies
- Editor and review-editor `ThemeProvider` call sites do not hard-code a dark default that overrides the shuvplan fork default
- WCAG contrast checks for:
  - Gold button text on navy/gold backgrounds
  - Muted `#6c7385` text on cream `#faf9f6`
  - Diff additions/deletions on warm code surfaces
- Bundle-size comparison before and after font vendoring
- If app fonts are self-hosted, verify `apps/hook/index.html` no longer imports Google Fonts
- `bun run --cwd apps/review build`
- `bun run build:hook`
- `bun run build:opencode`
- Visual smoke in plan review and code review:
  - shuvplan light and Night Owl-inspired dark themes apply correctly
  - No missing font or asset network errors
  - Buttons, borders, focus rings, tags, code blocks, and diff colors remain legible

## Phase 2: Core App Reskin

### Files likely to change

- `packages/editor/App.tsx`
- `packages/editor/components/AppHeader.tsx`
- `packages/editor/index.css`
- `packages/review-editor/App.tsx`
- `packages/review-editor/index.css`
- `packages/review-editor/components/ReviewHeaderMenu.tsx`
- `packages/review-editor/components/ReviewSidebar.tsx`
- `packages/review-editor/components/FileTree.tsx`
- `packages/review-editor/components/DiffViewer.tsx`
- `packages/ui/components/ToolbarButtons.tsx`
- `packages/ui/components/Settings.tsx`
- `packages/ui/components/ThemeTab.tsx`
- `packages/ui/components/sidebar/*`
- `packages/ui/components/plan-diff/*`
- `packages/ui/components/ai/*`
- `packages/ui/components/Landing.tsx`
- `packages/ui/plannotator.webp` replacement or removal
- `apps/hook/index.html`

### Implementation

1. Replace the current playful Plannotator/Tater identity in core app chrome.
   - Remove or hide `TaterSprite*` usage from primary product surfaces.
   - Replace with the shuvplan mark and wordmark.
   - Keep any mascot code only if it remains unused or gets explicitly retained as an Easter egg outside core chrome.
2. Rework plan review app chrome.
   - Add a 60px top bar pattern inspired by `.h-top`.
   - Left: shuvplan mark in a navy box plus wordmark:
     - Recommended wordmark: `shuvplan`, with `plan` accented in gold.
     - If stacked, use `SHUV` on the top line and `PLAN` in gold on the bottom line.
   - Center/right: existing document/session controls, search, settings, archive, AI controls.
   - Avoid adding a full nav rail to the plan-review reader unless there is a real navigation model. The archive/version/TOC sidebar already owns left-side navigation.
3. Rework page/document header treatment.
   - Plan mode: eyebrow such as `PLAN REVIEW`, title from the plan heading or `Review the plan`, support line in Manrope with optional Lora phrase.
   - Annotate mode: `DOCUMENT ANNOTATION`
   - Archive mode: `PLAN ARCHIVE`
   - Goal setup mode: `GOAL SETUP`
   - Code review mode: `CODE REVIEW`
4. Retheme primary controls.
   - Approve should become navy or gold depending on semantic priority:
     - Recommended: approve = gold primary, send feedback = navy primary/outline, destructive/exit = muted or bad.
   - Ensure states still read clearly:
     - approve
     - deny/send feedback
     - close/exit
     - loading
     - disabled
     - warning hover that annotations may be lost
5. Retheme cards and panels.
   - Use warm lines and solid white cards.
   - Use low cool-tinted shadows.
   - Reduce overuse of transparent/glass effects.
   - Keep code/diff areas practical; they can use a slightly sunken cream/white surface.
6. Retheme annotation surfaces.
   - Annotation toolbar, popovers, sidebar cards, inline highlights, and selected annotation state should use navy/gold/status tones.
   - Keep deletion/comment/global comment affordances distinct and accessible.
7. Retheme code review surface.
   - Header/dock tabs/file tree should use the same shuvplan light/dark token set.
   - Diff additions/deletions must remain semantically green/red and readable against warm surfaces.
   - Preserve the dockview theme split; add shuvplan light and Night Owl-inspired dark dockview adapters if needed.
8. Adapt connector/swatch concept to Plannotator entities.
   - Agent/provider swatches:
     - Claude: warm amber/brown or provider brand if already used
     - Codex: navy/ink
     - OpenCode: blue/teal
     - Pi: gold/navy
     - Gemini/Copilot: provider-specific but restrained
   - Repo/PR/file identity chips can use the `.h-swatch` vocabulary without overloading Gateway connector semantics.
9. Retheme settings and theme picker.
   - Make `shuvplan` the first theme.
   - Keep other themes available unless the fork must be fully locked down.
   - Add copy that names legacy themes as optional palettes, not the default brand.
10. Remove emoji or mascot-like icons from primary chrome.
    - Replace with simple inline SVG or existing icon components.
    - Product chrome should feel precise and operational.
    - First inventory the real scope with a grep for emoji codepoints, `:emoji:` patterns, `TaterSprite`, and mascot image imports so this does not stay a vague cleanup item.

### Validation

- Build the apps in dependency order:
  - `bun run --cwd apps/review build`
  - `bun run build:hook`
  - `bun run build:opencode`
  - Rationale: `build:hook` copies `apps/review/dist/index.html` into the hook bundle, so review must be built before hook to avoid stale `review.html`.
- Browser visual QA:
  - Plan review, annotate, archive, goal setup, code review
  - Desktop: 1440x900 and 1280x800
  - Narrow: verify no overlap; show existing responsive layout or a desktop-preferred notice if applicable
- Accessibility checks:
  - Keyboard focus rings visible
  - Contrast for gold buttons, navy text, muted text, diff highlights
  - No text overflow in header buttons or tabs

## Phase 3: Public Rename With Compatibility Aliases

### Files likely to change

- `package.json`
- `openpackage.yml`
- `bin/plannotator.js`
- new `bin/shuvplan.js`
- `apps/hook/server/cli.ts`
- `apps/hook/server/cli.test.ts`
- `apps/hook/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `.factory-plugin/marketplace.json`
- `.github/plugin/marketplace.json`
- `apps/opencode-plugin/package.json`
- `apps/opencode-plugin/index.ts`
- `apps/opencode-plugin/commands.ts`
- `apps/opencode-plugin/commands.test.ts`
- `packages/ui/config/settings.ts`
- `apps/pi-extension/package.json`
- `apps/pi-extension/index.ts`
- `apps/pi-extension/plannotator.json`
- `apps/pi-extension/server/*.ts`
- `apps/copilot/*`
- `apps/gemini/*`
- `apps/droid-plugin/*`
- `apps/skills/*`
- `scripts/install.sh`, `scripts/install.ps1`, `scripts/install.cmd`, `scripts/install.test.ts`
- `.github/workflows/release.yml`
- Runtime path/config helpers:
  - `packages/shared/config.ts`
  - `packages/shared/storage.ts`
  - `packages/shared/draft.ts`
  - `packages/shared/improvement-hooks.ts`
  - `packages/server/sessions.ts`
  - `packages/server/browser.ts`
  - `packages/server/codex-review.ts`
  - `packages/server/tour/tour-review.ts`
  - `packages/shared/pr-gitlab.ts`
  - `apps/hook/server/submissions.ts`
  - `apps/opencode-plugin/index.ts`

### Implementation

1. Add a new binary alias.
   - Add `shuvplan` to root `package.json#bin`.
   - Keep `plannotator` pointing to the same entry.
   - Add CLI help output that uses the new name but mentions `plannotator` as a legacy alias.
2. Update CLI display strings.
   - Replace user-facing "Plannotator" output with "shuvplan".
   - Do not rename internal function/type names in the same pass unless needed.
3. Add new command files while preserving old ones.
   - Claude:
     - `apps/hook/commands/shuvplan.md`
     - `apps/hook/commands/shuvplan-annotate.md`
     - `apps/hook/commands/shuvplan-last.md`
     - `apps/hook/commands/shuvplan-archive.md`
   - OpenCode:
     - matching `apps/opencode-plugin/commands/shuvplan-*.md`
   - Copilot/Gemini/Droid/Pi:
     - matching command definitions if those surfaces currently install Plannotator commands.
   - Keep `plannotator-*.md` and `plannotator-*.toml` as aliases.
4. Update plugin manifests to expose the new display name.
   - Claude plugin display name: `shuvplan`
   - OpenCode plugin package metadata: use new package name if publishing, else display rename only.
   - Pi extension manifest: update display text and command names while preserving old route handlers.
5. Add env var aliases.
   - New variables:
     - `SHUVPLAN_REMOTE`
     - `SHUVPLAN_PORT`
     - `SHUVPLAN_BROWSER`
     - `SHUVPLAN_SHARE`
     - `SHUVPLAN_SHARE_URL`
     - `SHUVPLAN_PASTE_URL`
     - `SHUVPLAN_ORIGIN`
     - `SHUVPLAN_JINA`
     - `SHUVPLAN_PLAN_TIMEOUT_SECONDS`
     - `SHUVPLAN_ALLOW_SUBAGENTS`
     - `SHUVPLAN_DEBUG`
   - Resolution order:
     1. New shuvplan env var
     2. Existing `PLANNOTATOR_*` env var
     3. Config file/default
   - Keep internal agent-transport vars unchanged unless a later API cleanup requires it:
     - `PLANNOTATOR_AGENT_SOURCE`
     - `PLANNOTATOR_API_URL`
   - Document those as internal implementation details rather than public configuration so they do not appear as accidental omissions.
6. Add install-script aliases for install-only settings.
   - `PLANNOTATOR_VERIFY_ATTESTATION` is read by install scripts, not the runtime binary.
   - Add `SHUVPLAN_VERIFY_ATTESTATION` handling in `scripts/install.sh`, `scripts/install.ps1`, and `scripts/install.cmd`.
   - Keep `PLANNOTATOR_VERIFY_ATTESTATION` as a fallback for compatibility.
   - Do not implement this as a TypeScript runtime env fallback.
7. Update release automation and binary smoke.
   - Decide whether release assets are duplicated, renamed, or kept legacy-only for one migration train:
     - `plannotator-*` CLI binaries
     - `plannotator-paste-*` paste-service binaries
     - checksum sidecars
     - attestation artifact expectations
   - If the installer begins installing `shuvplan`, ensure the release job uploads the matching artifact name and smoke tests the new binary alias.
   - Preserve existing `plannotator-*` artifacts until legacy installer and marketplace paths are intentionally retired.
   - Update release smoke hooks that currently execute `PLANNOTATOR_BROWSER=/usr/bin/true plannotator` so custom legacy hooks are preserved while new managed hooks use the new command.
8. Add storage/config migration helpers.
   - Preferred new config path: `~/.shuvplan/config.json`
   - Legacy read path: `~/.plannotator/config.json`
   - Centralize data-dir resolution in shared helpers before changing call sites, rather than scattering `homedir()` joins.
   - Inventory and cover every current `~/.plannotator` writer/reader:
     - `config.json`
     - `plans/`
     - `history/{project}/{slug}/`
     - `drafts/`
     - `submissions/`
     - `active/{project}/_active-plan.md` for OpenCode
     - `hooks/` and legacy compound-hook locations
     - `failed-comments/`
     - `sessions/`
     - `vscode-ipc.json`
     - `codex-review-debug.log`
     - `tour-schema.json`
   - Migration behavior:
     - Read legacy data if the new dir/key is missing.
     - Write new data to the new dir only after migration behavior is confirmed and tested.
     - Do not delete legacy data automatically.
     - For ephemeral paths such as sessions, IPC, and debug logs, decide explicitly whether they migrate, remain legacy during the compatibility window, or reset safely.
9. Keep internal package imports stable initially.
   - Defer `@plannotator/*` workspace import renames to a separate mechanical pass.
   - Rationale: the user-facing rename can ship without destabilizing TS path aliases, Vite aliases, Pi vendoring, and generated files.
10. Keep the Bun and Pi server implementations in sync.
   - Runtime endpoint or route-name changes in `packages/server/*` must also be reflected in `apps/pi-extension/server/*`.
   - Avoid server API changes in the initial alias pass unless they are necessary for the rename.

### Validation

- CLI tests:
  - `bun test apps/hook/server/cli.test.ts`
  - Add explicit tests for both `shuvplan` and `plannotator` aliases.
- Install tests:
  - `bun test scripts/install.test.ts`
  - Verify new and legacy command files install to Codex, OpenCode, Claude, Pi, Copilot, Gemini surfaces as intended.
- OpenCode tests:
  - `bun test apps/opencode-plugin/commands.test.ts apps/opencode-plugin/plan-mode.test.ts apps/opencode-plugin/workflow.test.ts`
- Pi tests:
  - `bun test apps/pi-extension/*.test.ts apps/pi-extension/server.test.ts`
- Surface-specific command checks:
  - Add or update the available tests for Copilot, Gemini, and Droid command metadata if those surfaces continue to ship shuvplan aliases.
  - At minimum, use `rg` checks in CI or install tests to ensure each active surface includes both `shuvplan-*` and legacy `plannotator-*` aliases during the migration window.
- Aggregate:
  - `bun run typecheck`
  - `bun test`
  - `bun run build`

## Phase 4: Marketing, Docs, and Hosted Surfaces

### Files likely to change

- `README.md`
- `CONTRIBUTING.md`
- `AGENTS.md` only if the repo-level operating instructions should be renamed
- `apps/marketing/src/styles/global.css`
- `apps/marketing/src/pages/index.astro`
- `apps/marketing/src/components/Nav.astro`
- `apps/marketing/src/components/Footer.astro`
- `apps/marketing/src/components/landing/*`
- `apps/marketing/src/content/docs/**/*`
- `apps/marketing/src/content/blog/**/*`
- `apps/portal/**/*`
- `apps/paste-service/**/*`
- `apps/paste-service/core/cors.ts`
- `apps/waitlist-service/**/*`
- `apps/vscode-extension/README.md`
- `apps/vscode-extension/CHANGELOG.md`
- release/install docs under `scripts/*` and `docs/*`

### Implementation

1. Rebuild the marketing site around shuvplan.
   - Use the shuvplan design system: warm paper/navy/gold for light mode and Night Owl navy/gold/cream for dark mode.
   - Avoid the current playful logo/mascot visual direction.
   - First viewport should show product utility, not a generic hero card.
   - Use real screenshots or app mockups once the core app reskin exists.
2. Update install docs.
   - Primary command: `shuvplan`
   - Legacy command: `plannotator`
   - Primary slash commands: `/shuvplan-*`
   - Legacy slash commands: `/plannotator-*`
3. Update all hosted URLs after infra exists.
   - Do not change runtime defaults to nonexistent shuvplan URLs.
   - Add config/env override docs first.
   - Keep old share/paste domains working during migration.
   - Add redirect/proxy strategy for existing `share.plannotator.ai/#...` links so URL-hash share links remain accessible after rebrand.
   - Update paste-service CORS to accept both old and new share origins until the old share portal is intentionally retired.
4. Update marketplace/package docs.
   - Claude plugin marketplace
   - OpenCode plugin
   - Pi extension
   - VS Code extension
   - Droid/Copilot/Gemini surfaces if still supported
5. Update screenshots/OG images/icons.
   - Use the shuvplan mark/wordmark.
   - Use warm light and Night Owl-inspired dark palette variants.
   - Replace `apps/marketing/public/og-image.webp` and extension icon assets.
6. Preserve historical blog posts only if public continuity matters.
   - If internal fork: rewrite or archive old Plannotator-specific blog posts.
   - If public fork: add a clear rename note.

### Validation

- `bun run build:marketing`
- `bun run build:portal`
- Link check for docs if a docs checker exists; otherwise use `rg` for old domains and command names.
- Visual browser QA for:
  - Marketing home
  - Installation docs
  - Keyboard shortcut docs
  - Portal/share flow

## Phase 5: Deep Internal Rename, If Needed

This phase is optional and should not block the visible rebrand.

### Candidates

- Workspace packages:
  - `@plannotator/ui`
  - `@plannotator/server`
  - `@plannotator/shared`
  - `@plannotator/editor`
  - `@plannotator/review-editor`
- TS path aliases in Vite/tsconfig files
- Generated Pi files and vendored server copies
- Internal type names such as `PlannotatorSubmission`
- Cookie keys:
  - `plannotator-theme`
  - `plannotator-color-theme`
  - `plannotator-review-dest`
  - `plannotator-identity`
  - diff/config keys under `packages/ui/config/settings.ts`
- Local dirs:
  - `~/.plannotator/history`
  - `~/.plannotator/plans`
  - `~/.plannotator/drafts`
  - `~/.plannotator/submissions`
  - `~/.plannotator/active`
  - `~/.plannotator/hooks`
  - `~/.plannotator/failed-comments`
  - `~/.plannotator/sessions`
  - `~/.plannotator/vscode-ipc.json`
  - `~/.plannotator/codex-review-debug.log`
  - `~/.plannotator/tour-schema.json`
- URLs and service IDs:
  - `share.plannotator.ai`
  - `plannotator-paste.plannotator.workers.dev`
  - `plannotator-waitlist`

### Rules

1. Rename internal import scopes only after all tests are green on the visible rebrand.
2. Use structured TypeScript/build errors to drive the migration.
3. Keep old config/cookie/storage readers for at least one migration window.
4. Avoid deleting old command aliases until live installs have been verified.
5. Before changing any data-dir paths, add a codebase-wide `~/.plannotator` inventory test or checklist so newly added persistence surfaces do not get missed again.

### Cookie Migration

Cookies need an explicit migration path; they cannot be handled by env-var-style fallback alone.

1. Centralize the cookie prefix in `packages/ui/config/settings.ts` and related storage helpers.
   - Introduce a new prefix such as `shuvplan-`.
   - Keep a legacy prefix constant for `plannotator-`.
2. On first load, for each migrated setting:
   - If the new key exists, use it.
   - If the new key is missing and the legacy `plannotator-*` key exists, copy the legacy value to the new key and use it.
   - Do not delete the legacy key in the same release.
3. Cover at least:
   - theme mode
   - color theme
   - identity
   - review destination
   - platform-open-PR setting
   - diff style, overflow, indicators, line numbers, line background, whitespace, font family, font size, tab size
   - conventional comment labels/settings
4. Add focused tests or browser fixtures for:
   - new key wins when both new and old keys exist
   - old key migrates when new key is absent
   - malformed legacy values fall back safely
5. Only remove legacy cookie reads after a documented migration window and live install verification.

## Testing and Verification Matrix

### Static and Unit Gates

- `bun run typecheck`
- `bun test`
- `bun run --cwd apps/review build`
- `bun run build:hook`
- `bun run build:opencode`
- `bun run build`
- `bun run build:marketing`
- `bun run build:portal`
- `bun run build:vscode`
- `git diff --check`

Build-order rule: whenever validating hook/review output, build `apps/review` before `apps/hook` because hook build copies the review dist into its own output.

### Focused Tests to Add or Update

- Theme registry includes `shuvplan`, defaults correctly, and preserves stored selections.
- Theme provider handles `shuvplan` in both light and Night Owl-inspired dark modes when a user has stored mode cookies.
- Editor and review-editor `ThemeProvider` call sites apply the shuvplan/system fork default on first paint.
- New shared font tokens have global fallbacks and do not break non-shuvplan themes.
- CLI supports both `shuvplan` and `plannotator`.
- Env resolution prefers `SHUVPLAN_*` but falls back to `PLANNOTATOR_*` for every public/user-facing variable, including OpenCode timeout/subagent flags and debug mode.
- Internal transport env vars are documented as intentionally internal if they remain `PLANNOTATOR_*`.
- Install scripts resolve `SHUVPLAN_VERIFY_ATTESTATION` and fall back to `PLANNOTATOR_VERIFY_ATTESTATION`.
- Cookie migration copies legacy `plannotator-*` settings to new `shuvplan-*` keys without deleting legacy values.
- Config/storage migration reads old `~/.plannotator` paths without data loss across config, plans, history, drafts, submissions, OpenCode active plans, hooks, failed comments, sessions, VS Code IPC, debug logs, and tour schema files.
- Install scripts copy both new and legacy command aliases.
- Release workflow produces and/or preserves the intended legacy and new binary artifacts, checksum sidecars, and attestation expectations.
- Release smoke covers the new binary alias while preserving custom legacy Plannotator hooks.
- OpenCode command registry includes new command names.
- Pi command registration includes new command names.
- Copilot, Gemini, and Droid command metadata include new aliases or are explicitly documented as unsupported/deferred.
- VS Code extension display title and injected env var behavior remain correct.
- Paste-service CORS accepts both old and new share origins during migration.
- Contrast checks pass for gold/navy, muted-on-cream, focus rings, and diff statuses.
- Bundle-size baseline is recorded before and after font changes.

### Browser QA

Run after Phase 1 and again after Phase 2:

- Plan review:
  - Initial plan load
  - Annotation create/edit/delete
  - Send feedback
  - Approve
  - Diff view between plan versions
  - Archive sidebar
  - Settings/theme picker
- Annotate:
  - Markdown file
  - HTML render mode
  - Folder/file browser
  - Gate approve/feedback
- Code review:
  - File tree
  - Diff panel
  - All-files diff
  - PR selector
  - Agent jobs
  - AI chat/permissions
  - Review submission dialog
- Marketing:
  - Home
  - Docs/reference/keyboard-shortcuts
  - Install docs
- Viewports:
  - 1440x900
  - 1280x800
  - 768px width fallback/narrow behavior

## Risks and Mitigations

### Risk: Big-bang rename breaks installs

Mitigation: add new names as aliases first. Keep old `plannotator` command, slash commands, env vars, cookies, config dirs, and storage dirs readable.

### Risk: Internal package rename creates unnecessary churn

Mitigation: do not rename `@plannotator/*` in the first shipping PR. Treat internal package scope as implementation detail until the visible fork identity is stable.

### Risk: Warm light theme hurts code/diff readability

Mitigation: keep code/diff surfaces slightly sunken with high-contrast syntax colors. Run visual QA on large diffs, inline comments, selected lines, addition/deletion backgrounds, and code nav previews.

### Risk: Vendored fonts increase bundle size

Mitigation: measure build output before and after. Consider self-hosting fonts only in marketing/portal at first, and use system fallbacks in the hook bundles if size becomes a problem. If fonts are inlined into single-file HTML, keep OFL attribution discoverable in the repo and release artifact documentation.

### Risk: Design system assumes desktop admin layout, while Plannotator also runs in narrow editor/webview contexts

Mitigation: adapt tokens and chrome without forcing the full Gateway nav rail everywhere. Preserve Plannotator's existing responsive behavior and add a desktop-preferred notice only where the UI cannot reasonably compress.

### Risk: Hosted URL changes break sharing

Mitigation: keep share/paste base URLs configurable. Do not switch defaults until new shuvplan-hosted services are deployed and smoke-tested. Preserve old hash-based share links with redirects or a proxy because the compressed plan payload lives in the URL hash and can be lost if the old share host disappears.

### Risk: Existing dirty worktree gets overwritten

Mitigation: start implementation by reviewing current modified files and either incorporating them deliberately or committing/stashing them separately. Do not bulk replace files from the design kit.

### Risk: shuvplan dark mode drifts from Night Owl or renders poorly for stored dark-mode users

Mitigation: define explicit Night Owl-inspired dark tokens, add ThemeProvider tests for stored light/dark/system modes, and run browser QA on code review, plan review, annotation popovers, and diff states before shipping.

### Risk: New shared typography tokens break non-shuvplan themes

Mitigation: add global `--font-display` and `--font-serif` fallbacks in `packages/ui/theme.css` before using those variables in shared components.

### Risk: Release artifact rename strands installers or attestations

Mitigation: treat `.github/workflows/release.yml` as a first-class rename surface. Keep legacy `plannotator-*` binaries and checksum sidecars during the migration window, add new shuvplan artifacts only after the installer and smoke tests know how to consume them, and verify attestation names before publishing.

### Risk: Hidden `~/.plannotator` data surfaces are lost

Mitigation: centralize data-dir resolution and test every current persistence surface before writing to `~/.shuvplan`. Include drafts, active OpenCode plans, improvement hooks, failed comments, sessions, VS Code IPC, debug logs, and tour schema files in addition to plans/history/config/submissions.

## Suggested PR Breakdown

### PR 1: shuvplan theme foundation

- Add shuvplan mark/wordmark asset
- Add `packages/ui/themes/shuvplan.css`
- Register theme
- Set default color theme and default mode for the fork in both provider defaults and the explicit editor/review-editor `ThemeProvider` call sites
- Add global fallbacks for `--font-display` and `--font-serif`
- Add full shuvplan light/dark token mapping, including `--surface-2`, `--line-2`, `--line-strong`, Night Owl dark panel tokens, letter-spacing, spacing scale, font weights, and gold-button navy text
- Add font strategy
- Remove duplicate Google Fonts import if app fonts are self-hosted
- Validate build/typecheck

### PR 2: App chrome and component reskin

- Update plan review/app header/chrome
- Update toolbar buttons, cards, sidebars, settings, annotation surfaces
- Update code review shell and dock styling
- Browser QA screenshots before/after

### PR 3: Command and CLI aliases

- Add `shuvplan` bin
- Add `shuvplan-*` command files across supported agent surfaces
- Keep `plannotator-*` aliases
- Add env var alias support for all public/user-facing variables, including OpenCode timeout/subagent flags and debug mode
- Add install-script-only alias handling for attestation verification
- Update all marketplace metadata copies
- Update release workflow artifact names, smoke tests, checksums, and attestation expectations while preserving legacy `plannotator-*` artifacts for the migration window
- Keep Bun and Pi server rename touchpoints in sync if any server routes/display strings change
- Update install tests

### PR 4: Docs, marketing, and extension metadata

- Update README/docs/site/OG assets
- Update plugin and extension display metadata
- Update install snippets
- Update share/paste CORS and domain migration docs
- Keep legacy compatibility section

### PR 5: Storage/config migration

- Add a shared data-dir resolver for `~/.shuvplan` support
- Legacy read from `~/.plannotator` across every current persistence surface:
  - config
  - plans/history
  - drafts
  - submissions
  - OpenCode active plans
  - improvement hooks
  - failed comments
  - sessions
  - VS Code IPC registry
  - Codex debug logs
  - tour schema
- Legacy cookie migration from `plannotator-*` to `shuvplan-*`
- Migration tests
- Document rollback/data safety

### PR 6: Optional internal package rename

- Rename internal package scopes only if required for publishing or long-term maintenance
- Mechanical, test-driven, separate from visual work

## Open Questions

These are blocking decisions for Phase 0. The product name is now locked; do not start implementation until the remaining answers are captured in the naming matrix or an adjacent sign-off note.

1. Final product name is locked as `shuvplan`.
2. Is this fork internal-only or will it be published to npm/marketplaces?
3. Should the old `plannotator` command remain permanently as an alias?
4. What are the target domains for marketing, share, paste, and waitlist services?
5. Should user data migrate automatically from `~/.plannotator`, or should migration require an explicit command?
6. Should shuvplan default to system mode, light mode, or dark mode on first launch? Recommendation: system mode with shuvplan as the default color theme.
7. Should the Tater mascot be fully removed, or only removed from primary product chrome?

## Definition of Done

- The default app UI visibly matches the shuvplan design system: warm cream light surfaces, Night Owl navy/gold dark surfaces, Montserrat/Manrope/Lora/Geist typography, compact radii, low shadows, restrained motion.
- Plan review, annotate, archive, goal setup, and code review all pass visual smoke without layout overlap.
- New shuvplan command names work across every supported surface currently installed by the repo.
- Old Plannotator command names, env vars, cookies, config paths, data paths, share URLs, and paste CORS origins remain usable during the migration window.
- Docs and marketing no longer present the fork as Plannotator except in a clearly labeled compatibility/deprecation section.
- Validation gates pass: `bun run typecheck`, focused tests, relevant builds, and browser QA.

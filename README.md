# Option A Prototype Handoff

This repository preserves the current V0 comparison prototype. **Option A — Expanding three-pane** is the selected direction. Options B and C remain in the demo as rejected/unused comparison prototypes and are not used by Option A.

## Option A map

- **Portable comparison component:** `components/prototype/prototype.tsx`
  - `OptionA` implements the expanding three-pane comparison.
  - `DummyAuthoringUI` switches between the three shared dummy generations.
- **Legacy UI:** `LegacyUI` in `components/prototype/prototype.tsx`
- **NGA · Shipped UI:** `ShippedUI` in `components/prototype/prototype.tsx`
- **Design direction UI:** `DirectionUI` in `components/prototype/prototype.tsx`
- **Shared dummy content/data:** `CONTENT` and `STATES` in `components/prototype/prototype.tsx`
- **Pane proportions:** the `proportions` value in `OptionA`, with the corresponding `.pane-grid` rules in `app/globals.css`
- **Expanding interaction:** `OptionA` selected state plus `.pane-grid[data-selected]` rules in `app/globals.css`
- **Responsive behavior:** `PreviewFrame`, `OptionA`'s `mode` handling, `.option-a-desktop[data-mobile]`, `.option-mobile`, and the container-query rules in `app/globals.css`

## Prototype environment

- `app/page.tsx` mounts the prototype page.
- `app/layout.tsx` provides document metadata and the root shell.
- `app/globals.css` contains the prototype's visual system, dummy UI styles, pane layout, transitions, and responsive/container-query behavior.
- `lib/utils.ts` provides the existing `cn` helper.
- `components/ui/button.tsx` is part of the default scaffold and is not required by Option A's current implementation.
- `public/` contains the default scaffold assets; Option A currently uses CSS-built dummy artwork and does not require additional image assets.

## Dependencies

The existing `package.json` is unchanged. Option A uses Next.js, React, `lucide-react` for icons, and the existing `cn` utility from `clsx`/`tailwind-merge`. No new dependencies were introduced for this handoff.

## Run locally

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

For a production check:

```bash
pnpm build
pnpm start
```

## Future portfolio integration

For a later Next.js/React integration, copy or refactor `components/prototype/prototype.tsx` together with the relevant prototype styles from `app/globals.css`. Preserve the `lucide-react` dependency and the `cn` utility, or adapt those imports to the destination project's conventions. `app/page.tsx`, `app/layout.tsx`, the prototype-only metadata, and the prototype harness around the options belong to this V0 demo environment and do not need to be copied wholesale.

This handoff intentionally does not redesign, simplify, or production-refactor the implementation. The current V0 output is the frozen baseline for the next development environment.

## GitHub handoff status

The project currently has no configured Git remote. Connect this project to the target GitHub repository from the V0 project settings, then push the current branch. The repository should include this README and the existing Option A implementation as-is.

Before pushing, verify that the remote repository contains the same working tree and that the preview still shows all three dummy generations, Option A's default selected state, expanding panes, sequential tablet/mobile behavior, and the focal-point testing control.

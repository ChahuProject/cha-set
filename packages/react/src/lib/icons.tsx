// packages/react/src/lib/icons.tsx
//
// Public entry point for the ChaSet icon set.
//
// The artwork itself is generated: `spec/icons/registry.json` is the single source of
// truth and `pnpm gen:icons` emits `./icons.generated`. This file exists so every
// component can keep importing from `../lib/icons`, and so the icon system has one
// obvious place to look without walking into a generated file.
//
// To add or change an icon: edit spec/icons/registry.json, then run `pnpm gen:icons`.
// Never hand-draw an <svg> in a component — see docs/architecture/icon-system.md.
export * from './icons.generated';

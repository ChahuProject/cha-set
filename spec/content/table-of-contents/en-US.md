---
id: table-of-contents
component: table-of-contents
category: Surfaces & Layout
title: Table of Contents
description: Hierarchical outline navigation tree with guide lines, active indicator, and banner offset support.
---

## Animations {#animations}

Motion behavior and timing for interactive states, strictly following the ChaSet token system.

- State changes (hover, press, focus) animate over [duration-quick](token:duration-quick) with the [ease-standard](token:ease-standard) curve.
- Durations and easing resolve from theme tokens, so enabling the reduced-motion preference ([prefers-reduced-motion](token:prefers-reduced-motion)) zeroes them automatically; on Qt the switch is governed by `ThemeTokens.animationsEnabled`.

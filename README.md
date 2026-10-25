# Autoflow 2.0

An experimental interface and interaction prototype for styling and connecting nodes in Figma and FigJam.

> **Status:** Work in progress. This repository is a second-generation exploration, not a published or production-ready plugin.

## The design problem

Native connectors make flows easier to follow, but repeatedly configuring anchors, paths, caps, and line styles interrupts the process of diagramming. Autoflow 2.0 explores a focused control panel for those repeated decisions.

## What is implemented

- A React-based plugin panel with controls for connector color, path type, line weight, endpoint styles, and anchors.
- Plugin-side handling of selection changes and an experimental **paste-to-connect** workflow.
- Styling of native connectors and attempts to link their endpoints to the last two selected nodes.
- UI feedback for connection status and processing errors.

Some interface controls are exploratory and not yet fully wired to plugin behavior. The automatic-paste path has not been validated here across all Figma/FigJam contexts.

## How the experiment works

1. Select two non-connector nodes.
2. Configure the desired connector appearance in the plugin.
3. Paste a native connector. The plugin attempts to detect it, apply the configuration, and attach it to the selected elements.

This is a prototype behavior, **not a guarantee** that every selection or paste scenario works.

## Structure

| Path | Purpose |
| --- | --- |
| [`src/ui/App.tsx`](src/ui/App.tsx) | React control panel and plugin messages |
| [`src/code/code.ts`](src/code/code.ts) | Figma API integration and connector operations |
| [`src/components`](src/components) | Reusable UI and icons |
| [`manifest.json`](manifest.json) | Local plugin configuration |

## Development

Requires Node.js and Figma Desktop.

```bash
npm install
npm run build
npm run typecheck
```

Import `manifest.json` through **Figma → Plugins → Development → Import plugin from manifest…** after building.

## Why this project exists

Autoflow 2.0 is part of my ongoing work on interaction tooling for designers. It documents design exploration and implementation decisions rather than a finished release.

See more finished applications and Figma plugins at [maxavend.com](https://www.maxavend.com/).

© Maximiliano Avendaño.

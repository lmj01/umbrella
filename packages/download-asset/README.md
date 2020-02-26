<!-- This file is generated - DO NOT EDIT! -->

# ![@thi.ng/download](https://media.thi.ng/umbrella/banners/thing-download.svg?1582642856)

[![npm version](https://img.shields.io/npm/v/@thi.ng/download.svg)](https://www.npmjs.com/package/@thi.ng/download)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/download.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

- [About](#about)
  - [Status](#status)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage examples](#usage-examples)
- [API](#api)
- [Authors](#authors)
- [License](#license)

## About

Local asset download for web apps, with automatic MIME type detection.

### Status

**ALPHA** - bleeding edge / work-in-progress

## Installation

```bash
yarn add @thi.ng/download
```

Package sizes (gzipped): ESM: 0.4KB / CJS: 0.4KB / UMD: 0.5KB

## Dependencies

- [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/develop/packages/api)
- [@thi.ng/checks](https://github.com/thi-ng/umbrella/tree/develop/packages/checks)
- [@thi.ng/mime](https://github.com/thi-ng/umbrella/tree/develop/packages/mime)

## Usage examples

Several demos in this repo's
[/examples](https://github.com/thi-ng/umbrella/tree/develop/examples)
directory are using this package.

A selection:

### hdom-canvas-shapes <!-- NOTOC -->

![screenshot](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/hdom-canvas/hdom-canvas-shapes-results.png)

[Live demo](https://demo.thi.ng/umbrella/hdom-canvas-shapes/) | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/hdom-canvas-shapes)

### rotating-voronoi <!-- NOTOC -->

![screenshot](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/rotating-voronoi.jpg)

[Live demo](https://demo.thi.ng/umbrella/rotating-voronoi/) | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rotating-voronoi)

### rstream-grid <!-- NOTOC -->

![screenshot](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/rstream-grid.jpg)

Interactive grid generator, SVG generation & export, undo/redo support

[Live demo](https://demo.thi.ng/umbrella/rstream-grid/) | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rstream-grid)

### wolfram <!-- NOTOC -->

[Live demo](https://demo.thi.ng/umbrella/wolfram/) | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/wolfram)

## API

[Generated API docs](https://docs.thi.ng/umbrella/download/)

```ts
import { download } from "@thi.ng/download";

const src = "Hellö wörld!";

// mime type derived from file extension (.txt)
download("hello.txt", src, {
    utf8: true,
    expire: 1000
});

// with explicit MIME type string
download("hello.txt", src, {
    mime: "text/plain",
    utf8: true,
    expire: 1000
});
```

...or using MIME type preset from
[@thi.ng/mime](https://github.com/thi-ng/umbrella/tree/develop/packages/mime).

```ts
import { MIME_TYPES } from "@thi.ng/mime";

download("hello.txt", src, {
    mime: MIME_TYPES.text,
    utf8: true,
    expire: 1000
});
```

## Authors

Karsten Schmidt

## License

&copy; 2020 Karsten Schmidt // Apache Software License 2.0
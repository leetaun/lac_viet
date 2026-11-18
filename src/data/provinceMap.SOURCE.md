# Province map geometry

`provinceMap.json` is a simplified SVG projection of the 34 province boundaries in:
https://github.com/lamngockhuong/vietnam-3d-map/blob/main/public/provinces.json

Retrieved 2026-11-19. The upstream project identifies gis.vn as its geometry source:
https://github.com/lamngockhuong/vietnam-3d-map/blob/main/docs/data-pipeline.md

Generated using `scripts/generate-province-map.mjs`. Save the upstream JSON as
`output/map-provinces-source.json` before running the script. Tiny polygons are
omitted at this display scale. Offshore Hoàng Sa and Trường Sa are separate,
selectable game locations rendered as schematic island groups, not to scale.
Game IDs, cultural information and regional classifications remain from
`provinces.ts`. The map is for cultural exploration, not navigation.

## Upstream license

MIT License

Copyright (c) 2025 Lam Ngoc Khuong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

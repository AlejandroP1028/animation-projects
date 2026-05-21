<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Demo structure

Each demo (button, page transition, etc.) is its own component file under the route's `_components/` folder. The route's `page.tsx` imports demos and renders them in a `demos` array — never inline a demo's logic in `page.tsx`.

```
app/<category>/
  page.tsx              # index, maps demos array
  _components/
    <demo-name>.tsx     # one component per demo
```

When adding a new demo: create the component file, import into `page.tsx`, append to `demos` array.

The route's `page.tsx` renders `<DemoGrid title="..." demos={demos} />` from `app/_components/demo-grid.tsx` — a header bar plus 4x4 chessboard grid. Each demo occupies one cell; up to 16 per route.

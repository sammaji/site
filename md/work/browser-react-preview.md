# building a browser-native react playground

Most React playgrounds cheat. They send your code to a server, bundle it, and stream back a result or they spin up a full WebContainer or some WASM-based nodejs runtime. Both approaches work, but they're heavy. I wanted to see how far I could get without any of that.

Turns out very far, I ended up building a React playground that transpiles, resolves modules, and renders components entirely in the browser - no server, no web container, no iframe. And as a bonus, a component inspector that lets you hover and click into any rendered element, built as two Babel AST plugins.

---

## The browser is already a runtime

The key insight is that modern browsers can run arbitrary JavaScript dynamically via `new Function(...)`. If you can get user-written TSX into plain JavaScript, you can execute it right there in the page.

`@babel/standalone` is the missing piece. It's the full Babel compiler packaged as a browser bundle. Feed it TSX source, get CommonJS JavaScript back:

```ts
Babel.transform(code, {
  presets: ['react', 'typescript'],
  plugins: ['transform-modules-commonjs', ...],
})
```

`transform-modules-commonjs` is critical - it rewrites `import`/`export` to `require`/`module.exports`, which you can implement yourself in the browser.

---

## Writing a mini bundler

Once you have CommonJS output, you need a `require` function. I wrote a recursive `evaluateCode(path)` that acts as a tiny bundler at runtime:

```ts
const evaluateCode = (path: string): any => {
  if (moduleCache[path]) return moduleCache[path].exports;

  const code = files[path];
  const customRequire = (requestedPath: string) => {
    if (requestedPath === 'react') return React;
    return evaluateCode(resolvePath(path, requestedPath));
  };

  const transformedCode = Babel.transform(code, { ... }).code;
  const exports = {};
  const module = { exports };

  new Function('require', 'module', 'exports', 'React', transformedCode)
    (customRequire, module, exports, React);

  moduleCache[path] = module;
  return module.exports;
};
```

Modules are cached after first evaluation - same semantics as Node's `require`. When files change, the whole cache is thrown away and rebuilt. It's not incremental, but with a 500 ms debounce and typical component file sizes, it's imperceptible.

### Path Resolution

Users write imports like `@/components/ui/button` or `./chat`. We can resolve these in order:

1. Expand `@/` aliases to `src/`
2. Normalise relative paths against the importing file's directory (handle `..` traversal)
3. Try the path as-is
4. Try appending `.tsx`, `.ts`, `.jsx`, `.js`
5. Try `/index` + each extension

This covers the import patterns you'd write in a real Vite project.

### CSS

When a resolved path ends in `.css`, instead of executing it we inject a `<style>` tag into `document.head`. The style tag carries a `data-path` attribute so it can be cleaned up between renders.

---

## The component inspector

This is the part neat part. Most playground tools treat the preview as a black box - you can see it but not interact with it meaningfully. We wanted hover-to-identify and click-to-edit on every element in the preview.

The trick: since we're already running a Babel transform on user code, we can rewrite the AST before execution. Two plugins handle this.

### Plugin 1: `injectDataId` - Naming DOM nodes

React component names don't survive to the DOM. A `<ChatBubble />` renders as a `<div>` - the name is gone. We can fix this by stamping the root element of each component with `data-id="ComponentName"` at compile time:

```tsx
// user writes
function ChatBubble({ message }) {
  return <div className="bubble">{message}</div>
}

// after injectDataId
function ChatBubble({ message }) {
  return <div className="bubble" data-id="ChatBubble">{message}</div>
}
```

The plugin identifies components by checking if the function/variable name starts with an uppercase letter - the React convention. It walks to the `ReturnStatement` inside that function and stamps the returned JSX element.

Arrow function components with expression bodies (`const Foo = () => <div />`) are handled separately since there's no `ReturnStatement` to walk to.

### Plugin 2: `injectPreview` - Wiring interaction

The second plugin walks every `JSXOpeningElement` with a lowercase tag name (native DOM elements only - we skip custom components to avoid double-handling). For each one it injects three props at the AST level:

```tsx
// user writes
<div className="bubble">

// after injectPreview
<div
  className="bubble"
  onMouseEnter={e => {
    e.currentTarget.classList.add('hover-highlight');
    showTooltip(elementName, e.currentTarget.getBoundingClientRect());
  }}
  onMouseLeave={e => {
    e.currentTarget.classList.remove('hover-highlight');
    hideTooltip();
  }}
  onClick={e => {
    e.stopPropagation();
    selectElement(e.currentTarget);
  }}
>
```

`showTooltip`, `hideTooltip`, and `selectElement` aren't globals on `window` - they're passed as named parameters to the `new Function(...)` call. This keeps them scoped and lets them close over React state in the host component.

The element name shown in the tooltip prefers `data-id` (set by `injectDataId`) over the raw tag name. So hovering the root `<div>` of `ChatBubble` shows `"ChatBubble"`, not `"div"`.

### Click-to-edit

`selectElement` does something simple but satisfying:

```ts
element.setAttribute('contentEditable', 'true');
element.classList.add('selected-element');
element.focus();
```

The clicked element becomes editable in place. No special handling - `contentEditable` is a browser primitive that works on any DOM node. Clicking outside removes it. This gives you live text editing on any rendered element without any React state involved.

---

## The editor

Monaco Editor runs on the left. The important detail is how multi-file editing works: each file gets its own `ITextModel`, identified by a `file:///`-prefixed URI matching the file path. Switching files calls `editor.setModel(model)` - Monaco preserves cursor position, scroll offset, and undo history per model.

Monaco's TypeScript language service needs type definitions to provide IntelliSense. Since we're not loading `node_modules` in the browser, we register a hand-written stub for React via `addExtraLib`. It's minimal - just enough to stop red squiggles and enable basic autocomplete.

---

## Improvements? limitations?

**Incremental compilation.** On every change, the entire module graph is re-evaluated. For a playground with a handful of files this is fine. A smarter system would track which files changed and only re-evaluate their dependents.

**External npm packages.** Users can only import from the virtual file system or React itself. Adding package support would require fetching modules from a CDN (like esm.sh) and integrating them into the resolver - doable, but out of scope.

**Sandboxing.** User code runs directly in the host page. An iframe or WebWorker would isolate it, but adds complexity and breaks the direct DOM access that makes `contentEditable` work so naturally.

These tradeoffs were all deliberate - the goal was to see how much a self-contained, zero-infrastructure playground could do. The answer: quite a lot.

## Source code

Here the full [source code](https://github.com/sammaji/browser-react-preview).

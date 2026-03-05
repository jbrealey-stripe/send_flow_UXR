# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start development server at localhost:5173
npm run build            # Production build to dist/
npm run preview          # Preview production build locally
npm run lint             # ESLint check
npm run create-prototype # Scaffold a new prototype (see below)
```

## Architecture

Stripe-style dashboard shell built with React 19, Vite 7, and Tailwind CSS 4. Supports multiple independent prototypes, each with its own pages, data, control panel, and routing.

### Multi-Prototype Structure

```
src/
  App.jsx                    # Root shell: routes to prototypes, conditionally shows PrototypeList
  PrototypeList.jsx          # Full page listing all prototypes (shown at / when multiple exist)
  contexts/
    BasePath.jsx             # BasePathContext + useBasePath hook (for routing)
  components/                # Shared components
    ControlPanel.jsx         # Exports primitives only (no default export)
    Sidebar.jsx              # Sidebar shell (accepts children) + NavItem/SubNavItem/ExpandableNavItem
    Header.jsx               # Header, SandboxBanner, SANDBOX_HEIGHT, ACCOUNT_NAME
    ...
  prototypes/
    index.js                 # Auto-discovery registry using import.meta.glob
    config.json              # All prototype metadata { id: { name, description, status, default? } }
    prototype1/              # Default prototype (Dashboard Shell)
      App.jsx                # Layout + routes + state (receives basePath prop from root)
      SidebarNav.jsx         # Prototype-specific sidebar navigation content
      HeaderNav.jsx          # Prototype-specific header action buttons
      ControlPanel.jsx       # Prototype-specific controls (uses useNavigate for prototype switching)
      pages/                 # Page components
      data/                  # Data files
scripts/
  create-prototype.js        # Interactive scaffold script
```

Every prototype gets a `/:id/*` route prefix (e.g. `/prototype1/balances`). `/` always renders the `PrototypeList` page. The root `App.jsx` passes `basePath` as a prop to each prototype.

### Creating a New Prototype

**If the user asks to create a new prototype, run `npm run create-prototype`** — do not manually create the files. The script handles ID assignment, directory scaffolding, and config updates. Pass `--name` and `--description` as CLI args (or omit them for interactive prompts).

```bash
npm run create-prototype -- --name "My Prototype" --description "A description"
npm run create-prototype    # Interactive mode: prompts for name + description
```

The script creates the prototype directory (`App.jsx`, `SidebarNav.jsx`, `HeaderNav.jsx`, `ControlPanel.jsx`, `pages/Home.jsx`, `pages/Balances.jsx`) and appends to `src/prototypes/config.json`. IDs are always numeric (`prototype2`, `prototype3`, etc.). No registry modification needed — `import.meta.glob` auto-discovers new directories.

**If the user asks to delete a prototype, delete its `src/prototypes/<id>/` directory AND remove its entry from `src/prototypes/config.json`.** Both steps are required — a stale config entry will cause build errors.

### Layout Structure

The layout uses fixed positioning with a max-width constraint:
- **Sidebar**: 250px fixed left (`w-sidebar-width`), uses `bg-surface`
- **Header**: 60px fixed top, content constrained to `max-w-[1280px]`, uses `bg-surface`
- **Content**: Scrollable area with `max-w-[1280px]` centered

Both header and content share the same max-width so they align visually.

### Key Files

- **`src/App.jsx`**: Root shell — routes each prototype at `/:id/*`, passes `basePath` prop, shows `PrototypeList` at `/` when multiple prototypes exist
- **`src/prototypes/config.json`**: Single config for all prototypes — name, description, status (`active`/`archived`), and `default` flag
- **`src/prototypes/index.js`**: Auto-discovery registry via `import.meta.glob`, reads from shared `config.json`
- **`src/components/Sidebar.jsx`**: Sidebar shell (accepts `children`), NavItem, SubNavItem, SectionHeading, ExpandableNavItem — each prototype defines its own sidebar nav content as children. `NavItem`/`SubNavItem` resolve paths internally via `useBasePath()` (pass relative `to` like `"balances"`, not absolute)
- **`src/components/Header.jsx`**: Header (accepts `children` for per-prototype action buttons), HeaderButton, SandboxBanner, SANDBOX_HEIGHT, ACCOUNT_NAME
- **`src/components/ControlPanel.jsx`**: Shared primitives (`ControlPanelButton`, `ControlPanelHeader`, `ControlPanelBody`, `useDragSnap`, `DropZone`, `MARGIN`, `PANEL_WIDTH`, `InfoBanner`, `ContextDialog`) — no default export
- **`src/contexts/BasePath.jsx`**: `BasePathContext` + `useBasePath()` hook for prototype-aware routing
- **`src/icons/SailIcons.jsx`**: SVG icon system with sizes: xxsmall(12px)/xsmall(14px)/small(16px)/medium(20px)/large(24px)
- **`src/index.css`**: Tailwind CSS 4 `@theme` block with all color tokens + dark mode overrides

### Typography

**Always use the custom `@utility` text styles** defined in `src/index.css` instead of default Tailwind text classes like `text-sm`, `text-xs`, `text-base`, `text-lg`, etc. Never use `font-semibold` or `font-medium` alongside text utilities — use the `-emphasized` or `-subdued` variant instead.

| Category | Utilities |
|----------|-----------|
| Display | `text-display-xlarge`, `text-display-large`, `text-display-medium`, `text-display-small` (+ `-subdued` variants) |
| Heading | `text-heading-xlarge` through `text-heading-xsmall` (+ `-subdued` variants) |
| Body | `text-body-large`, `text-body-medium`, `text-body-small` (+ `-emphasized` variants) |
| Label | `text-label-large`, `text-label-medium`, `text-label-small` (+ `-emphasized` variants) |

### Breakpoints

Custom breakpoints are defined in `src/index.css` — do not use default Tailwind breakpoints (`sm:`, `md:`, `lg:`, etc.).

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `xsmall:` | 0px | Base |
| `small:` | 490px | Small screens |
| `medium:` | 768px | Tablets |
| `large:` | 1040px | Desktops |
| `xlarge:` | 1440px | Wide screens |

### Theming

**Always use semantic color tokens** from `src/index.css` instead of hardcoded values like `gray-500` or `#ccc`. This is critical for dark mode support — hardcoded colors will not adapt.

| Token | Usage |
|-------|-------|
| `bg-surface` | Page background |
| `bg-offset` | Offset sections, hover states |
| `bg-blurple` | Brand purple |
| `text-default` | Primary text |
| `text-subdued` | Secondary text |
| `text-brand` | Brand purple text |
| `border-border` | Standard borders |

Additional tokens exist for buttons (`button-primary-*`, `button-secondary-*`), badges (`badge-success-*`, `badge-warning-*`, etc.), and icons (`icon-default`, `icon-subdued`, `icon-brand`).

### Dark Mode

Dark mode is managed at each prototype's App level via a `darkMode` state boolean. When active, a `dark` CSS class is applied to the root div, which overrides all `--color-*` custom properties in `src/index.css`. The `body:has(.dark)` rule in CSS ensures the body background also updates.

**Never use `bg-white` or other non-token colors** in components — use `bg-surface` instead so dark mode works correctly.

### Prototype Control Panel

`src/components/ControlPanel.jsx` exports shared primitives for building per-prototype control panels:

- **Primitives**: `ControlPanelButton`, `ControlPanelHeader`, `ControlPanelBody`
- **Drag system**: `useDragSnap()`, `DropZone`, `MARGIN`, `PANEL_WIDTH`
- **Sections**: `InfoBanner`, `ContextDialog`

Each prototype has its own `ControlPanel.jsx` that composes these primitives. The panel uses `z-[100]`. The context dialog uses `overlayClassName="z-[101]"` to appear above the panel.

### Component Library

Available components in `src/components/`:
- **Button**: `variant` (primary/secondary/danger), `size` (sm/md/lg), `icon`
- **Badge**: `variant` (default/success/warning/danger/info)
- **Dialog**: `size` (small/medium/large/xlarge/full), `overlayClassName` for z-index control
- **Input, Textarea, Select, Checkbox, Radio**: Form controls with `label`, `description`, `error`, `errorMessage`
- **Switch**: Toggle with `checked`, `onChange`, `label`
- **Table**: `columns` (with `key`, `header`, `render`, `width`), `data`, `onRowClick`, `isLoading`
- **Toggle/ToggleGroup**: Card-style selectors with `selected`, `layout` (vertical/horizontal)
- **Tooltip**: `placement` (top/bottom/left/right), `variant` (default/minimal)

### Adding New Pages

1. Create page file in `src/prototypes/<id>/pages/`
2. Import and add route in `src/prototypes/<id>/App.jsx`
3. Add NavItem/SubNavItem to the prototype's `SidebarNav` component in its `App.jsx` with a relative `to` prop (e.g. `to="balances"`) — the component resolves it to an absolute path internally
4. Import shared components from `../../../components/` and icons from `../../../icons/`

### Routing & BasePath

- The root `App.jsx` passes `basePath` (e.g. `"/prototype1"`) as a prop to each prototype's App component — **do not use `useResolvedPath`** (it has a known bug with splat routes in React Router 7)
- Each prototype's App wraps its content in `<BasePathContext.Provider value={basePath}>`
- `NavItem` and `SubNavItem` call `useBasePath()` internally to build absolute links — callers just pass relative segments like `to="balances"`
- Pages that need absolute paths (breadcrumbs, programmatic navigation) should use `useBasePath()` from `../../../contexts/BasePath`

### Tech Stack

- React 19 with React Router 7
- Vite 7 with `@tailwindcss/postcss` plugin
- Tailwind CSS 4

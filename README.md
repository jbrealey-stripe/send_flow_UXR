# Stripe Dashboard Template

A React dashboard template for prototypes. Built with React 19, Vite 7, and Tailwind CSS 4.

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the dashboard.

## Prototypes

This template supports multiple independent prototypes, each with its own pages, sidebar, data, and control panel.

- The homepage `/` shows a table of all prototypes. Each prototype is accessed by its id: `/prototype1`.
- Create a new prototype by running `npm run create-prototype` in terminal. Enter a name and description and it will scaffold all the necessary files.
- Each prototype lives in `src/prototypes/[id]/`. Edit `src/prototypes/config.json` to update names, descriptions, or status.
- Components in `src/components/` (Button, Badge, Table, etc.) are shared across all prototypes.
- To delete a prototype, remove its folder from `src/prototypes/` and its entry from `config.json`.

## Project Structure

```
src/
├── App.jsx                      # Root shell: routes to prototypes, shows prototype list at /
├── PrototypeList.jsx            # Full page listing all prototypes
├── contexts/
│   └── BasePath.jsx             # BasePathContext + useBasePath hook (for routing)
├── components/                  # Shared components
│   ├── Sidebar.jsx              # Sidebar shell, NavItem, SubNavItem, ExpandableNavItem
│   ├── Header.jsx               # Header, SandboxBanner
│   ├── ControlPanel.jsx         # Control panel primitives (shared)
│   ├── Badge.jsx                # Status badges (default/success/warning/danger/info)
│   ├── Button.jsx               # Buttons (primary/secondary/danger, sm/md/lg)
│   ├── Dialog.jsx               # Modal dialogs (small/medium/large/xlarge/full)
│   ├── Input.jsx                # Input, Select, Textarea, Checkbox, Radio
│   ├── Switch.jsx               # Toggle switches
│   ├── Table.jsx                # Data tables with sorting and row clicks
│   ├── Tabs.jsx                 # Tabbed interfaces (sm/md/lg)
│   ├── Toggle.jsx               # Card-style selectors with ToggleGroup
│   └── Tooltip.jsx              # Hover tooltips (top/bottom/left/right)
├── icons/
│   └── SailIcons.jsx            # SVG icon system
├── prototypes/
│   ├── config.json              # All prototype metadata (name, description, status)
│   ├── index.js                 # Auto-discovery registry using import.meta.glob
│   └── prototype1/              # Each prototype has its own directory
│       ├── App.jsx              # Layout + routes + state
│       ├── SidebarNav.jsx       # Prototype-specific sidebar navigation
│       ├── HeaderNav.jsx        # Prototype-specific header action buttons
│       ├── ControlPanel.jsx     # Prototype-specific controls
│       ├── pages/               # Page components
│       └── data/                # Data files
├── main.jsx                     # Entry point
└── index.css                    # Tailwind theme, color tokens, typography utilities
scripts/
└── create-prototype.js          # Scaffold script for new prototypes
```

## Typography

Use the custom `@utility` text styles defined in `src/index.css` instead of default Tailwind classes like `text-sm` or `text-base`.

| Category | Utilities |
|----------|-----------|
| Display | `text-display-xlarge`, `-large`, `-medium`, `-small` (+ `-subdued` variants) |
| Heading | `text-heading-xlarge`, `-large`, `-medium`, `-small`, `-xsmall` (+ `-subdued` variants) |
| Body | `text-body-large`, `-medium`, `-small` (+ `-emphasized` variants) |
| Label | `text-label-large`, `-medium`, `-small` (+ `-emphasized` variants) |

## Color Tokens

All colors are defined as CSS custom properties in `src/index.css` with automatic dark mode overrides.

| Token | Usage |
|-------|-------|
| `bg-surface` | Page background |
| `bg-offset` | Offset sections, hover states |
| `text-default` | Primary text |
| `text-subdued` | Secondary text |
| `text-brand` | Brand purple text |
| `border-border` | Standard borders |

## Icons

```jsx
import { Icon } from './icons/SailIcons';

<Icon name="home" size="small" fill="currentColor" />
```

Sizes: `xxsmall` (8px), `xsmall` (12px), `small` (16px), `medium` (20px), `large` (32px)

## Scripts

```bash
npm run dev              # Start development server at localhost:5173
npm run build            # Production build to dist/
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run create-prototype # Scaffold a new prototype
```

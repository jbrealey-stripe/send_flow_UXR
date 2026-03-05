import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prototypesDir = path.join(__dirname, '..', 'src', 'prototypes');

function getNextId() {
  const existing = fs.readdirSync(prototypesDir).filter((f) => {
    const full = path.join(prototypesDir, f);
    return fs.statSync(full).isDirectory() && f !== 'node_modules';
  });
  let i = 1;
  while (existing.includes(`prototype${i}`)) i++;
  return `prototype${i}`;
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); resolve(answer); }));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--name' && args[i + 1]) parsed.name = args[++i];
    else if (args[i] === '--description' && args[i + 1]) parsed.description = args[++i];
  }
  return parsed;
}

const cliArgs = parseArgs();
const id = getNextId();

console.log(`\nCreating ${id}...\n`);
const displayName = cliArgs.name || (await prompt(`  Name (${id}): `)).trim() || id;
const description = cliArgs.description ?? (await prompt(`  Description (optional): `)).trim();
console.log('');

const dir = path.join(prototypesDir, id);

if (fs.existsSync(dir)) {
  console.error(`Error: prototype "${id}" already exists at ${dir}`);
  process.exit(1);
}

fs.mkdirSync(path.join(dir, 'pages'), { recursive: true });

// Append to shared config.json
const configPath = path.join(prototypesDir, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
config[id] = { name: displayName, description, status: 'active' };
fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');

// SidebarNav.jsx
fs.writeFileSync(
  path.join(dir, 'SidebarNav.jsx'),
  `import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useBasePath } from '../../contexts/BasePath';
import { NavItem, SubNavItem, SectionHeading, ExpandableNavItem } from '../../components/Sidebar';
import { ACCOUNT_NAME } from '../../components/Header';
import { Icon } from '../../icons/SailIcons';

export default function SidebarNav() {
  const location = useLocation();
  const basePath = useBasePath();
  const [expandedSection, setExpandedSection] = useState('connect');

  const isActive = (path) => location.pathname === (path ? \`\${basePath}/\${path}\` : basePath || '/');

  return (
    <>
      {/* Account Section - Desktop (compact row) */}
      <div className="hidden lg:flex p-1.5 -mx-0.5 rounded-lg items-center border-border hover:bg-offset gap-2 duration-100">
        <img src="/rocketrides.svg" alt={ACCOUNT_NAME} className="size-[24px] rounded" />
        <span className="text-default text-label-medium-emphasized">
          {ACCOUNT_NAME}
        </span>
      </div>

      {/* Account Section - Mobile (centered) */}
      <div className="flex lg:hidden flex-col items-center gap-2 pt-2 pb-8 border-b border-border">
        <img src="/rocketrides.svg" alt={ACCOUNT_NAME} className="size-[40px] rounded-lg" />
        <span className="text-default text-heading-small">{ACCOUNT_NAME}</span>
      </div>

      {/* Main Navigation */}
      <div className="">
        <NavItem icon={<Icon name="home" size="small" fill="currentColor" />} label="Home" to="" active={isActive('')} />
        <NavItem icon={<Icon name="balance" size="small" fill="currentColor" />} label="Balances" to="balances" active={isActive('balances')} />
        <NavItem icon={<Icon name="arrowsLoop" size="small" fill="currentColor" />} label="Transactions" />
        <NavItem icon={<Icon name="person" size="small" fill="currentColor" />} label="Directory" />
        <NavItem icon={<Icon name="product" size="small" fill="currentColor" />} label="Product catalog" />
      </div>

      {/* Products */}
      <div className="space-y-2">
        <SectionHeading label="Products" />
        <div className="">
          <ExpandableNavItem
            icon={<Icon name="platform" size="small" fill="currentColor" />}
            label="Connect"
            sectionId="connect"
            expandedSection={expandedSection}
            onToggle={setExpandedSection}
          >
            <SubNavItem label="Overview" />
            <SubNavItem label="Connected accounts" />
            <SubNavItem label="Capital" />
          </ExpandableNavItem>
          <ExpandableNavItem
            icon={<Icon name="wallet" size="small" fill="currentColor" />}
            label="Payments"
            sectionId="payments"
            expandedSection={expandedSection}
            onToggle={setExpandedSection}
          >
            <SubNavItem label="Analytics" />
            <SubNavItem label="Disputes" />
            <SubNavItem label="Radar" />
            <SubNavItem label="Payment Links" />
            <SubNavItem label="Terminal" />
          </ExpandableNavItem>
          <ExpandableNavItem
            icon={<Icon name="invoice" size="small" fill="currentColor" />}
            label="Billing"
            sectionId="billing"
            expandedSection={expandedSection}
            onToggle={setExpandedSection}
          >
            <SubNavItem label="Overview" />
            <SubNavItem label="Subscriptions" />
            <SubNavItem label="Invoices" />
            <SubNavItem label="Usage-based" />
            <SubNavItem label="Revenue recovery" />
          </ExpandableNavItem>
          <ExpandableNavItem
            icon={<Icon name="barChart" size="small" fill="currentColor" />}
            label="Reporting"
            sectionId="reporting"
            expandedSection={expandedSection}
            onToggle={setExpandedSection}
          >
            <SubNavItem label="Reports" />
            <SubNavItem label="Sigma" />
            <SubNavItem label="Revenue Recognition" />
            <SubNavItem label="Data management" />
          </ExpandableNavItem>
          <NavItem icon={<Icon name="more" size="small" fill="currentColor" />} label="More" />
        </div>
      </div>
    </>
  );
}
`
);

// HeaderNav.jsx
fs.writeFileSync(
  path.join(dir, 'HeaderNav.jsx'),
  `import { HeaderButton } from '../../components/Header';
import { Icon } from '../../icons/SailIcons';
import { DiamondAppIcon, BoatAppIcon, ZapAppIcon } from '../../icons/AppIcons';

export default function HeaderNav() {
  return (
    <div className="flex items-center">
      {/* App Dock - desktop only */}
      <div className="hidden lg:flex items-center gap-0.5 px-px py-px border border-neutral-50 rounded-full mr-4">
        <HeaderButton>
          <DiamondAppIcon />
        </HeaderButton>
        <HeaderButton>
          <BoatAppIcon />
        </HeaderButton>
        <HeaderButton>
          <ZapAppIcon />
        </HeaderButton>
        <HeaderButton className="text-icon-default">
          <Icon name="apps" size="small" />
        </HeaderButton>
      </div>

      <div className="flex items-center space-x-3 lg:space-x-1.5">
        <HeaderButton className="lg:hidden">
          <Icon name="apps" className="size-[20px]" />
        </HeaderButton>
        <HeaderButton className="hidden lg:flex">
          <Icon name="help" className="size-[16px]" />
        </HeaderButton>
        <HeaderButton>
          <Icon name="notifications" className="size-[20px] lg:size-[16px]" />
        </HeaderButton>
        <HeaderButton>
          <Icon name="settings" className="size-[20px] lg:size-[16px]" />
        </HeaderButton>
        <HeaderButton className="hidden lg:flex">
          <Icon name="addCircleFilled" className="text-brand-500 lg:size-[20px]" />
        </HeaderButton>
      </div>
    </div>
  );
}
`
);

// App.jsx
fs.writeFileSync(
  path.join(dir, 'App.jsx'),
  `import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BasePathContext } from '../../contexts/BasePath';
import { Sidebar } from '../../components/Sidebar';
import { Header, SandboxBanner, SANDBOX_HEIGHT } from '../../components/Header';
import ControlPanel from './ControlPanel';
import SidebarNav from './SidebarNav';
import HeaderNav from './HeaderNav';
import Home from './pages/Home';
import Balances from './pages/Balances';

export default function ${toPascal(id)}App({ basePath = '' }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    return () => document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <BasePathContext.Provider value={basePath}>
      <div className="min-h-screen bg-surface">
        <ControlPanel
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          sandboxMode={sandboxMode}
          onToggleSandboxMode={() => setSandboxMode(!sandboxMode)}
        />

        <div className="flex flex-col min-h-screen">
          <div className="flex flex-row flex-1 bg-surface">
            {sandboxMode && <SandboxBanner />}
            <Sidebar sandboxMode={sandboxMode} mobileMenuOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
              <SidebarNav />
            </Sidebar>
            <Header sandboxMode={sandboxMode} onMenuToggle={() => setMobileMenuOpen(o => !o)}>
              <HeaderNav />
            </Header>

            <div className="ml-0 lg:ml-sidebar-width flex flex-col min-w-0 flex-1 relative" style={{ paddingTop: 60 + (sandboxMode ? SANDBOX_HEIGHT : 0), '--header-offset': \`\${60 + (sandboxMode ? SANDBOX_HEIGHT : 0)}px\` }}>
              <div className="max-w-[1280px] w-full mx-auto">
                <Routes>
                  <Route path="" element={<Home />} />
                  <Route path="balances" element={<Balances />} />
                  <Route path="*" element={<Navigate to={basePath || "/"} replace />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BasePathContext.Provider>
  );
}
`
);

// ControlPanel.jsx
fs.writeFileSync(
  path.join(dir, 'ControlPanel.jsx'),
  `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ControlPanelButton,
  ControlPanelHeader,
  ControlPanelBody,
  MARGIN,
  PANEL_WIDTH,
  DropZone,
  useDragSnap,
  InfoBanner,
  ContextDialog,
} from '../../components/ControlPanel';
import Switch from '../../components/Switch';
import prototypes from '../index';

export default function ControlPanel({ darkMode, onToggleDarkMode, sandboxMode, onToggleSandboxMode }) {
  const navigate = useNavigate();
  const [minimized, setMinimized] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const { side, dragging, settling, settlePos, dragPos, snapTarget, panelRef, onPointerDown, didDrag } = useDragSnap();

  let style;
  if (dragging && dragPos) {
    style = { left: dragPos.left, right: 'auto', bottom: dragPos.bottom, transition: 'none' };
  } else if (settling && settlePos) {
    style = { left: settlePos.left, right: 'auto', bottom: settlePos.bottom, transition: 'left 0.25s ease, bottom 0.25s ease' };
  } else {
    style = side === 'right'
      ? { right: MARGIN, left: 'auto', bottom: MARGIN }
      : { left: MARGIN, right: 'auto', bottom: MARGIN };
  }

  return (
    <>
      {dragging && didDrag.current && (
        <DropZone snapSide={snapTarget} panelRef={panelRef} />
      )}

      <div
        ref={panelRef}
        onPointerDown={onPointerDown}
        className={\`fixed z-[100] bg-surface rounded-lg shadow-lg overflow-hidden border border-border select-none \${dragging ? 'cursor-grabbing' : ''}\`}
        style={{ ...style, width: PANEL_WIDTH }}
      >
        <ControlPanelHeader
          minimized={minimized}
          onToggle={() => { if (!didDrag.current) setMinimized(!minimized); }}
        />
        <ControlPanelBody minimized={minimized}>
          <InfoBanner />
          <Switch
            checked={darkMode}
            onChange={onToggleDarkMode}
            label="Dark mode"
            className="w-full"
          />
          <Switch
            checked={sandboxMode}
            onChange={onToggleSandboxMode}
            label="Sandbox mode"
            className="w-full"
          />
          <ControlPanelButton onClick={() => setContextOpen(true)}>
            Show context
          </ControlPanelButton>
          {prototypes.length > 1 && (
            <ControlPanelButton onClick={() => navigate('/')}>
              View all prototypes
            </ControlPanelButton>
          )}
        </ControlPanelBody>
      </div>

      <ContextDialog open={contextOpen} onClose={() => setContextOpen(false)}>
        {/* Add your prototype context here */}
      </ContextDialog>
    </>
  );
}
`
);

// pages/Home.jsx
fs.writeFileSync(
  path.join(dir, 'pages', 'Home.jsx'),
  `export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-heading-xlarge text-default mb-2">${displayName}</h1>
      <p className="text-subdued">Edit <code className="text-monospace-small bg-offset px-2 py-1 rounded">src/prototypes/${id}/pages/Home.jsx</code> to get started.</p>
    </div>
  );
}
`
);

// pages/Balances.jsx
fs.writeFileSync(
  path.join(dir, 'pages', 'Balances.jsx'),
  `export default function Balances() {
  return (
    <div className="p-8">
      <h1 className="text-heading-xlarge text-default mb-2">Balances</h1>
      <p className="text-subdued">Edit <code className="text-monospace-small bg-offset px-2 py-1 rounded">src/prototypes/${id}/pages/Balances.jsx</code> to edit this page.</p>
    </div>
  );
}
`
);

console.log(`\n✅ Created prototype "${displayName}" (${id})\n`);
console.log(`Files created:`);
console.log(`  src/prototypes/${id}/App.jsx`);
console.log(`  src/prototypes/${id}/SidebarNav.jsx`);
console.log(`  src/prototypes/${id}/HeaderNav.jsx`);
console.log(`  src/prototypes/${id}/ControlPanel.jsx`);
console.log(`  src/prototypes/${id}/pages/Home.jsx`);
console.log(`  src/prototypes/${id}/pages/Balances.jsx`);
console.log(`  src/prototypes/config.json (updated)\n`);
console.log(`Next steps:`);
console.log(`  1. Navigate to /${id} in your dev server`);
console.log(`  2. Edit src/prototypes/${id}/pages/ to build your pages`);
console.log(`  3. Add routes in src/prototypes/${id}/App.jsx`);
console.log(`  4. Update name/description in src/prototypes/config.json`);
console.log(`  5. To remove: delete src/prototypes/${id}/ and its entry in config.json\n`);

function toPascal(str) {
  return str
    .split(/[-_]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

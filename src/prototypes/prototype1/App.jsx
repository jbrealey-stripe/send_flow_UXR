import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BasePathContext } from '../../contexts/BasePath';
import { Sidebar } from '../../components/Sidebar';
import { Header, SandboxBanner, SANDBOX_HEIGHT } from '../../components/Header';
import { PayoutsProvider } from './PayoutsContext';
import ControlPanel from './ControlPanel';
import SidebarNav from './SidebarNav';
import HeaderNav from './HeaderNav';

// Pages
import Home from './pages/Home';
import Balances from './pages/Balances';
import ConnectOverview from './pages/ConnectOverview';
import ConnectedAccounts from './pages/ConnectedAccounts';
import ConnectedAccountDetail from './pages/ConnectedAccountDetail';
import Settings from './pages/Settings';
import Transactions from './pages/Transactions';
import PaymentDetail from './pages/PaymentDetail';
import PayoutDetail from './pages/PayoutDetail';
import FinancialPayoutDetail from './pages/FinancialPayoutDetail';
import FinancialAccount from './pages/FinancialAccount';
import GlobalPayouts from './pages/GlobalPayouts';
import RecipientDetail from './pages/RecipientDetail';
import Customers from './pages/Customers';

export default function Prototype1App({ basePath = '', variant = 'existing-user' }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    return () => document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <BasePathContext.Provider value={basePath}>
      <PayoutsProvider variant={variant}>
      <div className="min-h-screen bg-surface">
        {/* <ControlPanel
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          sandboxMode={sandboxMode}
          onToggleSandboxMode={() => setSandboxMode(!sandboxMode)}
        /> */}

        <div className="flex flex-col min-h-screen">
          <div className="flex flex-row flex-1 bg-surface">
            {/* Sandbox Banner */}
            {sandboxMode && <SandboxBanner />}

            {/* Sidebar */}
            <Sidebar sandboxMode={sandboxMode} mobileMenuOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
              <SidebarNav />
            </Sidebar>

            {/* Header - fixed */}
            <Header sandboxMode={sandboxMode} onMenuToggle={() => setMobileMenuOpen(o => !o)}>
              <HeaderNav />
            </Header>

            {/* Main Content Area - offset for fixed sidebar and header */}
            <div className="ml-0 lg:ml-sidebar-width flex flex-col min-w-0 flex-1 relative" style={{ paddingTop: 60 + (sandboxMode ? SANDBOX_HEIGHT : 0), '--header-offset': `${60 + (sandboxMode ? SANDBOX_HEIGHT : 0)}px` }}>
              <div className="max-w-[1280px] w-full mx-auto">

                {/* Content */}
                <Routes>
                  <Route path="" element={<Home />} />
                  <Route path="balances" element={<Balances />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="transactions/:paymentId" element={<PaymentDetail />} />
                  <Route path="payouts/:payoutId" element={<PayoutDetail />} />
                  <Route path="financial-payouts/:payoutId" element={<FinancialPayoutDetail />} />
                  <Route path="financial-account" element={<FinancialAccount />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="global-payouts" element={<GlobalPayouts />} />
                  <Route path="recipients/:recipientId" element={<RecipientDetail />} />
                  <Route path="connect" element={<ConnectOverview />} />
                  <Route path="connect/accounts" element={<ConnectedAccounts />} />
                  <Route path="connect/accounts/:accountId/*" element={<ConnectedAccountDetail />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to={basePath || "/"} replace />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayoutsProvider>
    </BasePathContext.Provider>
  );
}

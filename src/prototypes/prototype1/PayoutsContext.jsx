import { createContext, useContext, useState, useCallback } from 'react';

const PayoutsContext = createContext(null);

export function PayoutsProvider({ children, variant = 'existing-user' }) {
  const [payouts, setPayouts] = useState([]);
  const [userRecipients, setUserRecipients] = useState([]);

  const addPayout = useCallback((payout) => {
    setPayouts((prev) => [payout, ...prev]);
  }, []);

  const addRecipient = useCallback((recipient) => {
    setUserRecipients((prev) => {
      if (prev.some((r) => r.email === recipient.email)) return prev;
      return [recipient, ...prev];
    });
  }, []);

  return (
    <PayoutsContext.Provider value={{ payouts, addPayout, userRecipients, addRecipient, variant }}>
      {children}
    </PayoutsContext.Provider>
  );
}

export function usePayouts() {
  const ctx = useContext(PayoutsContext);
  if (!ctx) throw new Error('usePayouts must be used within PayoutsProvider');
  return ctx;
}

function formatCreatedDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' });
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day} ${month}, ${hours}:${minutes}`;
}

function formatAmount(num) {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// For Balances > Financial account tab (matches financialActivity from Transactions.jsx)
export function toFinancialActivityItem(p) {
  const fee = p.fee || 4.50;
  const total = p.amount + fee;
  return {
    amount: `-US$${formatAmount(p.amount)}`,
    status: null,
    fees: `-US$${formatAmount(fee)}`,
    total: `-US$${formatAmount(total)}`,
    type: 'Payout',
    from: 'Financial account',
    to: p.recipientEmail,
    created: formatCreatedDate(p.initiatesOn || new Date()),
    description: p.statementDescriptor || '—',
    id: p.id,
  };
}

// For FinancialAccount > Recent activity (matches activityByCurrency items)
export function toFAActivityItem(p) {
  const fee = p.fee || 4.50;
  const total = p.amount + fee;
  return {
    amount: `-US$${formatAmount(p.amount)}`,
    fees: `-$${formatAmount(fee)}`,
    total: `-US$${formatAmount(total)}`,
    type: 'Send',
    from: 'Financial account',
    to: p.recipientEmail,
    created: formatCreatedDate(p.initiatesOn || new Date()),
    id: p.id,
  };
}

// For GlobalPayouts > Payouts to recipients (matches recipientPayouts items)
export function toRecipientPayoutItem(p) {
  return {
    amount: `US$${formatAmount(p.amount)}`,
    status: 'Initiated',
    statusVariant: 'info',
    email: p.recipientEmail,
    description: p.statementDescriptor || '—',
    created: formatCreatedDate(p.initiatesOn || new Date()),
    id: p.id,
  };
}

// Build a full recipient shape from SendModal state fields
const networkNames = {
  arbitrum: 'Arbitrum', avalanche: 'Avalanche C-Chain', base: 'Base',
  ethereum: 'Ethereum', optimism: 'Optimism', polygon: 'Polygon',
  noble: 'Noble', solana: 'Solana', stellar: 'Stellar',
};

export function toRecipientFromModal({
  email, country, businessType, legalFirstName, legalLastName, businessName,
  method, routingNumber, accountNumber, walletAddress, selectedNetwork,
}) {
  const now = new Date();
  const created = formatCreatedDate(now);
  const id = `acct_${Date.now().toString(36)}`;
  const isCompany = businessType === 'company';
  const name = isCompany ? (businessName || '—') : `${legalFirstName} ${legalLastName}`.trim() || '—';
  const last4 = method === 'stablecoin'
    ? (walletAddress || '').slice(-4) || 'XXXX'
    : (accountNumber || '').slice(-4) || '0000';

  const isEmail = method === 'email';
  const isStablecoin = method === 'stablecoin';

  const destination = isEmail
    ? { label: 'Pending recipient setup', currency: 'USD', id: `usba_pending_${id}`, bankName: '—', routingNumber: '—', countryCode: country || 'US', last4: '—' }
    : isStablecoin
      ? { label: `Crypto Wallet  ····  ${last4}`, currency: 'USDC', id: `usba_crypto_${id}`, bankName: networkNames[selectedNetwork] || 'Base', routingNumber: '—', countryCode: country || 'US', last4 }
      : { label: `Bank Account  ····  ${last4}`, currency: 'USD', id: `usba_${id}`, bankName: '—', routingNumber: routingNumber || '—', countryCode: country || 'US', last4 };

  const countryMap = {
    US: 'United States', GB: 'United Kingdom', EU: 'European Union', CA: 'Canada',
    AU: 'Australia', JP: 'Japan', IN: 'India', MX: 'Mexico', BR: 'Brazil',
    SG: 'Singapore', HK: 'Hong Kong', CH: 'Switzerland', SE: 'Sweden',
    NZ: 'New Zealand', KR: 'South Korea', PH: 'Philippines',
  };

  return {
    email,
    needsAction: isEmail,
    name,
    id,
    accountId: id,
    created,
    phone: '—',
    country: countryMap[country] || country || 'United States',
    recipientType: isCompany ? 'Company' : 'Individual',
    legalFirstName: isCompany ? '—' : (legalFirstName || '—'),
    legalLastName: isCompany ? '—' : (legalLastName || '—'),
    address: ['—'],
    destination,
    transactions: [],
    payoutMethods: [
      { name: 'ACH', enabled: method === 'ach' },
      { name: 'Wire', enabled: method === 'wire' },
      { name: 'Instant-to-card', enabled: false },
      { name: 'Stablecoin', enabled: method === 'stablecoin' },
    ],
  };
}

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasePath } from '../../../contexts/BasePath';
import { Icon } from '../../../icons/SailIcons';
import SendModal from '../components/SendModal';
import { usePayouts, toFAActivityItem } from '../PayoutsContext';

const currencyTabs = ['USD', 'EUR', 'GBP', 'USDC'];

const currencyInfo = {
  USD: { flag: '🇺🇸', symbol: '$', prefix: 'US$', balance: '224,857.99' },
  EUR: { flag: '🇪🇺', symbol: '€', prefix: 'EU€', balance: '84.82' },
  GBP: { flag: '🇬🇧', symbol: '£', prefix: 'GB£', balance: '73.17' },
  USDC: { flag: '🪙', symbol: '$', prefix: 'US$', balance: '24,883.00' },
};

const activityByCurrency = {
  USD: [
    { amount: '-US$15,000.00', fees: '-$4.50', total: '-US$15,004.50', type: 'Send', from: 'Financial account', to: 'ap@meridiangroup.com', created: '28 Feb, 09:00' },
    { amount: '-US$6,800.00', fees: '-$4.50', total: '-US$6,804.50', type: 'Send', from: 'Financial account', to: 'james.wilson@hey.com', created: '27 Feb, 14:22' },
    { amount: '-US$1.00', fees: '-$4.50', total: '-US$5.50', type: 'Send', from: 'Financial account', to: 'joshua.brealey@stripe.com', created: '26 Feb, 10:56' },
    { amount: '-US$2,500.00', fees: '-$4.50', total: '-US$2,504.50', type: 'Send', from: 'Financial account', to: 'maria.garcia@acmecorp.com', created: '26 Feb, 08:30' },
    { amount: '+US$50,000.00', fees: '$0.00', total: '+US$50,000.00', type: 'Transfer', from: 'Payments balance', to: 'Financial account', created: '25 Feb, 12:00' },
    { amount: '-US$1.00', fees: '-$4.50', total: '-US$5.50', type: 'Send', from: 'Financial account', to: 'joshua.brealey@stripe.com', created: '25 Feb, 09:52' },
    { amount: '-US$22,000.00', fees: '-$4.50', total: '-US$22,004.50', type: 'Send', from: 'Financial account', to: 'billing@scalefast.io', created: '24 Feb, 11:00' },
    { amount: '-US$950.00', fees: '-$4.50', total: '-US$954.50', type: 'Send', from: 'Financial account', to: 'raj.kumar@freelance.in', created: '23 Feb, 16:00' },
    { amount: '-US$8,400.00', fees: '-$4.50', total: '-US$8,404.50', type: 'Send', from: 'Financial account', to: 'chen.wei@globaltrade.cn', created: '21 Feb, 09:15' },
    { amount: '-£500.00', fees: '-£3.80', total: '-£503.80', type: 'Send', from: 'Financial account', to: 'samuel.okafor@gmail.com', created: '20 Feb, 08:15' },
    { amount: '-US$12,500.00', fees: '-$4.50', total: '-US$12,504.50', type: 'Send', from: 'Financial account', to: 'finance@buildright.io', created: '18 Feb, 16:30' },
    { amount: '-US$3,200.00', fees: '-$4.50', total: '-US$3,204.50', type: 'Send', from: 'Financial account', to: 'tanaka.yuki@fastmail.jp', created: '17 Feb, 11:00' },
    { amount: '-US$750.00', fees: '-$4.50', total: '-US$754.50', type: 'Send', from: 'Financial account', to: 'priya.patel@outlook.com', created: '16 Feb, 22:10' },
    { amount: '-US$399.00', fees: '-$4.50', total: '-US$403.50', type: 'Send', from: 'Financial account', to: 'hello@craftshop.com', created: '14 Feb, 18:07' },
    { amount: '+US$100,000.00', fees: '$0.00', total: '+US$100,000.00', type: 'Transfer', from: 'Payments balance', to: 'Financial account', created: '12 Feb, 08:00' },
  ],
  EUR: [
    { amount: '-€4,200.00', fees: '-€3.80', total: '-€4,203.80', type: 'Send', from: 'Financial account', to: 'anna.mueller@designlab.de', created: '25 Feb, 16:45' },
    { amount: '-€3,750.00', fees: '-€3.80', total: '-€3,753.80', type: 'Send', from: 'Financial account', to: 'marie.laurent@startup.fr', created: '19 Feb, 14:37' },
    { amount: '+€8,038.62', fees: '€0.00', total: '+€8,038.62', type: 'Convert', from: 'USD balance', to: 'EUR balance', created: '15 Feb, 10:00' },
  ],
  GBP: [
    { amount: '-£1,200.00', fees: '-£3.20', total: '-£1,203.20', type: 'Send', from: 'Financial account', to: 'emma.johnson@techstart.io', created: '22 Feb, 14:20' },
    { amount: '+£1,276.37', fees: '£0.00', total: '+£1,276.37', type: 'Convert', from: 'USD balance', to: 'GBP balance', created: '18 Feb, 09:00' },
  ],
  USDC: [
    { amount: '-USDC 5,000.00', fees: '-$1.00', total: '-USDC 5,001.00', type: 'Send', from: 'Financial account', to: 'crypto@walletco.com', created: '15 Feb, 03:12' },
    { amount: '+USDC 30,000.00', fees: '$0.00', total: '+USDC 30,000.00', type: 'Convert', from: 'USD balance', to: 'USDC balance', created: '10 Feb, 14:30' },
  ],
};

const accountDetails = [
  { code: 'USD', flag: '🇺🇸', routingNumber: '00000000', accountNumber: 'N/A', bankName: 'N/A' },
  { code: 'EUR', flag: '🇪🇺', routingNumber: null, accountNumber: null, bankName: null },
  { code: 'GBP', flag: '🇬🇧', routingNumber: null, accountNumber: null, bankName: null },
  { code: 'USDC', flag: '🪙', routingNumber: null, accountNumber: null, bankName: null },
];

const resources = [
  { name: 'Manage cards', icon: 'card' },
  { name: 'Manage recipients', icon: 'person' },
  { name: 'Manage accounting integration', icon: 'apps' },
  { name: 'Balance summary report', icon: 'document' },
  { name: 'Financial account report', icon: 'bank' },
];

const bankAccounts = [
  { id: 'ba_1', name: 'Test Bank', last4: '6789', pending: false },
  { id: 'ba_2', name: 'Test (Non-OAuth)', last4: '6789', pending: false },
  { id: 'ba_3', name: 'STRIPE TEST BANK', last4: '6789', pending: false },
];

export default function FinancialAccount() {
  const [activeCurrency, setActiveCurrency] = useState('USD');
  const [expandedAccount, setExpandedAccount] = useState('USD');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showTransferMenu, setShowTransferMenu] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('0');
  const [payoutCurrency, setPayoutCurrency] = useState('USD');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [payoutStep, setPayoutStep] = useState('form');
  const transferMenuRef = useRef(null);
  const navigate = useNavigate();
  const basePath = useBasePath();

  const { payouts: userPayouts, addPayout, addRecipient, variant } = usePayouts();
  const isNewUser = variant === 'new-user';
  const currency = currencyInfo[activeCurrency];
  const userActivity = userPayouts
    .filter((p) => (p.currency || 'USD') === activeCurrency)
    .map(toFAActivityItem);
  const activity = [...userActivity, ...(isNewUser ? [] : (activityByCurrency[activeCurrency] || []))];

  // Close transfer menu when clicking outside
  useEffect(() => {
    if (!showTransferMenu) return;
    function handleClick(e) {
      if (transferMenuRef.current && !transferMenuRef.current.contains(e.target)) {
        setShowTransferMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showTransferMenu]);

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-label-medium text-brand mb-3">
        <button onClick={() => navigate(`${basePath}/balances`)} className="hover:underline cursor-pointer">Balances</button>
        <Icon name="chevronRight" size="xsmall" fill="currentColor" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-display-small text-default">Financial account</h1>
        <button className="flex items-center justify-center w-8 h-8 border border-border rounded-lg text-default hover:bg-offset transition-colors cursor-pointer">
          <Icon name="more" size="small" fill="currentColor" />
        </button>
      </div>

      {/* Currency tabs */}
      <div className="flex gap-4 mb-5 border-b border-border">
        {currencyTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveCurrency(tab)}
            className={`pb-3 text-label-medium cursor-pointer ${
              activeCurrency === tab
                ? 'text-brand text-label-medium-emphasized border-b-2 border-brand'
                : 'text-subdued hover:text-default'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 mb-6">
        <div className="relative" ref={transferMenuRef}>
          <button onClick={() => setShowTransferMenu(!showTransferMenu)} className="flex items-center gap-2 px-4 py-2 bg-offset rounded-full text-default hover:bg-offset-hover transition-colors cursor-pointer">
            <Icon name="transfer" size="small" fill="currentColor" />
            <span className="text-label-medium-emphasized">Transfer</span>
          </button>
          {showTransferMenu && (
            <>
            <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setShowTransferMenu(false)} />
            <div className="absolute top-full left-0 mt-1 w-[280px] bg-surface border border-border rounded-lg shadow-lg z-50 py-1">
              <button
                onClick={() => { setShowTransferMenu(false); setShowPayoutModal(true); setPayoutAmount('0'); setPayoutCurrency('USD'); setShowFromDropdown(false); setShowToDropdown(false); setSelectedDestination(null); setPayoutStep('form'); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-offset transition-colors cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-offset flex items-center justify-center shrink-0">
                  <Icon name="external" size="small" fill="currentColor" className="text-icon-subdued" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-default">Pay out to external account</p>
                  <p className="text-[12px] text-subdued">Send funds to a bank account</p>
                </div>
              </button>
              <button
                onClick={() => setShowTransferMenu(false)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-offset transition-colors cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-offset flex items-center justify-center shrink-0">
                  <Icon name="transfer" size="small" fill="currentColor" className="text-icon-subdued" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-default">Transfer between balances</p>
                  <p className="text-[12px] text-subdued">Move funds within your account</p>
                </div>
              </button>
            </div>
            </>
          )}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-offset rounded-full text-default hover:bg-offset-hover transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <clipPath id="globe-clip-fa"><circle cx="8" cy="8" r="6.5" /></clipPath>
            <circle cx="8" cy="8" r="6.5" />
            <g clipPath="url(#globe-clip-fa)">
              <ellipse cx="8" cy="8" rx="3" ry="6.5" />
              <line x1="1.5" y1="5" x2="14.5" y2="5" />
              <line x1="1.5" y1="11" x2="14.5" y2="11" />
            </g>
          </svg>
          <span className="text-label-medium-emphasized">Convert</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-offset rounded-full text-default hover:bg-offset-hover transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3.5" width="11" height="8" rx="1.5" />
            <circle cx="6.5" cy="7.5" r="1.8" />
            <line x1="3" y1="3.5" x2="3" y2="5" />
            <line x1="10" y1="10" x2="10" y2="11.5" />
            <line x1="13" y1="2" x2="13" y2="6" />
            <line x1="11" y1="4" x2="15" y2="4" />
          </svg>
          <span className="text-label-medium-emphasized">Add funds</span>
        </button>
        <button onClick={() => setShowSendModal(true)} className="flex items-center gap-2 px-4 py-2 bg-offset rounded-full text-default hover:bg-offset-hover transition-colors cursor-pointer">
          <Icon name="send" size="small" fill="currentColor" />
          <span className="text-label-medium-emphasized">Send</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-offset rounded-full text-default hover:bg-offset-hover transition-colors cursor-pointer">
          <Icon name="card" size="small" fill="currentColor" />
          <span className="text-label-medium-emphasized">Create card</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-offset rounded-full text-default hover:bg-offset-hover transition-colors cursor-pointer">
          <Icon name="chat" size="small" fill="currentColor" />
          <span className="text-label-medium-emphasized">Feedback</span>
        </button>
      </div>

      {/* Currency card */}
      <div className="border border-border rounded-lg px-5 py-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-label-small text-subdued">Currency</span>
          <span className="text-label-small text-subdued">Amount</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[18px]">{currency.flag}</span>
            <span className="text-label-medium-emphasized text-default">{activeCurrency}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="lock" size="xsmall" fill="currentColor" className="text-icon-subdued" />
            <span className="text-label-medium-emphasized text-default">{currency.symbol}{currency.balance}</span>
          </div>
        </div>
      </div>

      {/* Links row */}
      <div className="flex items-center gap-6 mb-8">
        <span className="text-body-small text-default">
          Recurring transfers{' '}
          <button className="text-brand hover:underline cursor-pointer">Off</button>
        </span>
        <button className="text-body-small text-brand hover:underline cursor-pointer">
          Connect bank account or wallet
        </button>
      </div>

      {/* Two column layout */}
      <div className="flex gap-10">
        {/* Left column */}
        <div className="flex-1 min-w-0">
          <h2 className="text-heading-medium text-default mb-5">Recent activity</h2>
          {activity.length > 0 ? (
            <>
              <table className="w-full table-fixed">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '16%' }}>Amount</th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '10%' }}>
                      <span className="flex items-center gap-1">Fees <Icon name="info" size="xsmall" fill="currentColor" className="text-icon-subdued" /></span>
                    </th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '16%' }}>Total</th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '8%' }}>Type</th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '18%' }}>From</th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4">To</th>
                    <th className="pb-3 text-label-small text-subdued font-normal text-right" style={{ width: '12%' }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((item, index) => (
                    <tr key={index} onClick={() => navigate(`${basePath}/financial-payouts/${item.id || `obp_${activeCurrency}_${index}`}`)} className="border-b border-border hover:bg-offset transition-colors cursor-pointer h-10">
                      <td className="pr-4 text-label-medium-emphasized text-default whitespace-nowrap">{item.amount}</td>
                      <td className="pr-4 text-body-small text-subdued">{item.fees}</td>
                      <td className="pr-4 text-body-small text-default whitespace-nowrap">{item.total}</td>
                      <td className="pr-4 text-body-small text-default">{item.type}</td>
                      <td className="pr-4 text-body-small text-default overflow-hidden text-ellipsis whitespace-nowrap">{item.from}</td>
                      <td className="pr-4 text-body-small text-default overflow-hidden text-ellipsis whitespace-nowrap">{item.to}</td>
                      <td className="text-body-small text-subdued text-right whitespace-nowrap">{item.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="mt-4 text-label-medium-emphasized text-brand hover:underline cursor-pointer">
                View more
              </button>
            </>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center gap-1">
              <span className="text-body-small text-subdued">No recent activity for {activeCurrency}.</span>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="w-[240px] shrink-0">
          {/* Account details */}
          <div className="mb-8">
            <h2 className="text-heading-medium text-default mb-4">Account details</h2>
            <div className="space-y-0">
              {accountDetails.map((account) => (
                <div key={account.code}>
                  {/* Account header row */}
                  <button
                    onClick={() => setExpandedAccount(expandedAccount === account.code ? null : account.code)}
                    className="w-full flex items-center justify-between py-2.5 cursor-pointer hover:text-default transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        name={expandedAccount === account.code ? 'chevronDown' : 'chevronRight'}
                        size="xsmall"
                        fill="currentColor"
                        className="text-icon-subdued"
                      />
                      <span className="text-[16px]">{account.flag}</span>
                      <span className="text-label-medium-emphasized text-default">{account.code}</span>
                    </div>
                    <span className="text-label-small text-brand cursor-pointer hover:underline">Copy</span>
                  </button>

                  {/* Expanded details */}
                  {expandedAccount === account.code && account.routingNumber !== null && (
                    <div className="ml-[28px] pb-3 space-y-2.5">
                      <div>
                        <span className="text-label-small text-subdued">Routing number</span>
                        <p className="text-body-small text-default flex items-center gap-1.5">
                          <Icon name="lock" size="xsmall" fill="currentColor" className="text-icon-subdued" />
                          {account.routingNumber}
                        </p>
                      </div>
                      <div>
                        <span className="text-label-small text-subdued">Account number</span>
                        <p className="text-body-small text-default flex items-center gap-1.5">
                          {account.accountNumber}
                          {account.accountNumber === 'N/A' && <Icon name="lock" size="xsmall" fill="currentColor" className="text-icon-subdued" />}
                        </p>
                      </div>
                      <div>
                        <span className="text-label-small text-subdued">Bank name</span>
                        <p className="text-body-small text-default flex items-center gap-1.5">
                          {account.bankName}
                          {account.bankName === 'N/A' && <Icon name="lock" size="xsmall" fill="currentColor" className="text-icon-subdued" />}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="mb-8">
            <h2 className="text-heading-medium text-default mb-3">Cards</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-1">
              <span className="text-body-small text-subdued">No cards created.</span>
              <button className="text-body-small text-brand hover:underline cursor-pointer">Create your first card</button>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-heading-medium text-default mb-4">Resources</h2>
            <div className="space-y-1">
              {resources.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className="flex items-center gap-3 py-2 text-body-small text-subdued hover:text-default transition-colors"
                >
                  <Icon name={item.icon} size="small" fill="currentColor" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pay out to external account modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPayoutModal(false)} />
          {/* Modal */}
          <div className="relative bg-surface rounded-xl shadow-xl w-[480px] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-offset flex items-center justify-center">
                  <Icon name="external" size="small" fill="currentColor" className="text-icon-subdued" />
                </div>
                <h2 className="text-[14px] font-semibold text-default">Pay out to external account</h2>
              </div>
              <button onClick={() => setShowPayoutModal(false)} className="text-icon-subdued hover:text-default cursor-pointer">
                <Icon name="close" size="small" fill="currentColor" />
              </button>
            </div>

            {payoutStep === 'form' ? (
              <>
                {/* Amount input */}
                <div className="flex items-center justify-center mb-8">
                  <span className="text-[16px] font-normal text-subdued mr-0.5">{currencyInfo[payoutCurrency].symbol}</span>
                  <input
                    type="text"
                    value={payoutAmount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      setPayoutAmount(val);
                    }}
                    onFocus={() => { if (payoutAmount === '0') setPayoutAmount(''); }}
                    onBlur={() => { if (payoutAmount === '') setPayoutAmount('0'); }}
                    className="text-display-large text-default bg-transparent outline-none text-center"
                    style={{ caretColor: 'var(--color-text-subdued)', width: `${Math.max(1, payoutAmount.length)}ch` }}
                  />
                  <span className="text-[16px] font-normal text-subdued ml-2">{payoutCurrency}</span>
                </div>

                {/* From */}
                <div className="mb-5 relative">
                  <label className="text-label-small-emphasized text-default mb-2 block">From</label>
                  <div
                    onClick={() => setShowFromDropdown(!showFromDropdown)}
                    className="border border-border rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-offset transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#f0eef8] flex items-center justify-center">
                        <span className="text-[18px]">{currencyInfo[payoutCurrency].flag}</span>
                      </div>
                      <div>
                        <p className="text-label-small-emphasized text-default">{payoutCurrency}</p>
                        <p className="text-body-small text-subdued">Financial account</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-label-medium-emphasized text-default">{currencyInfo[payoutCurrency].symbol}{currencyInfo[payoutCurrency].balance}</span>
                      <Icon name="chevronDown" size="xsmall" fill="currentColor" className="text-icon-subdued" />
                    </div>
                  </div>
                  {showFromDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg z-10 py-1">
                      {currencyTabs.map((code) => (
                        <button
                          key={code}
                          onClick={() => { setPayoutCurrency(code); setShowFromDropdown(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 hover:bg-offset transition-colors cursor-pointer text-left ${code === payoutCurrency ? 'bg-offset' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#f0eef8] flex items-center justify-center">
                              <span className="text-[18px]">{currencyInfo[code].flag}</span>
                            </div>
                            <div>
                              <p className="text-label-small-emphasized text-default">{code}</p>
                              <p className="text-body-small text-subdued">Financial account</p>
                            </div>
                          </div>
                          <span className="text-label-medium-emphasized text-default">{currencyInfo[code].symbol}{currencyInfo[code].balance}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* To */}
                <div className="mb-8 relative">
                  <label className="text-label-small-emphasized text-default mb-2 block">To</label>
                  <div
                    onClick={() => { setShowToDropdown(!showToDropdown); setShowFromDropdown(false); }}
                    className="border border-border rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-offset transition-colors"
                  >
                    {selectedDestination ? (
                      <div className="flex items-center gap-3">
                        <Icon name="bank" size="small" fill="currentColor" className="text-icon-subdued" />
                        <span className="text-label-small-emphasized text-default">{selectedDestination.name} ····{selectedDestination.last4}</span>
                      </div>
                    ) : (
                      <span className="text-body-small text-subdued">Select...</span>
                    )}
                    <Icon name="chevronDown" size="xsmall" fill="currentColor" className="text-icon-subdued" />
                  </div>
                  {showToDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg z-10 py-1">
                      <p className="px-4 pt-3 pb-2 text-label-small-emphasized text-default">Bank accounts</p>
                      {bankAccounts.map((account) => (
                        <button
                          key={account.id}
                          onClick={() => { setSelectedDestination(account); setShowToDropdown(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-offset transition-colors cursor-pointer text-left ${selectedDestination?.id === account.id ? 'bg-offset' : ''}`}
                        >
                          <div className="w-9 h-9 rounded-lg bg-offset flex items-center justify-center shrink-0">
                            <Icon name="bank" size="small" fill="currentColor" className="text-icon-subdued" />
                          </div>
                          <div>
                            <p className="text-label-small-emphasized text-default">{account.name} ····{account.last4}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t border-border pt-4">
                  <button
                    onClick={() => setShowPayoutModal(false)}
                    className="px-4 py-2 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setPayoutStep('review')}
                    disabled={!payoutAmount || payoutAmount === '0'}
                    className={`px-4 py-2 rounded-lg text-label-small-emphasized transition-opacity ${!payoutAmount || payoutAmount === '0' ? 'bg-button-primary-bg/40 text-button-primary-text/40 cursor-not-allowed' : 'bg-button-primary-bg text-button-primary-text hover:opacity-90 cursor-pointer'}`}
                  >
                    Review
                  </button>
                </div>
              </>
            ) : payoutStep === 'review' ? (
              <>
                {/* Review step */}
                <div className="mb-6">
                  <h3 className="text-display-medium text-default">{currencyInfo[payoutCurrency].prefix}{payoutAmount || '0'}.00</h3>
                  <p className="text-body-small text-subdued mt-1">to {selectedDestination ? `${selectedDestination.name} ····${selectedDestination.last4}` : '—'}</p>
                </div>

                <div className="border border-border rounded-lg p-5 space-y-5 mb-8">
                  <div>
                    <p className="text-body-small text-subdued mb-1">From</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-button-primary-bg flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-white rounded-sm" />
                      </div>
                      <span className="text-label-small-emphasized text-default">Financial account – {payoutCurrency}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-body-small text-subdued mb-1">To</p>
                    <div className="flex items-center gap-2">
                      <Icon name="bank" size="small" fill="currentColor" className="text-icon-subdued" />
                      <span className="text-label-small-emphasized text-default">{selectedDestination ? `${selectedDestination.name} ····${selectedDestination.last4}` : '—'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-body-small text-subdued mb-1">Initiated on</p>
                    <p className="text-label-small-emphasized text-default">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-body-small text-subdued mb-1">Estimated arrival</p>
                    <p className="text-label-small-emphasized text-default">1-3 working days</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t border-border pt-4">
                  <button
                    onClick={() => setPayoutStep('form')}
                    className="px-4 py-2 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setPayoutStep('success')}
                    className="px-4 py-2 bg-button-primary-bg text-button-primary-text rounded-lg text-label-small-emphasized hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Transfer {currencyInfo[payoutCurrency].prefix}{payoutAmount || '0'}.00
                  </button>
                </div>
              </>
            ) : payoutStep === 'success' ? (
              <>
                {/* Success step */}
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#d4f5d4] flex items-center justify-center mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12L10 17L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-display-small text-default mb-2">{currencyInfo[payoutCurrency].prefix}{payoutAmount || '0'}.00 is on the way to {selectedDestination ? `${selectedDestination.name} ····${selectedDestination.last4}` : '—'}</h3>
                  <p className="text-body-small text-subdued">We estimate that this transfer will arrive by {new Date(Date.now() + 2 * 86400000).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}.</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-8">
                  <button className="text-label-small-emphasized text-[#dc2626] hover:underline cursor-pointer">
                    Cancel transfer
                  </button>
                  <button
                    onClick={() => setShowPayoutModal(false)}
                    className="px-4 py-2 bg-button-primary-bg text-button-primary-text rounded-lg text-label-small-emphasized hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      <SendModal
        open={showSendModal}
        onClose={() => setShowSendModal(false)}
        onPayoutCreated={(payout) => addPayout(payout)}
        onRecipientCreated={(r) => addRecipient(r)}
      />
    </div>
  );
}

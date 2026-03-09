import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasePath } from '../../../contexts/BasePath';
import { Icon } from '../../../icons/SailIcons';
import Badge from '../../../components/Badge';
import SendModal from '../components/SendModal';
import { payouts, financialActivity } from './Transactions';
import { usePayouts, toFinancialActivityItem } from '../PayoutsContext';

const upcoming = [
  { month: 'SEP', day: '29', amount: '$29,953.65', description: 'Incoming → Payments balance' },
  { month: 'SEP', day: '30', amount: '$44,792.05', description: 'Payments balance → External bank...' },
];

const balanceCurrencies = [
  { code: 'USD', flag: '🇺🇸', symbol: '$', prefix: 'US$', balance: '224,857.99' },
  { code: 'EUR', flag: '🇪🇺', symbol: '€', prefix: 'EU€', balance: '84.82' },
  { code: 'GBP', flag: '🇬🇧', symbol: '£', prefix: 'GB£', balance: '73.17' },
  { code: 'USDC', flag: '🪙', symbol: '$', prefix: 'US$', balance: '24,883.00' },
];

const balanceCurrencyMap = Object.fromEntries(balanceCurrencies.map((c) => [c.code, c]));

const bankAccounts = [
  { id: 'ba_1', name: 'Test Bank', last4: '6789', pending: false },
  { id: 'ba_2', name: 'Test (Non-OAuth)', last4: '6789', pending: false },
  { id: 'ba_3', name: 'STRIPE TEST BANK', last4: '6789', pending: false },
];

const resources = [
  { name: 'Manage cards', icon: 'card' },
  { name: 'Manage recipients', icon: 'person' },
  { name: 'Manage accounting integration', icon: 'apps' },
  { name: 'Balance summary report', icon: 'document' },
  { name: 'Financial account report', icon: 'bank' },
];

function TransferModal({ open, onClose, onPayOut }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[50] bg-overlay-backdrop animate-[fadeIn_0.15s_ease-out]" onClick={onClose} />
      <div className="fixed inset-0 z-[51] flex items-center justify-center" onClick={onClose}>
        <div className="bg-surface rounded-xl shadow-xl w-[380px] h-[210px] p-4 animate-[scaleIn_0.15s_ease-out]" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-3">
              <Icon name="transfer" size="small" fill="currentColor" className="text-default" />
              <h2 className="text-[14px] font-semibold text-default">Transfer</h2>
            </div>
            <button onClick={onClose} className="text-icon-subdued hover:text-default cursor-pointer p-1">
              <Icon name="close" size="small" fill="currentColor" />
            </button>
          </div>
          <p className="text-[12px] text-subdued mb-4 ml-[28px]">Transfer or convert funds.</p>

          {/* Options */}
          <div className="space-y-1">
            <button onClick={() => { onClose(); onPayOut(); }} className="w-full flex items-center gap-3 py-2.5 rounded-lg hover:bg-offset transition-colors cursor-pointer text-left">
              <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                <Icon name="bank" size="xsmall" fill="currentColor" className="text-brand" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-medium text-default">Pay out to external account</div>
                <div className="text-[12px] text-subdued">Funds arrive in 1-3 working days</div>
              </div>
              <Icon name="chevronRight" size="small" fill="currentColor" className="text-icon-subdued" />
            </button>

            <button className="w-full flex items-center gap-3 py-2.5 rounded-lg hover:bg-offset transition-colors cursor-pointer text-left">
              <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                <Icon name="transfer" size="xsmall" fill="currentColor" className="text-brand" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-medium text-default">Transfer between Stripe balances</div>
                <div className="text-[12px] text-subdued">Funds arrive instantly</div>
              </div>
              <Icon name="chevronRight" size="small" fill="currentColor" className="text-icon-subdued" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Balances() {
  const [showSendModal, setShowSendModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('0');
  const [payoutCurrency, setPayoutCurrency] = useState('USD');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [payoutStep, setPayoutStep] = useState('form');
  const [activeRecentTab, setActiveRecentTab] = useState('financial');
  const navigate = useNavigate();
  const basePath = useBasePath();
  const { payouts: userPayouts, addPayout, addRecipient, variant } = usePayouts();
  const isNewUser = variant === 'new-user';
  const allFinancialActivity = [...userPayouts.map(toFinancialActivityItem), ...(isNewUser ? [] : financialActivity)];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-display-small text-default">Balances</h1>
        <span className="text-display-small-subdued text-subdued">$245,452.20</span>
        <Icon name="info" size="small" fill="currentColor" className="text-icon-subdued" />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 mb-6">
        <button onClick={() => setShowTransferModal(true)} className="flex items-center gap-2 px-4 py-2 bg-offset rounded-full text-default hover:bg-offset-hover transition-colors cursor-pointer">
          <Icon name="transfer" size="small" fill="currentColor" />
          <span className="text-label-medium-emphasized">Transfer</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-offset rounded-full text-default hover:bg-offset-hover transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <clipPath id="globe-clip"><circle cx="8" cy="8" r="6.5" /></clipPath>
            <circle cx="8" cy="8" r="6.5" />
            <g clipPath="url(#globe-clip)">
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
      </div>

      {/* Balance cards */}
      <div className="rounded-xl p-3 mb-8" style={{ backgroundImage: 'url(/gradient.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="flex gap-3">
          {/* Payments balance card */}
          <div className="w-[230px] h-[250px] bg-surface rounded-lg p-5 shadow-md flex flex-col">
            <div className="text-label-medium text-subdued mb-1">Payments balance</div>
            <div className="text-heading-xlarge text-default mb-1 font-normal">$20,594.21</div>
            <div className="text-body-small text-subdued">$18,661.51 incoming</div>
            <div className="flex gap-3 mt-auto text-icon-subdued">
              <Icon name="lightningBolt" size="small" fill="currentColor" />
              <Icon name="transfer" size="small" fill="currentColor" />
              <Icon name="bank" size="small" fill="currentColor" />
            </div>
          </div>
          {/* Financial account card */}
          <div onClick={() => navigate(`${basePath}/financial-account`)} className="w-[230px] h-[250px] bg-surface/90 rounded-lg p-5 shadow-md flex flex-col cursor-pointer hover:bg-surface transition-colors">
            <div className="text-label-medium text-subdued mb-1">Financial account</div>
            <div className="text-heading-xlarge text-default mb-1 font-normal">$224,857.99</div>
            <div className="flex gap-3 mt-auto text-icon-subdued">
              <Icon name="transfer" size="small" fill="currentColor" />
              <Icon name="send" size="small" fill="currentColor" />
              <Icon name="card" size="small" fill="currentColor" />
            </div>
          </div>
        </div>
      </div>

      {/* Content row with Recent activity and sidebar */}
      <div className="flex gap-8">
        {/* Recent activity */}
        <div className="flex-1">
          <h2 className="text-heading-large text-default mb-4">Recent activity</h2>

          {/* Tabs */}
          <div className="flex gap-6 mb-4 border-b border-border">
            <button
              onClick={() => setActiveRecentTab('payouts')}
              className={`pb-3 text-label-medium cursor-pointer ${activeRecentTab === 'payouts' ? 'text-brand text-label-medium-emphasized border-b-2 border-brand' : 'text-subdued hover:text-default'}`}
            >
              Payouts to bank
            </button>
            <button
              onClick={() => setActiveRecentTab('financial')}
              className={`pb-3 text-label-medium cursor-pointer ${activeRecentTab === 'financial' ? 'text-brand text-label-medium-emphasized border-b-2 border-brand' : 'text-subdued hover:text-default'}`}
            >
              Financial account
            </button>
          </div>

          {/* Payouts to bank table */}
          {activeRecentTab === 'payouts' && (
            <>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-subdued">
                    <th className="pb-3 text-label-medium" style={{ width: '30%' }}>Amount</th>
                    <th className="pb-3 text-label-medium">Destination</th>
                    <th className="pb-3 text-label-medium text-right" style={{ width: '14%' }}>Arrive by</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.slice(0, 5).map((payout, index) => (
                    <tr key={index} onClick={() => navigate(`${basePath}/payouts/po_${index}`)} className="border-t border-border hover:bg-offset transition-colors cursor-pointer">
                      <td className="py-2 whitespace-nowrap">
                        <span className="text-label-medium-emphasized text-default">{payout.amount}</span>
                        <Badge variant={payout.statusVariant} className="ml-2">{payout.status}</Badge>
                      </td>
                      <td className="py-2 text-body-small text-subdued">
                        Payments balance <span className="text-muted">→</span> {payout.destination}
                      </td>
                      <td className="py-3 text-body-small text-subdued text-right">{payout.arriveBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => navigate(`${basePath}/transactions`)} className="mt-4 text-label-medium-emphasized text-brand hover:underline cursor-pointer">
                View more
              </button>
            </>
          )}

          {/* Financial account table */}
          {activeRecentTab === 'financial' && (
            <>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-subdued">
                    <th className="pb-3 text-label-medium" style={{ width: '18%' }}>Amount</th>
                    <th className="pb-3 text-label-medium" style={{ width: '10%' }}>Type</th>
                    <th className="pb-3 text-label-medium">From</th>
                    <th className="pb-3 text-label-medium">To</th>
                    <th className="pb-3 text-label-medium text-right" style={{ width: '14%' }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {allFinancialActivity.slice(0, 5).map((item, index) => (
                    <tr key={index} onClick={() => navigate(`${basePath}/financial-payouts/${item.id || `obp_${index}`}`)} className="border-t border-border hover:bg-offset transition-colors cursor-pointer">
                      <td className="py-2 whitespace-nowrap">
                        <span className="text-label-medium-emphasized text-default">{item.amount}</span>
                        {item.status && <Badge variant={item.status === 'Failed' ? 'danger' : 'warning'} className="ml-2">{item.status}</Badge>}
                      </td>
                      <td className="py-2 text-body-small text-default">{item.type}</td>
                      <td className="py-2 text-body-small text-subdued overflow-hidden text-ellipsis whitespace-nowrap">{item.from}</td>
                      <td className="py-2 text-body-small text-subdued overflow-hidden text-ellipsis whitespace-nowrap">{item.to}</td>
                      <td className="py-3 text-body-small text-subdued text-right">{item.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => navigate(`${basePath}/financial-account`)} className="mt-4 text-label-medium-emphasized text-brand hover:underline cursor-pointer">
                View more
              </button>
            </>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-72">
          {/* Resources */}
          <div>
            <h2 className="text-heading-large text-default mb-4">Resources</h2>
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

      <SendModal
        open={showSendModal}
        onClose={() => setShowSendModal(false)}
        onPayoutCreated={(payout) => addPayout(payout)}
        onRecipientCreated={(r) => addRecipient(r)}
      />

      <TransferModal
        open={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onPayOut={() => { setShowPayoutModal(true); setPayoutAmount('0'); setPayoutCurrency('USD'); setShowFromDropdown(false); setShowToDropdown(false); setSelectedDestination(null); setPayoutStep('form'); }}
      />

      {/* Pay out to external account modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPayoutModal(false)} />
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
                  <span className="text-[16px] font-normal text-subdued mr-0.5">{balanceCurrencyMap[payoutCurrency].symbol}</span>
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
                        <span className="text-[18px]">{balanceCurrencyMap[payoutCurrency].flag}</span>
                      </div>
                      <div>
                        <p className="text-label-small-emphasized text-default">{payoutCurrency}</p>
                        <p className="text-body-small text-subdued">Financial account</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-label-medium-emphasized text-default">{balanceCurrencyMap[payoutCurrency].symbol}{balanceCurrencyMap[payoutCurrency].balance}</span>
                      <Icon name="chevronDown" size="xsmall" fill="currentColor" className="text-icon-subdued" />
                    </div>
                  </div>
                  {showFromDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg z-10 py-1">
                      {balanceCurrencies.map((cur) => (
                        <button
                          key={cur.code}
                          onClick={() => { setPayoutCurrency(cur.code); setShowFromDropdown(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 hover:bg-offset transition-colors cursor-pointer text-left ${cur.code === payoutCurrency ? 'bg-offset' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#f0eef8] flex items-center justify-center">
                              <span className="text-[18px]">{cur.flag}</span>
                            </div>
                            <div>
                              <p className="text-label-small-emphasized text-default">{cur.code}</p>
                              <p className="text-body-small text-subdued">Financial account</p>
                            </div>
                          </div>
                          <span className="text-label-medium-emphasized text-default">{cur.symbol}{cur.balance}</span>
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
                  <h3 className="text-display-medium text-default">{balanceCurrencyMap[payoutCurrency].prefix}{payoutAmount || '0'}.00</h3>
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
                    Transfer {balanceCurrencyMap[payoutCurrency].prefix}{payoutAmount || '0'}.00
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
                  <h3 className="text-display-small text-default mb-2">{balanceCurrencyMap[payoutCurrency].prefix}{payoutAmount || '0'}.00 is on the way to {selectedDestination ? `${selectedDestination.name} ····${selectedDestination.last4}` : '—'}</h3>
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
    </div>
  );
}

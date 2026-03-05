import { useParams, useNavigate } from 'react-router-dom';
import { useBasePath } from '../../../contexts/BasePath';
import { Icon } from '../../../icons/SailIcons';
import Badge from '../../../components/Badge';

const paymentData = {
  id: 'pi_3T0tIhCj5atLEhZq1jLUlIXh',
  amount: 'US$1,000.00',
  currency: 'USD',
  status: 'Succeeded',
  statusVariant: 'success',
  chargedTo: 'gcus_1T0tJvCj5atLEhZqrwb0Q23u',
  description: 'fsd',
  statementDescriptor: 'CATHERINE CACTUSES SAN',
  fundsAvailable: '15 Feb, 00:35',
  lastUpdated: '15 Feb, 00:35',
  riskScore: 0,
  riskLevel: 'Normal',
  source: 'Manually entered from Dashboard',
  paymentMethod: {
    brand: 'visa',
    last4: '0077',
    methodId: 'pm_1T0tIhCj5atLEhZqlalWr2IB2',
    fingerprint: 'ZFJlIAzQW07BWll',
    expires: '09 / 2029',
    type: 'Visa credit card',
    issuer: 'Stripe Test (multi-country)',
    postalCode: '99999',
    origin: 'United States',
    cvcCheck: 'Passed',
    zipCheck: 'Passed',
  },
  breakdown: {
    amount: 'US$1,000.00 USD',
    fees: '- US$34.30 USD',
    net: 'US$965.70 USD',
  },
  timeline: [
    { event: 'Payment succeeded', date: '15 Feb 2026, 00:35', icon: 'success' },
    { event: 'Payment started', date: '15 Feb 2026, 00:35', icon: 'started' },
  ],
  customer: {
    id: 'gcus_1T0tJvCj5atLEhZqrwb0Q23u',
    name: '-',
    email: '-',
    phone: '-',
    type: 'Guest',
  },
};

function CopyButton({ text }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="text-icon-subdued hover:text-default cursor-pointer ml-1 inline-flex items-center"
    >
      <Icon name="clipboard" size="xsmall" fill="currentColor" />
    </button>
  );
}

export default function PaymentDetail() {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const basePath = useBasePath();
  const payment = paymentData;

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate(`${basePath}/transactions`)}
        className="flex items-center gap-1 text-label-medium text-brand hover:underline cursor-pointer mb-3"
      >
        Transactions
        <Icon name="chevronRight" size="xsmall" fill="currentColor" />
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-display-small text-default">{payment.amount}</h1>
            <span className="text-display-small text-subdued">{payment.currency}</span>
            <Badge variant={payment.statusVariant}>
              <span className="flex items-center gap-1">
                {payment.status}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Badge>
          </div>
          <p className="text-body-small text-subdued">Charged to {payment.chargedTo}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-default hover:bg-offset transition-colors cursor-pointer">
            <Icon name="refund" size="xsmall" fill="currentColor" />
            <span className="text-label-small-emphasized">Refund</span>
          </button>
          <button className="flex items-center justify-center w-8 h-8 border border-border rounded-lg text-default hover:bg-offset transition-colors cursor-pointer">
            <Icon name="more" size="small" fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Two column layout */}
      <div className="flex gap-10 mt-8">
        {/* Left column */}
        <div className="flex-1 min-w-0">
          {/* Recent activity */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-medium text-default">Recent activity</h2>
              <button className="flex items-center gap-1.5 text-label-small-emphasized text-subdued hover:text-default cursor-pointer">
                <Icon name="add" size="xsmall" fill="currentColor" />
                Add note
              </button>
            </div>
            <div className="relative">
              {payment.timeline.map((item, index) => (
                <div key={index} className="flex gap-3 relative">
                  {/* Timeline line */}
                  {index < payment.timeline.length - 1 && (
                    <div className="absolute left-[9px] top-[22px] w-[2px] h-[calc(100%-2px)] bg-border" />
                  )}
                  {/* Icon */}
                  <div className="relative z-10 mt-0.5 shrink-0">
                    {item.icon === 'success' ? (
                      <div className="w-[20px] h-[20px] rounded-full bg-badge-success-bg border border-badge-success-border flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4.5 7.5L8.5 3" stroke="var(--color-badge-success-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-[20px] h-[20px] rounded-full bg-offset border border-border flex items-center justify-center">
                        <div className="w-[6px] h-[6px] rounded-full bg-icon-subdued" />
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-5">
                    <p className="text-label-small-emphasized text-default">{item.event}</p>
                    <p className="text-body-small text-subdued">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment breakdown */}
          <div className="mb-8">
            <h2 className="text-heading-medium text-default mb-4">Payment breakdown</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-body-small text-default">Payment amount</span>
                <span className="text-body-small text-default">{payment.breakdown.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-default">
                  Stripe processing fees{' '}
                  <button className="text-brand text-body-small hover:underline cursor-pointer">Learn more</button>
                </span>
                <span className="text-body-small text-default">{payment.breakdown.fees}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-label-small-emphasized text-default">Net amount</span>
                  <span className="text-label-small-emphasized text-default">{payment.breakdown.net}</span>
                </div>
              </div>
              <div className="h-[3px] rounded-full bg-gradient-to-r from-brand via-[#a855f7] to-[#ec4899]" />
            </div>
          </div>

          {/* Payment method */}
          <div className="mb-8">
            <h2 className="text-heading-medium text-default mb-4">Payment method</h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-3">
              {/* Left */}
              <div className="space-y-3">
                <div>
                  <span className="text-label-small text-subdued">ID</span>
                  <p className="text-body-small text-default break-all">{payment.paymentMethod.methodId}</p>
                </div>
                <div>
                  <span className="text-label-small text-subdued">Number</span>
                  <p className="text-body-small text-default">•••• {payment.paymentMethod.last4}</p>
                </div>
                <div>
                  <span className="text-label-small text-subdued">Fingerprint</span>
                  <p className="text-body-small text-brand">{payment.paymentMethod.fingerprint}</p>
                </div>
                <div>
                  <span className="text-label-small text-subdued">Expires</span>
                  <p className="text-body-small text-default">{payment.paymentMethod.expires}</p>
                </div>
                <div>
                  <span className="text-label-small text-subdued">Type</span>
                  <p className="text-body-small text-default">{payment.paymentMethod.type}</p>
                </div>
                <div>
                  <span className="text-label-small text-subdued">Issuer</span>
                  <p className="text-body-small text-default">{payment.paymentMethod.issuer}</p>
                </div>
              </div>
              {/* Right */}
              <div className="space-y-3">
                <div>
                  <span className="text-label-small text-subdued">Postal code</span>
                  <p className="text-body-small text-default">{payment.paymentMethod.postalCode}</p>
                </div>
                <div>
                  <span className="text-label-small text-subdued">Origin</span>
                  <p className="text-body-small text-default flex items-center gap-1.5">{payment.paymentMethod.origin} <span>🇺🇸</span></p>
                </div>
                <div>
                  <span className="text-label-small text-subdued">CVC check</span>
                  <p className="text-body-small text-default flex items-center gap-1.5">
                    {payment.paymentMethod.cvcCheck}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7L6 10L11 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </p>
                </div>
                <div>
                  <span className="text-label-small text-subdued">Zip check</span>
                  <p className="text-body-small text-default flex items-center gap-1.5">
                    {payment.paymentMethod.zipCheck}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7L6 10L11 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Allowed payment methods */}
          <div className="mb-8">
            <div className="flex items-center gap-1.5 mb-4">
              <h2 className="text-heading-medium text-default">Allowed payment methods</h2>
              <Icon name="info" size="xsmall" fill="currentColor" className="text-icon-subdued" />
            </div>
            <p className="text-body-small text-default">Card</p>
          </div>
        </div>

        {/* Right column — Details sidebar */}
        <div className="w-[240px] shrink-0">
          <h2 className="text-heading-medium text-default mb-4">Details</h2>
          <div className="space-y-4">
            {/* Payment ID */}
            <div>
              <span className="text-label-small text-subdued">Payment ID</span>
              <p className="text-body-small text-default break-all flex items-start gap-0.5">
                {payment.id}
                <CopyButton text={payment.id} />
              </p>
            </div>

            {/* Payment method */}
            <div>
              <span className="text-label-small text-subdued">Payment method</span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-8 h-5 bg-[#1A1F71] rounded flex items-center justify-center shrink-0">
                  <span className="text-white text-[7px] font-bold italic">VISA</span>
                </div>
                <span className="text-body-small text-default">•••• {payment.paymentMethod.last4}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="text-label-small text-subdued">Description</span>
              <p className="text-body-small text-default flex items-center gap-1.5">
                {payment.description}
                <button className="text-brand text-body-small hover:underline cursor-pointer flex items-center gap-0.5">
                  Edit <Icon name="edit" size="xsmall" fill="currentColor" />
                </button>
              </p>
            </div>

            {/* Statement descriptor */}
            <div>
              <span className="text-label-small text-subdued">Statement descriptor</span>
              <p className="text-body-small text-default">{payment.statementDescriptor}</p>
            </div>

            {/* Funds available */}
            <div>
              <span className="text-label-small text-subdued">Date funds will be available in Stripe Balance</span>
              <p className="text-body-small text-default">{payment.fundsAvailable}</p>
              <button className="text-brand text-body-small hover:underline cursor-pointer">View payout</button>
            </div>

            {/* Last updated */}
            <div>
              <span className="text-label-small text-subdued">Last updated</span>
              <p className="text-body-small text-default">{payment.lastUpdated}</p>
            </div>

            {/* Risk evaluation */}
            <div>
              <span className="text-label-small text-subdued">Risk evaluation</span>
              <p className="text-body-small text-default flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-badge-success-text shrink-0" />
                {payment.riskScore} {payment.riskLevel}
              </p>
            </div>

            {/* Source */}
            <div>
              <span className="text-label-small text-subdued">Source</span>
              <p className="text-body-small text-default">{payment.source}</p>
            </div>

            {/* Customer */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-heading-small text-default">Customer</h3>
                <Badge>{payment.customer.type}</Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-label-small text-subdued">ID</span>
                  <p className="text-body-small text-brand break-all">{payment.customer.id}</p>
                </div>
                <div>
                  <span className="text-label-small text-subdued">Name</span>
                  <p className="text-body-small text-default">{payment.customer.name}</p>
                </div>
                <div>
                  <span className="text-label-small text-subdued">Email address</span>
                  <p className="text-body-small text-default">{payment.customer.email}</p>
                </div>
                <div>
                  <span className="text-label-small text-subdued">Phone number</span>
                  <p className="text-body-small text-default">{payment.customer.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

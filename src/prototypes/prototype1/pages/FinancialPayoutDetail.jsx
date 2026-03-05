import { useParams, useNavigate } from 'react-router-dom';
import { useBasePath } from '../../../contexts/BasePath';
import { Icon } from '../../../icons/SailIcons';
import Badge from '../../../components/Badge';
import { usePayouts } from '../PayoutsContext';

const financialPayoutData = {
  id: 'obp_test_65U1RQg4MLQ',
  idFull: 'obp_test_65UawLqJ8x1RQg4MLQ',
  amount: 'US$1.00',
  currency: 'USD',
  status: 'Posted',
  payoutTo: 'jbrealey@stripe.com',
  traceId: '4jgIX3jisE5xwHwrDzY=',
  from: 'Financial account',
  to: 'Test Bank  ····6789',
  payoutMethod: 'ACH',
  statementDescriptor: 'Catherine Cactuses san',
  internalNote: '—',
  expectedDelivery: '2 Mar 2026',
  total: {
    payoutAmount: 'US$1.00',
    total: 'US$1.00',
  },
  timeline: [
    { event: 'Payout initiated to', recipient: 'jbrealey@stripe.com', date: '2 Mar, 09:19' },
    { event: 'Payout posted', recipient: null, date: '2 Mar, 09:19' },
  ],
};

function formatAmount(num) {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' });
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day} ${month}, ${hours}:${minutes}`;
}

function formatExpectedDelivery(date) {
  const d = date instanceof Date ? date : new Date(date);
  const delivery = new Date(d.getTime() + 2 * 86400000);
  return delivery.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function userPayoutToDetail(p) {
  const fee = p.fee || 4.50;
  const total = p.amount + fee;
  const created = formatDate(p.initiatesOn || new Date());
  const methodMap = { email: 'Email', ach: 'ACH', wire: 'Wire', 'instant-to-card': 'Instant to card', stablecoin: 'Stablecoin' };
  return {
    id: p.id,
    idFull: p.id,
    amount: `US$${formatAmount(p.amount)}`,
    currency: p.currency || 'USD',
    status: 'Initiated',
    statusVariant: 'info',
    payoutTo: p.recipientEmail,
    traceId: '—',
    from: 'Financial account',
    to: p.recipientEmail,
    payoutMethod: methodMap[p.method] || p.method || 'ACH',
    statementDescriptor: p.statementDescriptor || '—',
    internalNote: p.internalNote || '—',
    expectedDelivery: formatExpectedDelivery(p.initiatesOn || new Date()),
    total: {
      payoutAmount: `US$${formatAmount(p.amount)}`,
      fee: `US$${formatAmount(fee)}`,
      total: `US$${formatAmount(total)}`,
    },
    timeline: [
      { event: 'Payout initiated to', recipient: p.recipientEmail, date: created },
    ],
  };
}

export default function FinancialPayoutDetail() {
  const { payoutId } = useParams();
  const navigate = useNavigate();
  const basePath = useBasePath();
  const { payouts: userPayouts } = usePayouts();

  const userPayout = userPayouts.find((p) => p.id === payoutId);
  const payout = userPayout ? userPayoutToDetail(userPayout) : financialPayoutData;
  const badgeVariant = payout.statusVariant || (payout.status === 'Posted' ? 'success' : payout.status === 'Failed' ? 'danger' : 'info');

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-label-medium text-brand mb-3">
        <button onClick={() => navigate(`${basePath}/balances`)} className="hover:underline cursor-pointer">Balances</button>
        <Icon name="chevronRight" size="xsmall" fill="currentColor" />
        <button onClick={() => navigate(`${basePath}/transactions`)} className="hover:underline cursor-pointer">Financial account</button>
        <Icon name="chevronRight" size="xsmall" fill="currentColor" />
      </div>

      {/* Header */}
      <div className="mb-1">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-display-small text-default">{payout.amount}</h1>
          <Badge variant={badgeVariant}>{payout.status}</Badge>
        </div>
        <p className="text-body-small text-subdued">
          Payout to <button className="text-brand hover:underline cursor-pointer">{payout.payoutTo}</button>
        </p>
      </div>

      {/* Two column layout */}
      <div className="flex gap-10 mt-8">
        {/* Left column */}
        <div className="flex-1 min-w-0">
          {/* Total */}
          <div className="mb-10">
            <h2 className="text-heading-medium text-default mb-1">Total</h2>
            <p className="text-body-small text-subdued mb-5">Fees will post up to 24 hours after a transaction is initiated.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-body-small text-default">Payout amount</span>
                <span className="text-body-small text-default">{payout.total.payoutAmount}</span>
              </div>
              {payout.total.fee && (
                <div className="flex items-center justify-between">
                  <span className="text-body-small text-default">Fee</span>
                  <span className="text-body-small text-default">{payout.total.fee}</span>
                </div>
              )}
              <div className="h-[3px] rounded-full bg-gradient-to-r from-brand via-[#a855f7] to-[#ec4899]" />
              <div className="flex items-center justify-between">
                <span className="text-label-small-emphasized text-default">Total</span>
                <span className="text-label-small-emphasized text-default">{payout.total.total}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-10">
            <h2 className="text-heading-medium text-default mb-5">Timeline</h2>
            <div className="relative">
              {payout.timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-3 relative">
                  {/* Timeline line */}
                  {index < payout.timeline.length - 1 && (
                    <div className="absolute left-[7px] top-[18px] w-[2px] h-[calc(100%-2px)] bg-border" />
                  )}
                  {/* Dot */}
                  <div className="relative z-10 mt-1 shrink-0">
                    <div className="w-[16px] h-[16px] rounded-full bg-offset border border-border flex items-center justify-center">
                      <div className="w-[6px] h-[6px] rounded-full bg-icon-subdued" />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 flex items-start justify-between pb-5">
                    <p className="text-label-small-emphasized text-default">
                      {item.event}
                      {item.recipient && (
                        <> <button className="text-brand hover:underline cursor-pointer">{item.recipient}</button></>
                      )}
                    </p>
                    <span className="text-body-small text-subdued shrink-0">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Details sidebar */}
        <div className="w-[240px] shrink-0">
          <h2 className="text-heading-medium text-default mb-4">Details</h2>
          <div className="space-y-4">
            {/* OutboundPayment ID */}
            <div>
              <span className="text-label-small-emphasized text-default">OutboundPayment ID</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Icon name="duplicate" size="xsmall" fill="currentColor" className="text-icon-subdued" />
                <button className="text-body-small text-default underline hover:text-brand cursor-pointer break-all text-left">{payout.id}</button>
              </div>
            </div>

            {/* Trace ID */}
            <div>
              <div className="flex items-center gap-1">
                <span className="text-label-small-emphasized text-default">Trace ID</span>
                <Icon name="info" size="xsmall" fill="currentColor" className="text-icon-subdued" />
              </div>
              <p className="text-body-small text-default underline break-all mt-0.5">{payout.traceId}</p>
            </div>

            {/* From */}
            <div>
              <span className="text-label-small-emphasized text-default">From</span>
              <p className="mt-0.5">
                <button className="text-body-small text-brand hover:underline cursor-pointer">{payout.from}</button>
              </p>
            </div>

            {/* To */}
            <div>
              <span className="text-label-small-emphasized text-default">To</span>
              <div className="flex items-center gap-2 mt-0.5">
                <Icon name="bank" size="xsmall" fill="currentColor" className="text-icon-subdued" />
                <span className="text-body-small text-default">{payout.to}</span>
              </div>
            </div>

            {/* Payout method */}
            <div>
              <span className="text-label-small-emphasized text-default">Payout method</span>
              <p className="text-body-small text-default mt-0.5">{payout.payoutMethod}</p>
            </div>

            {/* Statement descriptor */}
            <div>
              <span className="text-label-small-emphasized text-default">Statement descriptor</span>
              <p className="text-body-small text-default mt-0.5">{payout.statementDescriptor}</p>
            </div>

            {/* Internal note */}
            <div>
              <span className="text-label-small-emphasized text-default">Internal note</span>
              <p className="text-body-small text-default mt-0.5">{payout.internalNote}</p>
            </div>

            {/* Expected delivery date */}
            <div>
              <span className="text-label-small-emphasized text-default">Expected delivery date</span>
              <p className="text-body-small text-default mt-0.5">{payout.expectedDelivery}</p>
            </div>

            {/* Receipt */}
            <div>
              <span className="text-label-small-emphasized text-default">Receipt</span>
              <p className="mt-0.5">
                <button className="text-body-small text-brand hover:underline cursor-pointer inline-flex items-center gap-1">
                  View
                  <Icon name="external" size="xsmall" fill="currentColor" />
                </button>
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-8">
            <h2 className="text-heading-medium text-default mb-3">Metadata</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-6 flex items-center justify-center">
              <span className="text-body-small text-subdued">No metadata</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

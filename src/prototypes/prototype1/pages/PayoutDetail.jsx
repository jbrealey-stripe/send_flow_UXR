import { useParams, useNavigate } from 'react-router-dom';
import { useBasePath } from '../../../contexts/BasePath';
import { Icon } from '../../../icons/SailIcons';
import Badge from '../../../components/Badge';

const payoutData = {
  id: 'po_1T1cgoCj5atLEhZqfoY9xavJ',
  amount: 'US$965.70',
  currency: 'USD',
  status: 'Paid',
  statusVariant: 'success',
  completedDate: 'Completed Tuesday 17 February',
  internalNote: 'STRIPE PAYOUT',
  deliveryMethod: 'Standard',
  traceId: '7UF6L35bd6cR7PP74X6UO54v6ws7YE7Pl3pI6UQ1C',
  fee: 'US$0.00',
  timeline: [
    { event: 'Payout completed', date: '17 Feb' },
    { event: 'Payout in transit', date: '17 Feb' },
    { event: 'Payout initiated automatically', date: '17 Feb, 01:02' },
  ],
  account: {
    name: 'STRIPE TEST BANK  ····  6789',
    currency: 'USD',
  },
  summary: [
    { label: 'Charges', count: 1, gross: 'US$1,000.00', fees: '(US$34.30)', total: 'US$965.70' },
    { label: 'Refunds', count: 0, gross: 'US$0.00', fees: 'US$0.00', total: 'US$0.00' },
    { label: 'Adjustments', count: 0, gross: 'US$0.00', fees: 'US$0.00', total: 'US$0.00' },
  ],
  payoutTotal: 'US$965.70',
  transactions: [
    { type: 'Charge', gross: 'US$1,000.00', fee: '(US$34.30)', total: 'US$965.70', description: 'fsd', date: '15 Feb' },
  ],
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

export default function PayoutDetail() {
  const { payoutId } = useParams();
  const navigate = useNavigate();
  const basePath = useBasePath();
  const payout = payoutData;

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-label-medium text-brand mb-3">
        <button onClick={() => navigate(`${basePath}/balances`)} className="hover:underline cursor-pointer">Balances</button>
        <Icon name="chevronRight" size="xsmall" fill="currentColor" />
        <button onClick={() => navigate(`${basePath}/transactions`)} className="hover:underline cursor-pointer">Payouts</button>
        <Icon name="chevronRight" size="xsmall" fill="currentColor" />
      </div>

      {/* Header */}
      <div className="mb-1">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-display-small text-default">{payout.amount}</h1>
          <span className="text-display-small text-subdued">{payout.currency}</span>
          <Badge variant={payout.statusVariant}>{payout.status}</Badge>
        </div>
        <p className="text-body-small text-subdued">{payout.completedDate}</p>
      </div>

      {/* Two column layout */}
      <div className="flex gap-10 mt-8">
        {/* Left column */}
        <div className="flex-1 min-w-0">
          {/* Timeline */}
          <div className="mb-10">
            <h2 className="text-heading-medium text-default mb-5">Timeline</h2>
            <div className="relative">
              {payout.timeline.map((item, index) => (
                <div key={index}>
                  <div className="flex items-start gap-3 relative">
                    {/* Timeline line */}
                    {index < payout.timeline.length - 1 && (
                      <div className="absolute left-[7px] top-[18px] w-[2px] bg-border" style={{ height: index === 0 ? 'calc(100% + 68px)' : 'calc(100% + 4px)' }} />
                    )}
                    {/* Dot */}
                    <div className="relative z-10 mt-1 shrink-0">
                      <div className="w-[16px] h-[16px] rounded-full bg-brand flex items-center justify-center">
                        <div className="w-[6px] h-[6px] rounded-full bg-white" />
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 flex items-start justify-between pb-4">
                      <p className="text-label-small-emphasized text-default">{item.event}</p>
                      <span className="text-body-small text-subdued shrink-0">{item.date}</span>
                    </div>
                  </div>
                  {/* Info banner after first item */}
                  {index === 0 && (
                    <div className="ml-[28px] mb-4 px-4 py-3 bg-offset rounded-lg">
                      <p className="text-body-small text-default">
                        <span className="text-label-small-emphasized">Can't find your payout?</span>{' '}
                        Contact your bank with the{' '}
                        <button className="text-brand hover:underline cursor-pointer">payout information</button>.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Account details */}
          <div className="mb-10">
            <h2 className="text-heading-medium text-default mb-5">Account details</h2>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <button className="text-icon-subdued hover:text-default cursor-pointer">
                  <Icon name="chevronRight" size="small" fill="currentColor" />
                </button>
                <div className="w-10 h-10 bg-offset rounded-lg flex items-center justify-center">
                  <Icon name="bank" size="small" fill="currentColor" className="text-icon-subdued" />
                </div>
                <span className="text-label-medium-emphasized text-default">{payout.account.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[18px]">🇺🇸</span>
                <span className="text-body-small text-default">{payout.account.currency}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-10">
            <h2 className="text-heading-medium text-default mb-5">Summary</h2>
            <table className="w-full">
              <thead>
                <tr className="text-right">
                  <th className="text-left pb-3 text-label-small text-subdued font-normal" style={{ width: '30%' }}></th>
                  <th className="pb-3 text-label-small text-subdued font-normal" style={{ width: '14%' }}>Count</th>
                  <th className="pb-3 text-label-small text-subdued font-normal" style={{ width: '18%' }}>Gross</th>
                  <th className="pb-3 text-label-small text-subdued font-normal" style={{ width: '18%' }}>Fees</th>
                  <th className="pb-3 text-label-small text-subdued font-normal" style={{ width: '20%' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {payout.summary.map((row, index) => (
                  <tr key={index} className="border-t border-border">
                    <td className="py-3 text-body-small text-default">{row.label}</td>
                    <td className="py-3 text-body-small text-default text-right">{row.count}</td>
                    <td className="py-3 text-body-small text-default text-right">{row.gross}</td>
                    <td className="py-3 text-body-small text-default text-right">{row.fees}</td>
                    <td className="py-3 text-body-small text-default text-right">{row.total}</td>
                  </tr>
                ))}
                <tr className="border-t border-border">
                  <td colSpan="4" className="py-3 text-label-small-emphasized text-default text-right pr-4">Payouts</td>
                  <td className="py-3 text-label-small-emphasized text-default text-right">{payout.payoutTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Transactions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-heading-medium text-default">Transactions</h2>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer">
                <Icon name="export" size="small" fill="currentColor" />
                Export
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-3 text-label-small text-subdued font-normal" style={{ width: '10%' }}>Type</th>
                  <th className="pb-3 text-label-small text-subdued font-normal" style={{ width: '16%' }}>Gross</th>
                  <th className="pb-3 text-label-small text-subdued font-normal" style={{ width: '14%' }}>Fee</th>
                  <th className="pb-3 text-label-small text-subdued font-normal" style={{ width: '14%' }}>Total</th>
                  <th className="pb-3 text-label-small text-subdued font-normal">Description</th>
                  <th className="pb-3 text-label-small text-subdued font-normal text-right" style={{ width: '12%' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {payout.transactions.map((tx, index) => (
                  <tr key={index} className="border-b border-border hover:bg-offset transition-colors cursor-pointer h-10">
                    <td className="text-body-small text-default">{tx.type}</td>
                    <td className="text-body-small text-default">{tx.gross}</td>
                    <td className="text-body-small text-default">{tx.fee}</td>
                    <td className="text-body-small text-default">{tx.total}</td>
                    <td className="text-body-small text-default">{tx.description}</td>
                    <td className="text-body-small text-subdued text-right">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column — Details sidebar */}
        <div className="w-[240px] shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-medium text-default">Details</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer">
              View receipt
            </button>
          </div>
          <div className="space-y-4">
            {/* Payout completed */}
            <div>
              <span className="text-label-small-emphasized text-default">Payout completed</span>
              <p className="text-body-small text-subdued flex items-center gap-1.5 mt-0.5">
                <Icon name="clock" size="xsmall" fill="currentColor" />
                17 Feb
              </p>
            </div>

            {/* Payout ID */}
            <div>
              <span className="text-label-small-emphasized text-default">Payout ID</span>
              <p className="text-body-small text-default break-all flex items-start gap-0.5 mt-0.5">
                {payout.id}
                <CopyButton text={payout.id} />
              </p>
            </div>

            {/* Internal note */}
            <div>
              <span className="text-label-small-emphasized text-default">Internal note</span>
              <p className="text-body-small text-default mt-0.5">{payout.internalNote}</p>
            </div>

            {/* Delivery method */}
            <div>
              <span className="text-label-small-emphasized text-default">Delivery method</span>
              <p className="text-body-small text-default mt-0.5">{payout.deliveryMethod}</p>
            </div>

            {/* Payout trace ID */}
            <div>
              <div className="flex items-center gap-1">
                <span className="text-label-small-emphasized text-default">Payout trace ID</span>
                <Icon name="info" size="xsmall" fill="currentColor" className="text-icon-subdued" />
              </div>
              <p className="text-body-small text-default break-all mt-0.5">{payout.traceId}</p>
            </div>

            {/* Fee */}
            <div>
              <span className="text-label-small-emphasized text-default">Fee</span>
              <p className="text-body-small text-default mt-0.5">{payout.fee}</p>
            </div>

            {/* Amount */}
            <div>
              <span className="text-label-small-emphasized text-default">Amount</span>
              <p className="text-body-small text-default mt-0.5">{payout.amount}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-heading-medium text-default">Metadata</h2>
              <button className="text-icon-subdued hover:text-default cursor-pointer">
                <Icon name="edit" size="small" fill="currentColor" />
              </button>
            </div>
            <div className="border-2 border-dashed border-border rounded-lg p-6 flex items-center justify-center">
              <span className="text-body-small text-subdued">No metadata</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

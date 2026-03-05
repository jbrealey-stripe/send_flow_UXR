import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBasePath } from '../../../contexts/BasePath';
import { Icon } from '../../../icons/SailIcons';
import Badge from '../../../components/Badge';
import SendModal from '../components/SendModal';
import { recipients } from './GlobalPayouts';
import { financialActivity } from './Transactions';
import { usePayouts, toFinancialActivityItem } from '../PayoutsContext';

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

export default function RecipientDetail() {
  const { recipientId } = useParams();
  const navigate = useNavigate();
  const basePath = useBasePath();
  const { payouts: userPayouts, userRecipients, addPayout, addRecipient } = usePayouts();
  const allRecipients = [...userRecipients, ...recipients];
  const recipient = allRecipients.find((r) => r.id === recipientId) || recipients[0];
  const [showSendModal, setShowSendModal] = useState(false);
  const userPayoutItems = userPayouts
    .filter((p) => p.recipientEmail === recipient.email)
    .map((p, i) => ({ ...toFinancialActivityItem(p), originalIndex: `user_${i}` }));
  const staticPayouts = financialActivity
    .map((item, i) => ({ ...item, originalIndex: i }))
    .filter((item) => item.to === recipient.email);
  const recipientPayouts = [...userPayoutItems, ...staticPayouts];

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-label-medium text-brand mb-3">
        <button onClick={() => navigate(`${basePath}/global-payouts`)} className="hover:underline cursor-pointer">Recipients</button>
        <Icon name="chevronRight" size="xsmall" fill="currentColor" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-display-small text-default mb-1">{recipient.email}</h1>
          <p className="text-body-small text-subdued">{recipient.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSendModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-button-primary-bg text-button-primary-text rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            <Icon name="send" size="xsmall" fill="currentColor" />
            <span className="text-label-small-emphasized">Send payout</span>
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
          {/* Payout destinations */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-heading-medium text-default">Payout destinations</h2>
              <button className="flex items-center justify-center w-8 h-8 border border-border rounded-lg text-default hover:bg-offset transition-colors cursor-pointer">
                <Icon name="add" size="small" fill="currentColor" />
              </button>
            </div>

            {/* Destination card */}
            <div className="border border-border rounded-lg">
              {/* Destination header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <Icon name="chevronDown" size="small" fill="currentColor" className="text-icon-subdued" />
                  <Icon name="bank" size="small" fill="currentColor" className="text-icon-subdued" />
                  <span className="text-label-medium-emphasized text-default">{recipient.destination.label}</span>
                  <Badge variant="info">Default</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-body-small text-default">{recipient.destination.currency}</span>
                  <button className="text-icon-subdued hover:text-default cursor-pointer">
                    <Icon name="more" size="small" fill="currentColor" />
                  </button>
                </div>
              </div>

              {/* Destination details */}
              <div className="px-4 pb-4 pt-2 ml-[52px]">
                <p className="text-label-small-emphasized text-subdued mb-3 tracking-wide">DETAILS</p>
                <div className="space-y-2.5">
                  <div className="flex">
                    <span className="text-body-small text-subdued w-[160px] shrink-0">ID</span>
                    <span className="text-body-small text-default flex items-center">
                      <code className="text-body-small bg-offset px-1.5 py-0.5 rounded">{recipient.destination.id}</code>
                      <CopyButton text={recipient.destination.idFull} />
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-body-small text-subdued w-[160px] shrink-0">Bank name</span>
                    <span className="text-body-small text-default">{recipient.destination.bankName}</span>
                  </div>
                  <div className="flex">
                    <span className="text-body-small text-subdued w-[160px] shrink-0">Routing number</span>
                    <span className="text-body-small text-default">{recipient.destination.routingNumber}</span>
                  </div>
                  <div className="flex">
                    <span className="text-body-small text-subdued w-[160px] shrink-0">Wire routing number</span>
                    <button className="text-body-small text-brand hover:underline cursor-pointer flex items-center gap-1">
                      <Icon name="add" size="xsmall" fill="currentColor" />
                      Add number
                    </button>
                  </div>
                  <div className="flex">
                    <span className="text-body-small text-subdued w-[160px] shrink-0">Country</span>
                    <span className="text-body-small text-default">{recipient.destination.countryCode}</span>
                  </div>
                  <div className="flex">
                    <span className="text-body-small text-subdued w-[160px] shrink-0">Last 4</span>
                    <span className="text-body-small text-default">{recipient.destination.last4}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payout transactions */}
          <div>
            <h2 className="text-heading-medium text-default mb-5">Payout transactions</h2>
            {recipientPayouts.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '25%' }}>Amount</th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '30%' }}>Description</th>
                    <th className="pb-3 text-label-small text-subdued font-normal">Created date</th>
                  </tr>
                </thead>
                <tbody>
                  {recipientPayouts.map((tx) => (
                    <tr key={tx.originalIndex} onClick={() => navigate(`${basePath}/financial-payouts/obp_${tx.originalIndex}`)} className="border-b border-border hover:bg-offset transition-colors cursor-pointer h-10">
                      <td className="pr-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-label-medium-emphasized text-default">{tx.amount}</span>
                          {tx.status && <Badge variant={tx.status === 'Failed' ? 'danger' : 'warning'}>{tx.status}</Badge>}
                        </div>
                      </td>
                      <td className="pr-4 text-body-small text-default">{tx.description}</td>
                      <td className="text-body-small text-subdued">{tx.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-8 flex items-center justify-center">
                <span className="text-body-small text-subdued">No payout transactions yet.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right column — Details sidebar */}
        <div className="w-[240px] shrink-0">
          {/* Account information */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-medium text-default">Account information</h2>
              <button className="text-icon-subdued hover:text-default cursor-pointer">
                <Icon name="edit" size="small" fill="currentColor" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-label-small-emphasized text-default">Account ID</span>
                <p className="text-body-small text-brand flex items-center gap-1 mt-0.5">
                  <Icon name="external" size="xsmall" fill="currentColor" />
                  <span className="underline">{recipient.accountId}</span>
                </p>
              </div>
              <div>
                <span className="text-label-small-emphasized text-default">Email address</span>
                <p className="text-body-small text-default mt-0.5">{recipient.email}</p>
              </div>
              <div>
                <span className="text-label-small-emphasized text-default">Contact phone number</span>
                <p className="text-body-small text-default mt-0.5">{recipient.phone}</p>
              </div>
              <div>
                <span className="text-label-small-emphasized text-default">Name</span>
                <p className="text-body-small text-default mt-0.5">{recipient.name}</p>
              </div>
              <div>
                <span className="text-label-small-emphasized text-default">Country</span>
                <p className="text-body-small text-default mt-0.5">{recipient.country}</p>
              </div>
            </div>
          </div>

          {/* Recipient information */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-medium text-default">Recipient information</h2>
              <button className="text-icon-subdued hover:text-default cursor-pointer">
                <Icon name="edit" size="small" fill="currentColor" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-label-small-emphasized text-default">Recipient type</span>
                <p className="text-body-small text-default mt-0.5">{recipient.recipientType}</p>
              </div>
              <div>
                <span className="text-label-small-emphasized text-default">Legal first name</span>
                <p className="text-body-small text-default mt-0.5">{recipient.legalFirstName}</p>
              </div>
              <div>
                <span className="text-label-small-emphasized text-default">Legal last name</span>
                <p className="text-body-small text-default mt-0.5">{recipient.legalLastName}</p>
              </div>
              <div>
                <span className="text-label-small-emphasized text-default">Address</span>
                {recipient.address.map((line, i) => (
                  <p key={i} className="text-body-small text-default mt-0.5">{line}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Configurations */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-medium text-default">Configurations</h2>
              <button className="px-3 py-1 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer">
                View all
              </button>
            </div>
            <div>
              <span className="text-label-small-emphasized text-default">Recipient</span>
              <p className="text-body-small text-default mt-0.5">Receives transfers to their Stripe balance or directly to their bank account.</p>
            </div>
          </div>

          {/* Payout methods */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-medium text-default">Payout methods</h2>
              <button className="text-icon-subdued hover:text-default cursor-pointer">
                <Icon name="edit" size="small" fill="currentColor" />
              </button>
            </div>
            <div className="space-y-4">
              {recipient.payoutMethods.map((method) => (
                <div key={method.name}>
                  <span className="text-label-small-emphasized text-default">{method.name}</span>
                  <p className="text-body-small text-default flex items-center gap-1.5 mt-0.5">
                    {method.enabled ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" fill="#22c55e" />
                          <path d="M4.5 8L7 10.5L11.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Enabled
                      </>
                    ) : (
                      <>
                        <span className="text-subdued">—</span>
                        Not enabled
                      </>
                    )}
                  </p>
                </div>
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
        initialRecipient={{
          name: recipient.name,
          email: recipient.email,
          last4: recipient.destination.last4,
          country: recipient.destination.countryCode,
        }}
      />
    </div>
  );
}

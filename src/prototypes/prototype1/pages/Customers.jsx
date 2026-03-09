import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasePath } from '../../../contexts/BasePath';
import { Icon } from '../../../icons/SailIcons';
import Badge from '../../../components/Badge';

const filters = ['Email', 'Name', 'Created date', 'Type', 'More filters'];

const customers = [
  { id: 'gcus_1T0tJvCj5atLEhZqrwb0Q23u', type: 'Guest', email: '—', paymentMethod: { brand: 'VISA', last4: '0077' }, country: '—', created: '15 Feb, 00:36', totalSpend: 'US$1,000.00', payments: 1, refunds: 'US$0.00', disputeLosses: 'US$0.00' },
  { id: 'cus_R8vKmL3nP2wXtY', type: null, email: 'maria.garcia@acmecorp.com', paymentMethod: { brand: 'VISA', last4: '4521' }, country: 'US', created: '12 Feb, 14:22', totalSpend: 'US$7,500.00', payments: 3, refunds: 'US$0.00', disputeLosses: 'US$0.00' },
  { id: 'cus_R7tNpQ5sW1xZaB', type: null, email: 'chen.wei@globaltrade.cn', paymentMethod: { brand: 'MC', last4: '8832' }, country: 'CN', created: '10 Feb, 09:15', totalSpend: 'US$16,800.00', payments: 5, refunds: 'US$500.00', disputeLosses: 'US$0.00' },
  { id: 'cus_R6mHjK9vT4yBcD', type: null, email: 'emma.johnson@techstart.io', paymentMethod: { brand: 'VISA', last4: '7744' }, country: 'GB', created: '8 Feb, 16:45', totalSpend: 'US$3,200.00', payments: 2, refunds: 'US$0.00', disputeLosses: 'US$0.00' },
  { id: 'cus_R5kFgN2qX8zEfG', type: 'Guest', email: '—', paymentMethod: { brand: 'AMEX', last4: '1003' }, country: '—', created: '6 Feb, 11:30', totalSpend: 'US$450.00', payments: 1, refunds: 'US$0.00', disputeLosses: 'US$0.00' },
  { id: 'cus_R4iDcL7sY3aGhJ', type: null, email: 'ap@meridiangroup.com', paymentMethod: { brand: 'VISA', last4: '3301' }, country: 'US', created: '5 Feb, 08:00', totalSpend: 'US$45,000.00', payments: 12, refunds: 'US$1,200.00', disputeLosses: 'US$0.00' },
  { id: 'cus_R3gBaN5rZ2bHkL', type: null, email: 'tanaka.yuki@fastmail.jp', paymentMethod: { brand: 'MC', last4: '9012' }, country: 'JP', created: '3 Feb, 17:20', totalSpend: 'US$6,400.00', payments: 4, refunds: 'US$0.00', disputeLosses: 'US$0.00' },
  { id: 'cus_R2eZyM3pA1cJmN', type: null, email: 'billing@scalefast.io', paymentMethod: { brand: 'VISA', last4: '2211' }, country: 'US', created: '1 Feb, 09:45', totalSpend: 'US$88,000.00', payments: 8, refunds: 'US$0.00', disputeLosses: 'US$2,500.00' },
  { id: 'cus_R1cXwK1nB0dKoP', type: null, email: 'james.wilson@hey.com', paymentMethod: { brand: 'VISA', last4: '7766' }, country: 'AU', created: '30 Jan, 14:10', totalSpend: 'US$13,600.00', payments: 6, refunds: 'US$800.00', disputeLosses: 'US$0.00' },
  { id: 'cus_R0aVuJ9lC9eLoR', type: 'Guest', email: '—', paymentMethod: { brand: 'MC', last4: '5588' }, country: '—', created: '28 Jan, 22:05', totalSpend: 'US$275.00', payments: 1, refunds: 'US$275.00', disputeLosses: 'US$0.00' },
  { id: 'cus_QzYTsH7jD8fMpS', type: null, email: 'hello@craftshop.com', paymentMethod: { brand: 'VISA', last4: '9988' }, country: 'US', created: '26 Jan, 10:30', totalSpend: 'US$4,788.00', payments: 12, refunds: 'US$0.00', disputeLosses: 'US$0.00' },
  { id: 'cus_QyWRqF5hE7gNqU', type: null, email: 'samuel.okafor@gmail.com', paymentMethod: { brand: 'VISA', last4: '3344' }, country: 'GB', created: '24 Jan, 08:15', totalSpend: 'US$2,000.00', payments: 4, refunds: 'US$0.00', disputeLosses: 'US$0.00' },
  { id: 'cus_QxUPoD3fF6hOrW', type: null, email: 'anna.mueller@designlab.de', paymentMethod: { brand: 'MC', last4: '6677' }, country: 'DE', created: '22 Jan, 16:50', totalSpend: 'US$8,400.00', payments: 2, refunds: 'US$0.00', disputeLosses: 'US$0.00' },
  { id: 'cus_QwSNnB1dG5iPsY', type: null, email: 'raj.kumar@freelance.in', paymentMethod: { brand: 'VISA', last4: '4433' }, country: 'IN', created: '20 Jan, 12:00', totalSpend: 'US$3,800.00', payments: 4, refunds: 'US$0.00', disputeLosses: 'US$0.00' },
  { id: 'cus_QvQLlZ9bH4jQtA', type: null, email: 'marie.laurent@startup.fr', paymentMethod: { brand: 'VISA', last4: '1122' }, country: 'FR', created: '18 Jan, 14:37', totalSpend: 'US$7,500.00', payments: 3, refunds: 'US$0.00', disputeLosses: 'US$0.00' },
];

function PaymentMethodBadge({ brand }) {
  const styles = {
    VISA: { bg: 'bg-[#1A1F71]', text: 'VISA', italic: true },
    MC: { bg: 'bg-[#EB001B]', text: 'MC', italic: false },
    AMEX: { bg: 'bg-[#006FCF]', text: 'AMEX', italic: false },
  };
  const s = styles[brand] || styles.VISA;
  return (
    <div className={`w-8 h-5 ${s.bg} rounded flex items-center justify-center shrink-0`}>
      <span className={`text-white text-[7px] font-bold ${s.italic ? 'italic' : ''}`}>{s.text}</span>
    </div>
  );
}

export default function Customers() {
  const navigate = useNavigate();
  const basePath = useBasePath();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-display-small text-default">Customers</h1>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-button-primary-bg text-button-primary-text rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
          <Icon name="add" size="xsmall" fill="currentColor" />
          <span className="text-label-small-emphasized">Add customer</span>
          <span className="w-4 h-4 rounded bg-white/20 flex items-center justify-center text-[9px] font-bold">N</span>
        </button>
      </div>

      {/* Filters row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-label-small text-subdued hover:bg-offset transition-colors cursor-pointer"
            >
              <Icon name="add" size="xsmall" fill="currentColor" />
              {filter}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer">
            <Icon name="clipboard" size="small" fill="currentColor" />
            Copy
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer">
            <Icon name="export" size="small" fill="currentColor" />
            Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer">
            <Icon name="barChart" size="small" fill="currentColor" />
            Analyse
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer">
            <Icon name="settings" size="small" fill="currentColor" />
            Edit columns
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
      <table className="w-full" style={{ minWidth: '1200px' }}>
        <thead>
          <tr className="text-left border-b border-border">
            <th className="pb-3 pr-2 w-8">
              <input type="checkbox" className="rounded border-border" />
            </th>
            <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '240px' }}>Customer</th>
            <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '200px' }}>Email</th>
            <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '170px' }}>Primary payment method</th>
            <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '70px' }}>Country</th>
            <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '120px' }}>Created</th>
            <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '120px' }}>Total spend</th>
            <th className="pb-3 text-label-small text-subdued font-normal pr-4 text-right" style={{ width: '80px' }}>Payments</th>
            <th className="pb-3 text-label-small text-subdued font-normal pr-4 text-right" style={{ width: '90px' }}>Refunds</th>
            <th className="pb-3 text-label-small text-subdued font-normal text-right" style={{ width: '100px' }}>Dispute losses</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index} className="border-b border-border hover:bg-offset transition-colors cursor-pointer h-10">
              <td className="pr-2">
                <input type="checkbox" className="rounded border-border" />
              </td>
              <td className="pr-4 overflow-hidden">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-body-small text-default">{customer.id}</span>
                  {customer.type && <Badge>{customer.type}</Badge>}
                </div>
              </td>
              <td className="pr-4 text-body-small text-subdued overflow-hidden text-ellipsis whitespace-nowrap">{customer.email}</td>
              <td className="pr-4">
                <div className="flex items-center gap-2">
                  <PaymentMethodBadge brand={customer.paymentMethod.brand} />
                  <span className="text-body-small text-default">····  {customer.paymentMethod.last4}</span>
                </div>
              </td>
              <td className="pr-4 text-body-small text-default">{customer.country}</td>
              <td className="pr-4 text-body-small text-subdued whitespace-nowrap">{customer.created}</td>
              <td className="pr-4 text-body-small text-default whitespace-nowrap">{customer.totalSpend}</td>
              <td className="pr-4 text-body-small text-default text-right">{customer.payments}</td>
              <td className="pr-4 text-body-small text-default text-right whitespace-nowrap">{customer.refunds}</td>
              <td className="text-body-small text-default text-right whitespace-nowrap">{customer.disputeLosses}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Item count */}
      <div className="mt-3 text-body-small text-subdued">{customers.length} items</div>
    </div>
  );
}

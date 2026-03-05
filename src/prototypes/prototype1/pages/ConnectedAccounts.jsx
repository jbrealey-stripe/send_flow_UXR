import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Icon } from '../../../icons/SailIcons';
import Table from '../../../components/Table';
import Badge from '../../../components/Badge';
import { connectedAccounts, statusCounts, statusConfig } from '../data/connectedAccounts';

const StatusBadge = ({ status }) => {
  const { label, variant } = statusConfig[status] || statusConfig.enabled;
  return <Badge variant={variant}>{label}</Badge>;
};

const StatusTab = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-start px-4 py-3 min-w-[150px] rounded-lg border transition-colors cursor-pointer ${active
      ? 'border-brand border-2'
      : 'border-border bg-surface hover:border-brand'
      }`}
  >
    <span className={active ? 'text-label-medium-emphasized text-brand' : 'text-label-medium text-subdued'}>{label}</span>
    <span className={`text-body-medium ${active ? 'text-brand' : 'text-default'}`}>
      {count.toLocaleString()}
    </span>
  </button>
);

const FilterPill = ({ label }) => (
  <button className="flex items-center gap-1.5 px-2 py-1 text-label-small text-subdued bg-surface border border-dashed border-border rounded-full hover:bg-offset transition-colors cursor-pointer">
    <Icon name="addCircle" size="xsmall" fill="currentColor" />
    {label}
  </button>
);

const formatCurrency = (value) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const tableColumns = [
  {
    key: 'name',
    header: 'Account',
    width: 'grow',
    render: (item) => <span className="text-label-medium text-default">{item.name}</span>,
  },
  {
    key: 'status',
    header: 'Account status',
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: 'paymentBalance',
    header: 'Payment balance (USD)',
    align: 'right',
    render: (item) => <span className="text-subdued">{formatCurrency(item.paymentBalance)}</span>,
  },
  {
    key: 'volume',
    header: 'Volume (USD)',
    align: 'right',
    render: (item) => <span className="text-subdued">{formatCurrency(item.volume)}</span>,
  },
  {
    key: 'connectedOn',
    header: 'Connected on',
    render: (item) => <span className="text-subdued">{formatDate(item.connectedOn)}</span>,
  },
  {
    key: 'actions',
    header: '',
    render: () => (
      <button className="p-1 text-icon-subdued hover:text-icon-default hover:bg-offset rounded transition-colors">
        <Icon name="more" size="small" fill="currentColor" />
      </button>
    ),
  },
];

export default function ConnectedAccounts() {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const handleRowClick = (account) => {
    navigate(account.id, { relative: 'path' });
  };

  return (
    <div className="px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading-xlarge text-default">Connected accounts</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon="add">Create</Button>
          <Button variant="secondary" icon="more" />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        <StatusTab label="All" count={statusCounts.all} active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
        <StatusTab label="Restricted" count={statusCounts.restricted} active={activeTab === 'restricted'} onClick={() => setActiveTab('restricted')} />
        <StatusTab label="Restricted soon" count={statusCounts.restricted_soon} active={activeTab === 'restricted_soon'} onClick={() => setActiveTab('restricted_soon')} />
        <StatusTab label="In review" count={statusCounts.in_review} active={activeTab === 'in_review'} onClick={() => setActiveTab('in_review')} />
        <StatusTab label="Rejected" count={statusCounts.rejected} active={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')} />
        <StatusTab label="Enabled" count={statusCounts.enabled} active={activeTab === 'enabled'} onClick={() => setActiveTab('enabled')} />
      </div>

      {/* Filter Pills */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterPill label="Account status" />
          <FilterPill label="Last active" />
          <FilterPill label="Requirement" />
          <FilterPill label="Payment balance (USD)" />
          <FilterPill label="Volume (USD)" />
          <FilterPill label="More filters" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon="download">Export</Button>
          <Button variant="secondary" size="sm" icon="settings">Edit columns</Button>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={tableColumns}
        data={connectedAccounts}
        rowKey="id"
        onRowClick={handleRowClick}
        emptyStateTitle="No connected accounts"
        emptyStateDescription="Create your first connected account to get started."
      />
    </div>
  );
}

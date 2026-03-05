import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasePath } from '../../../contexts/BasePath';
import { Icon } from '../../../icons/SailIcons';

const grossVolumeData = [0, 0, 120, 340, 280, 510, 490, 620, 780, 950, 870, 1100, 1050, 1320, 1480, 1200, 1650, 1800, 1720, 1950, 2100, 2350];
const netVolumeData = [0, 0, 108, 306, 252, 459, 441, 558, 702, 855, 783, 990, 945, 1188, 1332, 1080, 1485, 1620, 1548, 1755, 1890, 2115];
const disputeData = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
const highRiskData = [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0];

function MiniChart({ data, color = '#635BFF', height = 80, negative = false }) {
  const max = Math.max(...data, 1);
  const width = 100;
  const h = height;
  const padding = 2;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = negative
      ? padding + ((max - Math.abs(v)) / max) * (h - padding * 2)
      : padding + ((max - v) / max) * (h - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function PaymentsBar({ segments }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  return (
    <div className="flex h-3 rounded-full overflow-hidden">
      {segments.map((seg) => (
        <div
          key={seg.label}
          style={{ width: `${(seg.value / total) * 100}%`, backgroundColor: seg.color }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const basePath = useBasePath();
  const [dateRange] = useState('Last 4 weeks');
  const [compare] = useState('Previous period');
  const [currency] = useState('USD');

  const paymentSegments = [
    { label: 'Succeeded', value: 18450, color: '#8B5CF6', amount: 'US$18,450.00' },
    { label: 'Uncaptured', value: 0, color: '#1D4ED8', amount: 'US$0.00' },
    { label: 'Refunded', value: 320, color: '#06B6D4', amount: 'US$320.00' },
    { label: 'Blocked', value: 0, color: '#F59E0B', amount: 'US$0.00' },
    { label: 'Failed', value: 150, color: '#DC2626', amount: 'US$150.00' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading-xlarge text-default">Organisation performance</h1>
        <div className="flex items-center gap-1">
          {/* Date range */}
          <div className="flex items-center gap-2 px-3 py-1.5 text-label-small text-subdued">
            <span>Date range</span>
            <button className="flex items-center gap-1 text-label-small-emphasized text-default bg-offset px-2 py-1 rounded-md cursor-pointer">
              {dateRange}
              <Icon name="chevronDown" size="xsmall" fill="currentColor" />
            </button>
          </div>
          <div className="w-px h-4 bg-border" />
          {/* Compare */}
          <div className="flex items-center gap-2 px-3 py-1.5 text-label-small text-subdued">
            <Icon name="settings" size="xsmall" fill="currentColor" />
            <span>Compare</span>
            <button className="flex items-center gap-1 text-label-small-emphasized text-default bg-offset px-2 py-1 rounded-md cursor-pointer">
              {compare}
              <Icon name="chevronDown" size="xsmall" fill="currentColor" />
            </button>
          </div>
          <div className="w-px h-4 bg-border" />
          {/* Currency */}
          <div className="flex items-center gap-2 px-3 py-1.5 text-label-small text-subdued">
            <span>Currency</span>
            <button className="flex items-center gap-1 text-label-small-emphasized text-default bg-offset px-2 py-1 rounded-md cursor-pointer">
              {currency}
              <Icon name="chevronDown" size="xsmall" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      {/* Top row — 3 cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Gross volume */}
        <div className="border border-border rounded-lg p-5">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-label-small text-subdued">Gross volume</span>
            <Icon name="info" size="xsmall" fill="currentColor" className="text-icon-subdued" />
          </div>
          <p className="text-display-small text-default mb-0.5">US$18,920.00</p>
          <p className="text-body-small text-subdued mb-4">US$14,200.00 previous period</p>
          <div className="relative">
            <MiniChart data={grossVolumeData} />
            <div className="flex items-center justify-between mt-1">
              <span className="text-label-small text-subdued">8 Feb</span>
              <span className="text-label-small text-subdued">1 Mar</span>
            </div>
          </div>
        </div>

        {/* Net volume from sales */}
        <div className="border border-border rounded-lg p-5">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-label-small text-subdued">Net volume from sales</span>
            <Icon name="info" size="xsmall" fill="currentColor" className="text-icon-subdued" />
          </div>
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-display-small text-default">US$17,064.00</p>
            <span className="text-label-small-emphasized text-badge-success-text">+33.2%</span>
          </div>
          <p className="text-body-small text-subdued mb-4">US$12,810.00 previous period</p>
          <div className="relative">
            <MiniChart data={netVolumeData} color="#635BFF" />
            <div className="flex items-center justify-between mt-1">
              <span className="text-label-small text-subdued">8 Feb</span>
              <span className="text-label-small text-subdued">1 Mar</span>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="border border-border rounded-lg p-5">
          <div className="flex items-center gap-1.5 mb-4">
            <span className="text-label-small text-subdued">Payments</span>
            <Icon name="info" size="xsmall" fill="currentColor" className="text-icon-subdued" />
          </div>
          <PaymentsBar segments={paymentSegments} />
          <div className="mt-4 space-y-2.5">
            {paymentSegments.map((seg) => (
              <div key={seg.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-body-small text-default">{seg.label}</span>
                </div>
                <span className="text-label-small-emphasized text-default">{seg.amount}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-body-small text-subdued">Updated yesterday</span>
            <button
              onClick={() => navigate(`${basePath}/transactions`)}
              className="text-label-small-emphasized text-brand hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row — 2 cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Disputes */}
        <div className="border border-border rounded-lg p-5">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-label-small text-subdued">Disputes</span>
            <Icon name="info" size="xsmall" fill="currentColor" className="text-icon-subdued" />
          </div>
          <p className="text-display-small text-default mb-0.5">2</p>
          <p className="text-body-small text-subdued mb-4">0 previous period</p>
          <div className="relative">
            <MiniChart data={disputeData} color="#635BFF" />
            <div className="flex items-center justify-between mt-1">
              <span className="text-label-small text-subdued">8 Feb</span>
              <span className="text-label-small text-subdued">1 Mar</span>
            </div>
          </div>
        </div>

        {/* High-risk payments */}
        <div className="border border-border rounded-lg p-5">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-label-small text-subdued">High-risk payments</span>
            <Icon name="info" size="xsmall" fill="currentColor" className="text-icon-subdued" />
          </div>
          <p className="text-display-small text-default mb-0.5">3</p>
          <p className="text-body-small text-subdued mb-4">0 previous period</p>
          <div className="relative">
            <MiniChart data={highRiskData} color="#635BFF" />
            <div className="flex items-center justify-between mt-1">
              <span className="text-label-small text-subdued">8 Feb</span>
              <span className="text-label-small text-subdued">1 Mar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

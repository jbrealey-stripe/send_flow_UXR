import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBasePath } from '../../contexts/BasePath';
import { NavItem, SubNavItem, SectionHeading, ExpandableNavItem } from '../../components/Sidebar';
import { ACCOUNT_NAME } from '../../components/Header';
import { Icon } from '../../icons/SailIcons';

export default function SidebarNav() {
  const location = useLocation();
  const basePath = useBasePath();
  const [expandedSection, setExpandedSection] = useState('connect');

  const isActive = (path) => location.pathname === (path ? `${basePath}/${path}` : basePath || '/');

  return (
    <>
      {/* Account Section - Desktop (compact row) */}
      <div className="hidden lg:flex p-1.5 -mx-0.5 rounded-lg items-center border-border hover:bg-offset gap-2 duration-100">
        <img src="/rocketrides.svg" alt={ACCOUNT_NAME} className="size-[24px] rounded" />
        <span className="text-default text-label-medium-emphasized">
          {ACCOUNT_NAME}
        </span>
      </div>

      {/* Account Section - Mobile (centered) */}
      <div className="flex lg:hidden flex-col items-center gap-2 pt-2 pb-8 border-b border-border">
        <img src="/rocketrides.svg" alt={ACCOUNT_NAME} className="size-[40px] rounded-lg" />
        <span className="text-default text-heading-small">{ACCOUNT_NAME}</span>
      </div>

      {/* Main Navigation */}
      <div className="">
        <NavItem icon={<Icon name="home" size="small" fill="currentColor" />} label="Home" to="" active={isActive('')} />
        <NavItem icon={<Icon name="balance" size="small" fill="currentColor" />} label="Balances" to="balances" active={isActive('balances')} />
        <NavItem icon={<Icon name="arrowsLoop" size="small" fill="currentColor" />} label="Transactions" to="transactions" active={isActive('transactions')} />
        <NavItem icon={<Icon name="person" size="small" fill="currentColor" />} label="Customers" to="customers" active={isActive('customers')} />
        <NavItem icon={<Icon name="product" size="small" fill="currentColor" />} label="Product catalog" />
      </div>

      {/* Shortcuts */}
      <div className="space-y-2">
        <SectionHeading label="Shortcuts" />
        <div className="">
          <NavItem icon={<Icon name="send" size="small" fill="currentColor" />} label="Global Payouts" to="global-payouts" active={isActive('global-payouts')} />
        </div>
      </div>

      {/* Products */}
      <div className="space-y-2">
        <SectionHeading label="Products" />
        <div className="">
          <NavItem icon={<Icon name="payment" size="small" fill="currentColor" />} label="Payments" />
          <NavItem icon={<Icon name="billing" size="small" fill="currentColor" />} label="Billing" />
          <NavItem icon={<Icon name="reporting" size="small" fill="currentColor" />} label="Reporting" />
        </div>
      </div>

      {/* Back to scenarios */}
      <div className="mt-auto pt-4 border-t border-border">
        <Link to="/" className="flex items-center gap-2 px-1 py-2 rounded-md hover:bg-offset transition-colors text-subdued hover:text-default">
          <Icon name="chevronLeft" size="small" fill="currentColor" />
          <span className="text-label-medium">All scenarios</span>
        </Link>
      </div>

    </>
  );
}

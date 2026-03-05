import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasePath } from '../../../contexts/BasePath';
import { Icon } from '../../../icons/SailIcons';
import Badge from '../../../components/Badge';
import SendModal from '../components/SendModal';
import { usePayouts, toRecipientPayoutItem } from '../PayoutsContext';
const tabs = ['Overview', 'Payouts to recipients', 'Recipients'];

const currencies = [
  { flag: '🇺🇸', amount: 'US$224,857.99', code: 'USD', available: 'US$10.00 available soon' },
  { flag: '🇪🇺', amount: '€84.82', code: 'EUR', available: '€0.00 available soon' },
  { flag: '🇬🇧', amount: '£73.17', code: 'GBP', available: '£0.00 available soon' },
  { flag: '🪙', amount: '$24,883.00', code: 'USDC', available: '$0.00 available soon' },
];

const payoutStates = [
  { label: 'Posted', count: 24, color: 'bg-brand' },
  { label: 'In progress', count: 0, color: 'bg-badge-info-text' },
  { label: 'Voided', count: 8, color: 'bg-[#93c5fd]' },
  { label: 'Failed', count: 5, color: 'bg-[#f97316]' },
];

const recipientStates = [
  { label: 'Ready', count: 79, color: 'bg-brand' },
  { label: 'Needs Action', count: 53, color: 'bg-badge-info-text' },
  { label: 'Pending', count: 1, color: 'bg-[#06b6d4]' },
  { label: 'Rejected', count: 0, color: 'bg-[#1e3a5f]' },
];

const recipientPayoutStatusTabs = [
  { label: 'All', count: null },
  { label: 'Processing', count: null },
  { label: 'Posted', count: null },
  { label: 'Failed', count: null },
  { label: 'Returned', count: null },
];

const recipientPayoutFilters = ['Currency', 'Status', 'Created date', 'Recipient ID', 'Outbound payment ID'];

const recipientStatusTabs = [
  { label: 'All recipients', count: 133 },
  { label: 'Ready', count: 79 },
  { label: 'Needs action', count: 53 },
  { label: 'Pending', count: 1 },
  { label: 'Rejected', count: 0 },
];

const recipientFilters = ['Email address', 'Name', 'ID', 'Created date'];

export const recipients = [
  { email: 'maria.garcia@acmecorp.com', needsAction: false, name: 'Maria Garcia', id: 'acct_1T2CtXCj5a07JTlA', created: '18 Feb, 15:42', phone: '+1 415-555-0142', country: 'United States', recipientType: 'Individual', legalFirstName: 'Maria', legalLastName: 'Garcia', address: ['350 5th Avenue', 'New York, NY 10118'], destination: { label: 'Bank Account  ····  4521', currency: 'USD', id: 'usba_test_4...521Q', bankName: 'Chase Bank', routingNumber: '021000021', countryCode: 'US', last4: '4521' }, transactions: [{ amount: 'US$2,500.00', status: null, statusVariant: null, description: 'Monthly contractor fee', created: '18 Feb, 15:42' }, { amount: 'US$2,500.00', status: null, statusVariant: null, description: 'Monthly contractor fee', created: '15 Jan, 10:30' }], payoutMethods: [{ name: 'ACH', enabled: true }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'chen.wei@globaltrade.cn', needsAction: false, name: 'Chen Wei', id: 'acct_1T2CsLCj5azvpQHH', created: '18 Feb, 15:41', phone: '+86 138-0000-1234', country: 'China', recipientType: 'Individual', legalFirstName: 'Wei', legalLastName: 'Chen', address: ['88 Century Avenue', 'Shanghai, 200120'], destination: { label: 'Bank Account  ····  8832', currency: 'USD', id: 'usba_test_8...832R', bankName: 'Bank of China', routingNumber: '071000505', countryCode: 'CN', last4: '8832' }, transactions: [{ amount: 'US$8,400.00', status: null, statusVariant: null, description: 'Consulting — Q1', created: '17 Feb, 09:15' }], payoutMethods: [{ name: 'ACH', enabled: false }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'emma.johnson@techstart.io', needsAction: true, name: 'Emma Johnson', id: 'acct_1T2CpPCj5agRz1MB', created: '18 Feb, 15:38', phone: '+44 20 7946 0958', country: 'United Kingdom', recipientType: 'Individual', legalFirstName: 'Emma', legalLastName: 'Johnson', address: ['12 Baker Street', 'London, W1U 3BW'], destination: { label: 'Bank Account  ····  7744', currency: 'GBP', id: 'usba_test_7...744S', bankName: 'Barclays', routingNumber: '203002', countryCode: 'GB', last4: '7744' }, transactions: [{ amount: '£1,200.00', status: 'Failed', statusVariant: 'danger', description: 'Design services', created: '16 Feb, 14:20' }], payoutMethods: [{ name: 'ACH', enabled: false }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'ap@meridiangroup.com', needsAction: false, name: 'Meridian Group LLC', id: 'acct_1T28v0Cj5akyfLCH', created: '18 Feb, 11:27', phone: '+1 212-555-0198', country: 'United States', recipientType: 'Company', legalFirstName: '—', legalLastName: '—', address: ['1 Market Street, Suite 400', 'San Francisco, CA 94105'], destination: { label: 'Bank Account  ····  3301', currency: 'USD', id: 'usba_test_3...301T', bankName: 'Wells Fargo', routingNumber: '121000248', countryCode: 'US', last4: '3301' }, transactions: [{ amount: 'US$15,000.00', status: null, statusVariant: null, description: 'Platform license — Q1', created: '15 Feb, 08:45' }, { amount: 'US$15,000.00', status: null, statusVariant: null, description: 'Platform license — Q4', created: '14 Nov, 09:30' }], payoutMethods: [{ name: 'ACH', enabled: true }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'joshua.brealey@stripe.com', needsAction: true, name: 'Joshua Brealey', id: 'acct_1T28sQCj5aoy4QQA', created: '18 Feb, 11:25', phone: '-', country: 'United States', recipientType: 'Individual', legalFirstName: 'Joshua', legalLastName: 'Brealey', address: ['1 Hacker Way', 'Menlo Park, CA 94025'], destination: { label: 'Bank Account  ····  6789', currency: 'USD', id: 'usba_test_6...789U', bankName: 'Stripe Test Bank', routingNumber: '110000000', countryCode: 'US', last4: '6789' }, transactions: [{ amount: 'US$1.00', status: 'Failed', statusVariant: 'danger', description: '—', created: '26 Feb, 10:56' }, { amount: 'US$1.00', status: null, statusVariant: null, description: '—', created: '25 Feb, 09:52' }], payoutMethods: [{ name: 'ACH', enabled: true }, { name: 'Wire', enabled: false }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: true }] },
  { email: 'tanaka.yuki@fastmail.jp', needsAction: false, name: 'Tanaka Yuki', id: 'acct_1T28gkCj5a0N35Sx', created: '18 Feb, 11:13', phone: '+81 3-1234-5678', country: 'Japan', recipientType: 'Individual', legalFirstName: 'Yuki', legalLastName: 'Tanaka', address: ['1-1-1 Shibuya', 'Tokyo, 150-0002'], destination: { label: 'Bank Account  ····  9012', currency: 'USD', id: 'usba_test_9...012V', bankName: 'MUFG Bank', routingNumber: '021001088', countryCode: 'JP', last4: '9012' }, transactions: [{ amount: 'US$3,200.00', status: null, statusVariant: null, description: 'Translation services', created: '12 Feb, 11:00' }], payoutMethods: [{ name: 'ACH', enabled: false }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'lisa.li@stripe.com', needsAction: true, name: 'Lisa Li', id: 'acct_1T1uqWCj5anv7zu0', created: '17 Feb, 20:26', phone: '-', country: 'United States', recipientType: 'Individual', legalFirstName: 'Lisa', legalLastName: 'Li', address: ['510 Townsend Street', 'San Francisco, CA 94103'], destination: { label: 'Bank Account  ····  2288', currency: 'USD', id: 'usba_test_2...288W', bankName: 'Bank of America', routingNumber: '026009593', countryCode: 'US', last4: '2288' }, transactions: [], payoutMethods: [{ name: 'ACH', enabled: true }, { name: 'Wire', enabled: false }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'finance@buildright.io', needsAction: true, name: 'BuildRight Inc', id: 'acct_1T1ov6Cj5asthruG', created: '17 Feb, 14:06', phone: '+1 650-555-0177', country: 'United States', recipientType: 'Company', legalFirstName: '—', legalLastName: '—', address: ['200 University Ave', 'Palo Alto, CA 94301'], destination: { label: 'Bank Account  ····  5567', currency: 'USD', id: 'usba_test_5...567X', bankName: 'Silicon Valley Bank', routingNumber: '121140399', countryCode: 'US', last4: '5567' }, transactions: [{ amount: 'US$12,500.00', status: null, statusVariant: null, description: 'Integration setup', created: '14 Feb, 16:30' }], payoutMethods: [{ name: 'ACH', enabled: true }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'priya.patel@outlook.com', needsAction: true, name: 'Priya Patel', id: 'acct_1T1ouaCj5aCW8ZYT', created: '17 Feb, 14:06', phone: '+91 98765 43210', country: 'India', recipientType: 'Individual', legalFirstName: 'Priya', legalLastName: 'Patel', address: ['42 MG Road', 'Mumbai, 400001'], destination: { label: 'Bank Account  ····  1199', currency: 'USD', id: 'usba_test_1...199Y', bankName: 'HDFC Bank', routingNumber: '021001088', countryCode: 'IN', last4: '1199' }, transactions: [{ amount: 'US$750.00', status: 'Failed', statusVariant: 'danger', description: 'Freelance dev work', created: '15 Feb, 22:10' }], payoutMethods: [{ name: 'ACH', enabled: false }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'ops@launchpad.dev', needsAction: true, name: '—', id: 'acct_1T1ou3Cj5aug8tAV', created: '17 Feb, 14:05', phone: '+1 310-555-0134', country: 'United States', recipientType: 'Company', legalFirstName: '—', legalLastName: '—', address: ['900 Wilshire Blvd', 'Los Angeles, CA 90017'], destination: { label: 'Bank Account  ····  8845', currency: 'USD', id: 'usba_test_8...845Z', bankName: 'Citibank', routingNumber: '322271627', countryCode: 'US', last4: '8845' }, transactions: [], payoutMethods: [{ name: 'ACH', enabled: true }, { name: 'Wire', enabled: false }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'samuel.okafor@gmail.com', needsAction: false, name: 'Samuel Okafor', id: 'acct_1T03rSCj5aZBvMar', created: '12 Feb, 17:39', phone: '+234 802 345 6789', country: 'Nigeria', recipientType: 'Individual', legalFirstName: 'Samuel', legalLastName: 'Okafor', address: ['15 Marina Road', 'Lagos, 100001'], destination: { label: 'Bank Account  ····  3344', currency: 'USD', id: 'usba_test_3...344A', bankName: 'GT Bank', routingNumber: '021001088', countryCode: 'NG', last4: '3344' }, transactions: [{ amount: 'US$500.00', status: null, statusVariant: null, description: 'Content writing', created: '10 Feb, 08:15' }, { amount: 'US$500.00', status: null, statusVariant: null, description: 'Content writing', created: '10 Jan, 09:00' }], payoutMethods: [{ name: 'ACH', enabled: false }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'anna.mueller@designlab.de', needsAction: false, name: 'Anna Mueller', id: 'acct_1SzgVTCj5aiN1Can', created: '11 Feb, 16:43', phone: '+49 30 1234567', country: 'Germany', recipientType: 'Individual', legalFirstName: 'Anna', legalLastName: 'Mueller', address: ['Friedrichstraße 43', 'Berlin, 10117'], destination: { label: 'Bank Account  ····  6677', currency: 'EUR', id: 'usba_test_6...677B', bankName: 'Deutsche Bank', routingNumber: '100700024', countryCode: 'DE', last4: '6677' }, transactions: [{ amount: '€4,200.00', status: null, statusVariant: null, description: 'UX research — Jan', created: '8 Feb, 14:30' }], payoutMethods: [{ name: 'ACH', enabled: false }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'carlos.silva@rapidgrow.com', needsAction: true, name: 'Carlos Silva', id: 'acct_1SxuMjCj5aQgT9tr', created: '6 Feb, 19:06', phone: '+55 11 98765-4321', country: 'Brazil', recipientType: 'Individual', legalFirstName: 'Carlos', legalLastName: 'Silva', address: ['Av Paulista 1578', 'São Paulo, 01310-200'], destination: { label: 'Bank Account  ····  5500', currency: 'USD', id: 'usba_test_5...500C', bankName: 'Banco do Brasil', routingNumber: '021001088', countryCode: 'BR', last4: '5500' }, transactions: [{ amount: 'US$1,800.00', status: 'Failed', statusVariant: 'danger', description: 'Marketing services', created: '4 Feb, 11:45' }], payoutMethods: [{ name: 'ACH', enabled: false }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'billing@scalefast.io', needsAction: false, name: 'ScaleFast Technologies', id: 'acct_1Sxu7ECj5as19EL6', created: '6 Feb, 18:50', phone: '+1 408-555-0165', country: 'United States', recipientType: 'Company', legalFirstName: '—', legalLastName: '—', address: ['100 Enterprise Way', 'Sunnyvale, CA 94085'], destination: { label: 'Bank Account  ····  2211', currency: 'USD', id: 'usba_test_2...211D', bankName: 'First Republic', routingNumber: '321081669', countryCode: 'US', last4: '2211' }, transactions: [{ amount: 'US$22,000.00', status: null, statusVariant: null, description: 'Enterprise license', created: '5 Feb, 09:00' }, { amount: 'US$22,000.00', status: null, statusVariant: null, description: 'Enterprise license', created: '5 Nov, 09:00' }], payoutMethods: [{ name: 'ACH', enabled: true }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: true }] },
  { email: 'sophie.dubois@company.fr', needsAction: true, name: 'Sophie Dubois', id: 'acct_1Sxu1SCj5agXhECn', created: '6 Feb, 18:44', phone: '+33 1 42 68 53 00', country: 'France', recipientType: 'Individual', legalFirstName: 'Sophie', legalLastName: 'Dubois', address: ['27 Rue de Rivoli', 'Paris, 75004'], destination: { label: 'Bank Account  ····  8899', currency: 'EUR', id: 'usba_test_8...899E', bankName: 'BNP Paribas', routingNumber: '30004', countryCode: 'FR', last4: '8899' }, transactions: [], payoutMethods: [{ name: 'ACH', enabled: false }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'raj.kumar@freelance.in', needsAction: false, name: 'Raj Kumar', id: 'acct_1Sxq1DCj5aEQevTh', created: '6 Feb, 14:28', phone: '+91 99887 76655', country: 'India', recipientType: 'Individual', legalFirstName: 'Raj', legalLastName: 'Kumar', address: ['14 Connaught Place', 'New Delhi, 110001'], destination: { label: 'Bank Account  ····  4433', currency: 'USD', id: 'usba_test_4...433F', bankName: 'ICICI Bank', routingNumber: '021001088', countryCode: 'IN', last4: '4433' }, transactions: [{ amount: 'US$950.00', status: null, statusVariant: null, description: 'Backend development', created: '3 Feb, 16:00' }], payoutMethods: [{ name: 'ACH', enabled: false }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'crypto@walletco.com', needsAction: false, name: 'WalletCo USDC Vault', id: 'acct_1SxfTPCj5ayMTFuG', created: '6 Feb, 03:12', phone: '+1 628-555-0199', country: 'United States', recipientType: 'Company', legalFirstName: '—', legalLastName: '—', address: ['500 Howard Street', 'San Francisco, CA 94105'], destination: { label: 'Crypto Wallet  ····  a4f2', currency: 'USDC', id: 'usba_test_a...4f2G', bankName: 'Circle', routingNumber: '—', countryCode: 'US', last4: 'a4f2' }, transactions: [{ amount: 'USDC 5,000.00', status: null, statusVariant: null, description: 'USDC settlement', created: '5 Feb, 03:12' }], payoutMethods: [{ name: 'ACH', enabled: false }, { name: 'Wire', enabled: false }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: true }] },
  { email: 'james.wilson@hey.com', needsAction: false, name: 'James Wilson', id: 'acct_1SxZRuCj5afNMPPB', created: '5 Feb, 20:46', phone: '+61 412 345 678', country: 'Australia', recipientType: 'Individual', legalFirstName: 'James', legalLastName: 'Wilson', address: ['42 George Street', 'Sydney, NSW 2000'], destination: { label: 'Bank Account  ····  7766', currency: 'USD', id: 'usba_test_7...766H', bankName: 'Commonwealth Bank', routingNumber: '021001088', countryCode: 'AU', last4: '7766' }, transactions: [{ amount: 'US$6,800.00', status: null, statusVariant: null, description: 'Implementation services', created: '3 Feb, 20:46' }], payoutMethods: [{ name: 'ACH', enabled: false }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'marie.laurent@startup.fr', needsAction: false, name: 'Marie Laurent', id: 'acct_1SxTg1Cj5a21HrWM', created: '5 Feb, 14:37', phone: '+33 6 12 34 56 78', country: 'France', recipientType: 'Individual', legalFirstName: 'Marie', legalLastName: 'Laurent', address: ['5 Place de la Bourse', 'Lyon, 69002'], destination: { label: 'Bank Account  ····  1122', currency: 'EUR', id: 'usba_test_1...122I', bankName: 'Société Générale', routingNumber: '30003', countryCode: 'FR', last4: '1122' }, transactions: [{ amount: '€3,750.00', status: null, statusVariant: null, description: 'Data migration', created: '2 Feb, 14:37' }], payoutMethods: [{ name: 'ACH', enabled: false }, { name: 'Wire', enabled: true }, { name: 'Instant-to-card', enabled: false }, { name: 'Stablecoin', enabled: false }] },
  { email: 'hello@craftshop.com', needsAction: false, name: 'CraftShop Studio', id: 'acct_1SwRWlCj5asA8LNn', created: '2 Feb, 18:07', phone: '+1 503-555-0188', country: 'United States', recipientType: 'Company', legalFirstName: '—', legalLastName: '—', address: ['820 NW 6th Avenue', 'Portland, OR 97209'], destination: { label: 'Bank Account  ····  9988', currency: 'USD', id: 'usba_test_9...988J', bankName: 'US Bank', routingNumber: '123000220', countryCode: 'US', last4: '9988' }, transactions: [{ amount: 'US$399.00', status: null, statusVariant: null, description: 'Business plan — monthly', created: '1 Feb, 18:07' }, { amount: 'US$399.00', status: null, statusVariant: null, description: 'Business plan — monthly', created: '1 Jan, 18:07' }], payoutMethods: [{ name: 'ACH', enabled: true }, { name: 'Wire', enabled: false }, { name: 'Instant-to-card', enabled: true }, { name: 'Stablecoin', enabled: false }] },
];

const performanceCards = [
  'Total payouts sent',
  'Total payout volume',
  'Percentage of payouts posted',
  'New recipients added',
];

const recipientPayouts = [
  { amount: 'US$15,000.00', status: 'Posted', statusVariant: 'success', email: 'ap@meridiangroup.com', description: 'Platform license — Q1', created: '28 Feb, 09:00' },
  { amount: 'US$6,800.00', status: 'Posted', statusVariant: 'success', email: 'james.wilson@hey.com', description: 'Implementation services', created: '27 Feb, 14:22' },
  { amount: 'US$1.00', status: 'Failed', statusVariant: 'danger', email: 'joshua.brealey@stripe.com', description: '—', created: '26 Feb, 10:56' },
  { amount: 'US$2,500.00', status: 'Posted', statusVariant: 'success', email: 'maria.garcia@acmecorp.com', description: 'Monthly contractor fee', created: '26 Feb, 08:30' },
  { amount: '€4,200.00', status: 'Posted', statusVariant: 'success', email: 'anna.mueller@designlab.de', description: 'UX research — Feb', created: '25 Feb, 16:45' },
  { amount: 'US$1.00', status: 'Posted', statusVariant: 'success', email: 'joshua.brealey@stripe.com', description: '—', created: '25 Feb, 09:52' },
  { amount: 'US$22,000.00', status: 'Posted', statusVariant: 'success', email: 'billing@scalefast.io', description: 'Enterprise license', created: '24 Feb, 11:00' },
  { amount: 'US$950.00', status: 'Posted', statusVariant: 'success', email: 'raj.kumar@freelance.in', description: 'Backend development', created: '23 Feb, 16:00' },
  { amount: '£1,200.00', status: 'Failed', statusVariant: 'danger', email: 'emma.johnson@techstart.io', description: 'Design services', created: '22 Feb, 14:20' },
  { amount: 'US$8,400.00', status: 'Posted', statusVariant: 'success', email: 'chen.wei@globaltrade.cn', description: 'Consulting — Q1', created: '21 Feb, 09:15' },
  { amount: 'US$500.00', status: 'Posted', statusVariant: 'success', email: 'samuel.okafor@gmail.com', description: 'Content writing', created: '20 Feb, 08:15' },
  { amount: '€3,750.00', status: 'Posted', statusVariant: 'success', email: 'marie.laurent@startup.fr', description: 'Data migration', created: '19 Feb, 14:37' },
  { amount: 'US$12,500.00', status: 'Posted', statusVariant: 'success', email: 'finance@buildright.io', description: 'Integration setup', created: '18 Feb, 16:30' },
  { amount: 'US$3,200.00', status: 'Posted', statusVariant: 'success', email: 'tanaka.yuki@fastmail.jp', description: 'Translation services', created: '17 Feb, 11:00' },
  { amount: 'US$750.00', status: 'Failed', statusVariant: 'danger', email: 'priya.patel@outlook.com', description: 'Freelance dev work', created: '16 Feb, 22:10' },
  { amount: 'USDC 5,000.00', status: 'Posted', statusVariant: 'success', email: 'crypto@walletco.com', description: 'USDC settlement', created: '15 Feb, 03:12' },
  { amount: 'US$399.00', status: 'Posted', statusVariant: 'success', email: 'hello@craftshop.com', description: 'Business plan — monthly', created: '14 Feb, 18:07' },
  { amount: 'US$1,800.00', status: 'Failed', statusVariant: 'danger', email: 'carlos.silva@rapidgrow.com', description: 'Marketing services', created: '13 Feb, 11:45' },
  { amount: 'US$15,000.00', status: 'Posted', statusVariant: 'success', email: 'ap@meridiangroup.com', description: 'Platform license — Q4', created: '12 Feb, 09:30' },
  { amount: 'US$2,500.00', status: 'Posted', statusVariant: 'success', email: 'maria.garcia@acmecorp.com', description: 'Monthly contractor fee', created: '11 Feb, 10:30' },
  { amount: 'US$500.00', status: 'Posted', statusVariant: 'success', email: 'samuel.okafor@gmail.com', description: 'Content writing', created: '10 Feb, 09:00' },
  { amount: 'US$22,000.00', status: 'Posted', statusVariant: 'success', email: 'billing@scalefast.io', description: 'Enterprise license', created: '9 Feb, 09:00' },
  { amount: 'US$399.00', status: 'Posted', statusVariant: 'success', email: 'hello@craftshop.com', description: 'Business plan — monthly', created: '8 Feb, 18:07' },
  { amount: 'US$6,800.00', status: 'Posted', statusVariant: 'success', email: 'james.wilson@hey.com', description: 'Implementation services', created: '7 Feb, 20:46' },
];

function StatusBar({ states, total }) {
  return (
    <div className="flex h-[10px] rounded-full overflow-hidden w-full">
      {states.map((state) => {
        const pct = total > 0 ? (state.count / total) * 100 : 0;
        if (pct === 0) return null;
        return (
          <div
            key={state.label}
            className={`${state.color} h-full`}
            style={{ width: `${pct}%` }}
          />
        );
      })}
    </div>
  );
}

export default function GlobalPayouts() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [activePayoutStatus, setActivePayoutStatus] = useState('All');
  const [activeRecipientStatus, setActiveRecipientStatus] = useState('All recipients');
  const [showSendModal, setShowSendModal] = useState(false);
  const navigate = useNavigate();
  const basePath = useBasePath();
  const { payouts: userPayouts, addPayout, userRecipients, addRecipient, variant } = usePayouts();
  const isNewUser = variant === 'new-user';
  const allRecipientPayouts = [...userPayouts.map(toRecipientPayoutItem), ...(isNewUser ? [] : recipientPayouts)];
  const allRecipients = [...userRecipients, ...(isNewUser ? [] : recipients)];

  // Compute dynamic recipient status counts
  const userReady = userRecipients.filter((r) => !r.needsAction).length;
  const userNeedsAction = userRecipients.filter((r) => r.needsAction).length;
  const dynamicRecipientStatusTabs = isNewUser
    ? [
        { label: 'All recipients', count: allRecipients.length },
        { label: 'Ready', count: userReady },
        { label: 'Needs action', count: userNeedsAction },
        { label: 'Pending', count: 0 },
        { label: 'Rejected', count: 0 },
      ]
    : [
        { label: 'All recipients', count: 133 + userRecipients.length },
        { label: 'Ready', count: 79 + userReady },
        { label: 'Needs action', count: 53 + userNeedsAction },
        { label: 'Pending', count: 1 },
        { label: 'Rejected', count: 0 },
      ];

  const payoutTotal = payoutStates.reduce((sum, s) => sum + s.count, 0);
  const recipientTotal = recipientStates.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-display-small text-default">Global Payouts</h1>
          <Badge>
            <span className="flex items-center gap-1">
              Preview
              <Icon name="lab" size="xsmall" fill="currentColor" />
            </span>
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'Recipients' ? (
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-button-primary-bg text-button-primary-text rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
              <Icon name="add" size="xsmall" fill="currentColor" />
              <span className="text-label-small-emphasized">Add recipient</span>
              <span className="w-4 h-4 rounded bg-white/20 flex items-center justify-center text-[9px] font-bold">N</span>
            </button>
          ) : (
            <>
              <button onClick={() => setShowSendModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-button-primary-bg text-button-primary-text rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
                <Icon name="send" size="xsmall" fill="currentColor" />
                <span className="text-label-small-emphasized">Send money</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-default hover:bg-offset transition-colors cursor-pointer">
                <Icon name="add" size="xsmall" fill="currentColor" />
                <span className="text-label-small-emphasized">Add money</span>
              </button>
              <button className="flex items-center justify-center w-8 h-8 border border-border rounded-lg text-default hover:bg-offset transition-colors cursor-pointer">
                <Icon name="more" size="small" fill="currentColor" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-label-medium cursor-pointer ${
              activeTab === tab
                ? 'text-brand text-label-medium-emphasized border-b-2 border-brand'
                : 'text-subdued hover:text-default'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <>
          {/* Financial account */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-medium text-default">Financial account</h2>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-label-small text-default hover:bg-offset transition-colors cursor-pointer">
                All currencies
                <Icon name="chevronDown" size="xsmall" fill="currentColor" className="text-icon-subdued" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {currencies.map((currency) => (
                <div key={currency.code} className="border border-border rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[16px]">{currency.flag}</span>
                    <span className="text-label-medium-emphasized text-default">{currency.amount}</span>
                    <span className="text-label-medium text-subdued">{currency.code}</span>
                  </div>
                  <p className="text-body-small text-subdued">{currency.available}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Current status */}
          <div className="mb-10">
            <h2 className="text-heading-medium text-default mb-5">Current status</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Payout states */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-label-medium-emphasized text-default">Payout states today</span>
                  <Icon name="info" size="xsmall" fill="currentColor" className="text-icon-subdued" />
                </div>
                <div className="mb-3">
                  <StatusBar states={payoutStates} total={payoutTotal} />
                </div>
                <div className="space-y-1.5">
                  {payoutStates.map((state) => (
                    <div key={state.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-sm ${state.color}`} />
                        <span className="text-body-small text-default">{state.label}</span>
                      </div>
                      <span className="text-body-small text-default">{state.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipient states */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-label-medium-emphasized text-default">Recipient states today</span>
                  <Icon name="info" size="xsmall" fill="currentColor" className="text-icon-subdued" />
                </div>
                <div className="mb-3">
                  <StatusBar states={recipientStates} total={recipientTotal} />
                </div>
                <div className="space-y-1.5">
                  {recipientStates.map((state) => (
                    <div key={state.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-sm ${state.color}`} />
                        <span className="text-body-small text-default">{state.label}</span>
                      </div>
                      <span className="text-body-small text-default">{state.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Historical performance */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-heading-medium text-default">Historical performance</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-label-small text-default hover:bg-offset transition-colors cursor-pointer">
                  Last 3 months
                  <Icon name="chevronDown" size="xsmall" fill="currentColor" className="text-icon-subdued" />
                </button>
                <span className="text-body-small text-subdued">compared to</span>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-label-small text-default hover:bg-offset transition-colors cursor-pointer">
                  Previous period
                  <Icon name="chevronDown" size="xsmall" fill="currentColor" className="text-icon-subdued" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {performanceCards.map((title) => (
                <div key={title} className="border-2 border-dashed border-border rounded-lg p-5">
                  <div className="flex items-center gap-1.5 mb-6">
                    <span className="text-label-small-emphasized text-default">{title}</span>
                    <Icon name="info" size="xsmall" fill="currentColor" className="text-icon-subdued" />
                  </div>
                  <div className="flex items-center justify-center py-4">
                    <Badge>Not available for test accounts</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'Payouts to recipients' && (
        <>
          {/* Status tabs */}
          <div className="flex gap-3 mb-5">
            {recipientPayoutStatusTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActivePayoutStatus(tab.label)}
                className={`flex-1 px-4 py-3 text-left border rounded-lg cursor-pointer transition-colors ${
                  activePayoutStatus === tab.label
                    ? 'border-brand bg-brand-25'
                    : 'border-border hover:bg-offset'
                }`}
              >
                <span className={`text-label-medium-emphasized ${activePayoutStatus === tab.label ? 'text-brand' : 'text-default'}`}>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Filters row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 flex-wrap">
              {recipientPayoutFilters.map((filter) => (
                <button
                  key={filter}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-label-small text-subdued hover:bg-offset transition-colors cursor-pointer"
                >
                  <Icon name="add" size="xsmall" fill="currentColor" />
                  {filter}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer shrink-0">
              <Icon name="export" size="small" fill="currentColor" />
              Export
            </button>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '26%' }}>Amount</th>
                <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '26%' }}>Email</th>
                <th className="pb-3 text-label-small text-subdued font-normal pr-4">Description</th>
                <th className="pb-3 text-label-small text-subdued font-normal text-right" style={{ width: '16%' }}>Created date</th>
              </tr>
            </thead>
            <tbody>
              {allRecipientPayouts.map((item, index) => (
                <tr key={index} onClick={() => navigate(`${basePath}/financial-payouts/${item.id || `obp_${index}`}`)} className="border-b border-border hover:bg-offset transition-colors cursor-pointer h-10">
                  <td className="pr-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-label-medium-emphasized text-default">{item.amount}</span>
                      <Badge variant={item.statusVariant}>{item.status}</Badge>
                    </div>
                  </td>
                  <td className="pr-4 text-body-small text-default overflow-hidden text-ellipsis whitespace-nowrap">{item.email}</td>
                  <td className="pr-4 text-body-small text-subdued overflow-hidden text-ellipsis whitespace-nowrap">{item.description}</td>
                  <td className="text-body-small text-subdued text-right">{item.created}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <button disabled className="px-3 py-1.5 border border-border rounded-lg text-label-small text-subdued cursor-not-allowed opacity-50">
              Previous
            </button>
            <button className="px-3 py-1.5 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer">
              Next
            </button>
          </div>
        </>
      )}

      {activeTab === 'Recipients' && (
        <>
          {/* Status tabs */}
          <div className="flex gap-3 mb-5">
            {dynamicRecipientStatusTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveRecipientStatus(tab.label)}
                className={`flex-1 px-4 py-3 text-left border rounded-lg cursor-pointer transition-colors ${
                  activeRecipientStatus === tab.label
                    ? 'border-brand bg-brand-25'
                    : 'border-border hover:bg-offset'
                }`}
              >
                <div className={`text-label-small ${activeRecipientStatus === tab.label ? 'text-brand' : 'text-subdued'}`}>{tab.label}</div>
                <div className={`text-heading-medium ${activeRecipientStatus === tab.label ? 'text-brand' : 'text-default'}`}>{tab.count}</div>
              </button>
            ))}
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-2 flex-wrap mb-5">
            {recipientFilters.map((filter) => (
              <button
                key={filter}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-label-small text-subdued hover:bg-offset transition-colors cursor-pointer"
              >
                <Icon name="add" size="xsmall" fill="currentColor" />
                {filter}
              </button>
            ))}
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '30%' }}>
                  <span className="flex items-center gap-1 cursor-pointer">Email address <Icon name="arrowDown" size="xsmall" fill="currentColor" className="text-icon-subdued" /></span>
                </th>
                <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '18%' }}>
                  <span className="flex items-center gap-1 cursor-pointer">Name <Icon name="arrowDown" size="xsmall" fill="currentColor" className="text-icon-subdued" /></span>
                </th>
                <th className="pb-3 text-label-small text-subdued font-normal pr-4">
                  <span className="flex items-center gap-1 cursor-pointer">ID <Icon name="arrowDown" size="xsmall" fill="currentColor" className="text-icon-subdued" /></span>
                </th>
                <th className="pb-3 text-label-small text-subdued font-normal text-right" style={{ width: '14%' }}>
                  <span className="flex items-center gap-1 justify-end cursor-pointer">Created <Icon name="arrowDown" size="xsmall" fill="currentColor" className="text-icon-subdued" /></span>
                </th>
                <th className="pb-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {allRecipients.map((recipient, index) => (
                <tr key={index} onClick={() => navigate(`${basePath}/recipients/${recipient.id}`)} className="border-b border-border hover:bg-offset transition-colors cursor-pointer h-10">
                  <td className="pr-4 overflow-hidden">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span className="text-body-small text-default overflow-hidden text-ellipsis">{recipient.email}</span>
                      {recipient.needsAction && <Badge variant="warning" className="whitespace-nowrap shrink-0">Information needed</Badge>}
                    </div>
                  </td>
                  <td className="pr-4 text-body-small text-default overflow-hidden text-ellipsis whitespace-nowrap">{recipient.name}</td>
                  <td className="pr-4 text-body-small text-default overflow-hidden text-ellipsis whitespace-nowrap">{recipient.id}</td>
                  <td className="text-body-small text-subdued text-right">{recipient.created}</td>
                  <td>
                    <button className="text-icon-subdued hover:text-default cursor-pointer">
                      <Icon name="more" size="small" fill="currentColor" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <button disabled className="px-3 py-1.5 border border-border rounded-lg text-label-small text-subdued cursor-not-allowed opacity-50">
              Previous
            </button>
            <button className="px-3 py-1.5 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer">
              Next
            </button>
          </div>
        </>
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

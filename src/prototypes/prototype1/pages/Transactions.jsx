import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasePath } from '../../../contexts/BasePath';
import { Icon } from '../../../icons/SailIcons';
import Badge from '../../../components/Badge';
import { usePayouts, toFinancialActivityItem } from '../PayoutsContext';

const tabs = ['Payments', 'Payouts', 'Top-ups', 'All activity'];

const statusTabs = [
  { label: 'All', count: 30 },
  { label: 'Succeeded', count: 24 },
  { label: 'Refunded', count: 2 },
  { label: 'Disputed', count: 1 },
  { label: 'Failed', count: 3 },
  { label: 'Uncaptured', count: 0 },
];

const filters = ['Date and time', 'Amount', 'Currency', 'Status', 'Payment method', 'More filters'];

const transactions = [
  { amount: 'US$4,250.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 4242', paymentBrand: 'visa', description: 'Enterprise plan — annual', customer: 'sarah@acmecorp.com', date: '1 Mar, 14:22', refundedDate: '—', declineReason: '—' },
  { amount: 'US$89.99', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 1234', paymentBrand: 'mastercard', description: 'Pro subscription', customer: 'mike.chen@gmail.com', date: '1 Mar, 11:05', refundedDate: '—', declineReason: '—' },
  { amount: 'US$12,500.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 8891', paymentBrand: 'visa', description: 'Custom integration setup', customer: 'billing@techstart.io', date: '1 Mar, 09:18', refundedDate: '—', declineReason: '—' },
  { amount: 'US$299.00', currency: 'USD', status: 'Failed', statusVariant: 'danger', paymentMethod: '•••• 5567', paymentBrand: 'visa', description: 'Team plan — monthly', customer: 'admin@flowworks.co', date: '28 Feb, 23:41', refundedDate: '—', declineReason: 'Insufficient funds' },
  { amount: 'US$1,750.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 9012', paymentBrand: 'amex', description: 'Consulting hours — Feb', customer: 'ap@meridian.com', date: '28 Feb, 18:30', refundedDate: '—', declineReason: '—' },
  { amount: 'US$49.99', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 3344', paymentBrand: 'mastercard', description: 'Starter plan', customer: 'julia.west@outlook.com', date: '28 Feb, 16:12', refundedDate: '—', declineReason: '—' },
  { amount: 'US$8,400.00', currency: 'USD', status: 'Refunded', statusVariant: 'warning', paymentMethod: '•••• 7788', paymentBrand: 'visa', description: 'Platform license — Q1', customer: 'procurement@bigretail.com', date: '28 Feb, 14:55', refundedDate: '1 Mar, 10:20', declineReason: '—' },
  { amount: 'US$199.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 2468', paymentBrand: 'visa', description: 'Pro plan upgrade', customer: 'tom.baker@hey.com', date: '28 Feb, 12:08', refundedDate: '—', declineReason: '—' },
  { amount: 'US$3,200.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 1357', paymentBrand: 'amex', description: 'API usage — overage', customer: 'devops@scalefast.io', date: '27 Feb, 22:45', refundedDate: '—', declineReason: '—' },
  { amount: 'US$59.00', currency: 'USD', status: 'Failed', statusVariant: 'danger', paymentMethod: '•••• 6699', paymentBrand: 'mastercard', description: 'Basic plan renewal', customer: 'nadia.k@proton.me', date: '27 Feb, 19:33', refundedDate: '—', declineReason: 'Card expired' },
  { amount: 'US$15,000.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 4455', paymentBrand: 'visa', description: 'Annual contract — renewal', customer: 'finance@globaledge.com', date: '27 Feb, 15:20', refundedDate: '—', declineReason: '—' },
  { amount: 'US$749.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 8023', paymentBrand: 'visa', description: 'Growth plan — annual', customer: 'ops@launchpad.dev', date: '27 Feb, 11:47', refundedDate: '—', declineReason: '—' },
  { amount: 'US$2,100.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 3190', paymentBrand: 'amex', description: 'White-label license', customer: 'legal@partnerco.com', date: '26 Feb, 20:15', refundedDate: '—', declineReason: '—' },
  { amount: 'US$129.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 5522', paymentBrand: 'mastercard', description: 'Pro add-on — analytics', customer: 'data@insightshq.com', date: '26 Feb, 17:40', refundedDate: '—', declineReason: '—' },
  { amount: 'US$6,800.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 9977', paymentBrand: 'visa', description: 'Implementation services', customer: 'cto@newventure.co', date: '26 Feb, 14:02', refundedDate: '—', declineReason: '—' },
  { amount: 'US$399.00', currency: 'USD', status: 'Disputed', statusVariant: 'warning', paymentMethod: '•••• 1188', paymentBrand: 'visa', description: 'Business plan — monthly', customer: 'hello@craftshop.com', date: '26 Feb, 10:28', refundedDate: '—', declineReason: '—' },
  { amount: 'US$89.99', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 7744', paymentBrand: 'mastercard', description: 'Pro subscription', customer: 'alex.rivera@fastmail.com', date: '25 Feb, 21:55', refundedDate: '—', declineReason: '—' },
  { amount: 'US$22,000.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 6230', paymentBrand: 'amex', description: 'Enterprise — custom deal', customer: 'vp@megacorp.com', date: '25 Feb, 16:10', refundedDate: '—', declineReason: '—' },
  { amount: 'US$1,200.00', currency: 'USD', status: 'Refunded', statusVariant: 'warning', paymentMethod: '•••• 4411', paymentBrand: 'visa', description: 'Consulting — cancelled', customer: 'pm@buildright.io', date: '25 Feb, 13:44', refundedDate: '26 Feb, 09:15', declineReason: '—' },
  { amount: 'US$499.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 2299', paymentBrand: 'visa', description: 'Team plan — annual', customer: 'team@designlab.co', date: '25 Feb, 08:30', refundedDate: '—', declineReason: '—' },
  { amount: 'US$75.00', currency: 'USD', status: 'Failed', statusVariant: 'danger', paymentMethod: '•••• 8866', paymentBrand: 'mastercard', description: 'Starter plan renewal', customer: 'freelancer@mail.com', date: '24 Feb, 22:18', refundedDate: '—', declineReason: 'Do not honor' },
  { amount: 'US$5,500.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 1100', paymentBrand: 'visa', description: 'Platform fee — Feb', customer: 'billing@saasplatform.com', date: '24 Feb, 17:05', refundedDate: '—', declineReason: '—' },
  { amount: 'US$249.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 3377', paymentBrand: 'amex', description: 'Growth plan — monthly', customer: 'cfo@rapidgrow.com', date: '24 Feb, 14:32', refundedDate: '—', declineReason: '—' },
  { amount: 'US$950.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 5544', paymentBrand: 'visa', description: 'Support package — premium', customer: 'support@clientfirst.com', date: '24 Feb, 10:50', refundedDate: '—', declineReason: '—' },
  { amount: 'US$3,750.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 9988', paymentBrand: 'mastercard', description: 'Data migration service', customer: 'it@movingfast.co', date: '23 Feb, 19:25', refundedDate: '—', declineReason: '—' },
  { amount: 'US$149.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 2211', paymentBrand: 'visa', description: 'Pro plan — monthly', customer: 'sam.lee@company.com', date: '23 Feb, 15:40', refundedDate: '—', declineReason: '—' },
  { amount: 'US$10,200.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 6677', paymentBrand: 'amex', description: 'Annual license — 5 seats', customer: 'admin@digitalagency.com', date: '23 Feb, 11:12', refundedDate: '—', declineReason: '—' },
  { amount: 'US$599.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 4488', paymentBrand: 'visa', description: 'Business plan — annual', customer: 'founder@earlystage.io', date: '22 Feb, 20:08', refundedDate: '—', declineReason: '—' },
  { amount: 'US$1,000.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 0077', paymentBrand: 'visa', description: 'Invoice #1042', customer: 'ar@warehouse.com', date: '22 Feb, 16:35', refundedDate: '—', declineReason: '—' },
  { amount: 'US$2,800.00', currency: 'USD', status: 'Succeeded', statusVariant: 'success', paymentMethod: '•••• 3366', paymentBrand: 'mastercard', description: 'Training workshop — 2 day', customer: 'hr@learncorp.com', date: '22 Feb, 09:50', refundedDate: '—', declineReason: '—' },
];

const columns = [
  { key: 'amount', header: 'Amount', width: '22%' },
  { key: 'paymentMethod', header: 'Payment method', width: '12%' },
  { key: 'description', header: 'Description', width: '15%' },
  { key: 'customer', header: 'Customer', width: '16%' },
  { key: 'date', header: 'Date', width: '12%' },
  { key: 'refundedDate', header: 'Refunded date', width: '11%' },
  { key: 'declineReason', header: 'Decline reason', width: '12%' },
];

export const payouts = [
  { amount: 'US$965.70', currency: 'USD', status: 'Paid', statusVariant: 'success', destination: 'STRIPE TEST BANK  ····  6789', arriveBy: '17 Feb' },
  { amount: 'US$12,450.00', currency: 'USD', status: 'Paid', statusVariant: 'success', destination: 'DEPOSIT ACCOUNT  ····  1234', arriveBy: '16 Feb' },
  { amount: 'US$8,320.55', currency: 'USD', status: 'Paid', statusVariant: 'success', destination: 'SAVING  ····  4567', arriveBy: '15 Feb' },
  { amount: 'US$3,100.00', currency: 'USD', status: 'In transit', statusVariant: 'info', destination: 'STRIPE TEST BANK  ····  6789', arriveBy: '14 Feb' },
  { amount: 'US$6,780.25', currency: 'USD', status: 'Paid', statusVariant: 'success', destination: 'DEPOSIT ACCOUNT  ····  1234', arriveBy: '13 Feb' },
  { amount: 'US$1,250.00', currency: 'USD', status: 'Paid', statusVariant: 'success', destination: 'STRIPE TEST BANK  ····  6789', arriveBy: '12 Feb' },
  { amount: 'US$22,100.80', currency: 'USD', status: 'Paid', statusVariant: 'success', destination: 'SAVING  ····  4567', arriveBy: '11 Feb' },
  { amount: 'US$4,590.00', currency: 'USD', status: 'Paid', statusVariant: 'success', destination: 'DEPOSIT ACCOUNT  ····  1234', arriveBy: '10 Feb' },
  { amount: 'US$15,800.30', currency: 'USD', status: 'Paid', statusVariant: 'success', destination: 'STRIPE TEST BANK  ····  6789', arriveBy: '9 Feb' },
  { amount: 'US$2,340.00', currency: 'USD', status: 'Failed', statusVariant: 'danger', destination: 'SAVING  ····  4567', arriveBy: '8 Feb' },
  { amount: 'US$9,870.45', currency: 'USD', status: 'Paid', statusVariant: 'success', destination: 'DEPOSIT ACCOUNT  ····  1234', arriveBy: '7 Feb' },
  { amount: 'US$5,600.00', currency: 'USD', status: 'Paid', statusVariant: 'success', destination: 'STRIPE TEST BANK  ····  6789', arriveBy: '6 Feb' },
  { amount: 'US$18,250.00', currency: 'USD', status: 'Paid', statusVariant: 'success', destination: 'SAVING  ····  4567', arriveBy: '5 Feb' },
  { amount: 'US$730.00', currency: 'USD', status: 'Paid', statusVariant: 'success', destination: 'DEPOSIT ACCOUNT  ····  1234', arriveBy: '4 Feb' },
  { amount: 'US$11,400.90', currency: 'USD', status: 'Paid', statusVariant: 'success', destination: 'STRIPE TEST BANK  ····  6789', arriveBy: '3 Feb' },
];

const payoutFilters = ['Date', 'Amount', 'Status'];

const allActivity = [
  { amount: '-US$965.70', fees: '—', total: '-US$965.70', type: 'Payout', description: 'STRIPE PAYOUT', created: '17 Feb', availableOn: '17 Feb' },
  { amount: 'US$1,000.00', fees: '-US$34.30', total: 'US$965.70', type: 'Charge', description: 'fsd', created: '15 Feb', availableOn: '15 Feb' },
  { amount: '-US$12,450.00', fees: '—', total: '-US$12,450.00', type: 'Payout', description: 'STRIPE PAYOUT', created: '14 Feb', availableOn: '14 Feb' },
  { amount: 'US$4,250.00', fees: '-US$153.75', total: 'US$4,096.25', type: 'Charge', description: 'Enterprise plan — annual', created: '14 Feb', availableOn: '14 Feb' },
  { amount: 'US$89.99', fees: '-US$2.91', total: 'US$87.08', type: 'Charge', description: 'Pro subscription', created: '14 Feb', availableOn: '14 Feb' },
  { amount: 'US$12,500.00', fees: '-US$387.50', total: 'US$12,112.50', type: 'Charge', description: 'Custom integration setup', created: '13 Feb', availableOn: '13 Feb' },
  { amount: '-US$8,320.55', fees: '—', total: '-US$8,320.55', type: 'Payout', description: 'STRIPE PAYOUT', created: '13 Feb', availableOn: '13 Feb' },
  { amount: 'US$1,750.00', fees: '-US$53.75', total: 'US$1,696.25', type: 'Charge', description: 'Consulting hours — Feb', created: '12 Feb', availableOn: '12 Feb' },
  { amount: 'US$49.99', fees: '-US$1.75', total: 'US$48.24', type: 'Charge', description: 'Starter plan', created: '12 Feb', availableOn: '12 Feb' },
  { amount: '-US$6,780.25', fees: '—', total: '-US$6,780.25', type: 'Payout', description: 'STRIPE PAYOUT', created: '11 Feb', availableOn: '11 Feb' },
  { amount: 'US$199.00', fees: '-US$6.07', total: 'US$192.93', type: 'Charge', description: 'Pro plan upgrade', created: '11 Feb', availableOn: '11 Feb' },
  { amount: 'US$3,200.00', fees: '-US$95.80', total: 'US$3,104.20', type: 'Charge', description: 'API usage — overage', created: '10 Feb', availableOn: '10 Feb' },
  { amount: '-US$1,250.00', fees: '—', total: '-US$1,250.00', type: 'Payout', description: 'STRIPE PAYOUT', created: '10 Feb', availableOn: '10 Feb' },
  { amount: 'US$15,000.00', fees: '-US$465.00', total: 'US$14,535.00', type: 'Charge', description: 'Annual contract — renewal', created: '9 Feb', availableOn: '9 Feb' },
  { amount: 'US$749.00', fees: '-US$21.92', total: 'US$727.08', type: 'Charge', description: 'Growth plan — annual', created: '9 Feb', availableOn: '9 Feb' },
  { amount: '-US$22,100.80', fees: '—', total: '-US$22,100.80', type: 'Payout', description: 'STRIPE PAYOUT', created: '8 Feb', availableOn: '8 Feb' },
  { amount: 'US$2,100.00', fees: '-US$63.90', total: 'US$2,036.10', type: 'Charge', description: 'White-label license', created: '8 Feb', availableOn: '8 Feb' },
  { amount: 'US$129.00', fees: '-US$4.04', total: 'US$124.96', type: 'Charge', description: 'Pro add-on — analytics', created: '7 Feb', availableOn: '7 Feb' },
  { amount: '-US$4,590.00', fees: '—', total: '-US$4,590.00', type: 'Payout', description: 'STRIPE PAYOUT', created: '7 Feb', availableOn: '7 Feb' },
  { amount: 'US$6,800.00', fees: '-US$200.20', total: 'US$6,599.80', type: 'Charge', description: 'Implementation services', created: '6 Feb', availableOn: '6 Feb' },
  { amount: '-US$8,400.00', fees: '—', total: '-US$8,400.00', type: 'Refund', description: 'Platform license — Q1', created: '6 Feb', availableOn: '6 Feb' },
  { amount: 'US$399.00', fees: '-US$11.87', total: 'US$387.13', type: 'Charge', description: 'Business plan — monthly', created: '5 Feb', availableOn: '5 Feb' },
  { amount: 'US$22,000.00', fees: '-US$670.00', total: 'US$21,330.00', type: 'Charge', description: 'Enterprise — custom deal', created: '5 Feb', availableOn: '5 Feb' },
  { amount: '-US$15,800.30', fees: '—', total: '-US$15,800.30', type: 'Payout', description: 'STRIPE PAYOUT', created: '4 Feb', availableOn: '4 Feb' },
  { amount: 'US$499.00', fees: '-US$14.67', total: 'US$484.33', type: 'Charge', description: 'Team plan — annual', created: '4 Feb', availableOn: '4 Feb' },
  { amount: 'US$5,500.00', fees: '-US$162.50', total: 'US$5,337.50', type: 'Charge', description: 'Platform fee — Feb', created: '3 Feb', availableOn: '3 Feb' },
  { amount: '-US$9,870.45', fees: '—', total: '-US$9,870.45', type: 'Payout', description: 'STRIPE PAYOUT', created: '3 Feb', availableOn: '3 Feb' },
  { amount: 'US$249.00', fees: '-US$7.52', total: 'US$241.48', type: 'Charge', description: 'Growth plan — monthly', created: '2 Feb', availableOn: '2 Feb' },
  { amount: 'US$950.00', fees: '-US$27.85', total: 'US$922.15', type: 'Charge', description: 'Support package — premium', created: '2 Feb', availableOn: '2 Feb' },
  { amount: '-US$5,600.00', fees: '—', total: '-US$5,600.00', type: 'Payout', description: 'STRIPE PAYOUT', created: '1 Feb', availableOn: '1 Feb' },
];

export const financialActivity = [
  { amount: '-US$15,000.00', status: null, fees: '-US$4.50', total: '-US$15,004.50', type: 'Payout', from: 'Financial account', to: 'ap@meridiangroup.com', created: '28 Feb, 09:00', description: 'Platform license — Q1' },
  { amount: '-US$6,800.00', status: null, fees: '-US$4.50', total: '-US$6,804.50', type: 'Payout', from: 'Financial account', to: 'james.wilson@hey.com', created: '27 Feb, 14:22', description: 'Implementation services' },
  { amount: '-US$1.00', status: 'Failed', fees: '—', total: '-US$1.00', type: 'Payout', from: 'Financial account', to: 'joshua.brealey@stripe.com', created: '26 Feb, 10:56', description: '—' },
  { amount: '-US$2,500.00', status: null, fees: '-US$4.50', total: '-US$2,504.50', type: 'Payout', from: 'Financial account', to: 'maria.garcia@acmecorp.com', created: '26 Feb, 08:30', description: 'Monthly contractor fee' },
  { amount: '-€4,200.00', status: null, fees: '-€3.80', total: '-€4,203.80', type: 'Payout', from: 'Financial account', to: 'anna.mueller@designlab.de', created: '25 Feb, 16:45', description: 'UX research — Feb' },
  { amount: 'US$50,000.00', status: null, fees: '—', total: 'US$50,000.00', type: 'Transfer', from: 'Payments balance', to: 'Financial account', created: '25 Feb, 12:00', description: 'Balance transfer' },
  { amount: '-US$1.00', status: null, fees: '-US$1.50', total: '-US$2.50', type: 'Payout', from: 'Financial account', to: 'joshua.brealey@stripe.com', created: '25 Feb, 09:52', description: '—' },
  { amount: '-US$22,000.00', status: null, fees: '-US$4.50', total: '-US$22,004.50', type: 'Payout', from: 'Financial account', to: 'billing@scalefast.io', created: '24 Feb, 11:00', description: 'Enterprise license' },
  { amount: '-US$950.00', status: null, fees: '-US$4.50', total: '-US$954.50', type: 'Payout', from: 'Financial account', to: 'raj.kumar@freelance.in', created: '23 Feb, 16:00', description: 'Backend development' },
  { amount: '-£1,200.00', status: 'Failed', fees: '—', total: '-£1,200.00', type: 'Payout', from: 'Financial account', to: 'emma.johnson@techstart.io', created: '22 Feb, 14:20', description: 'Design services' },
  { amount: '-US$8,400.00', status: null, fees: '-US$4.50', total: '-US$8,404.50', type: 'Payout', from: 'Financial account', to: 'chen.wei@globaltrade.cn', created: '21 Feb, 09:15', description: 'Consulting — Q1' },
  { amount: '-£500.00', status: null, fees: '-£3.80', total: '-£503.80', type: 'Payout', from: 'Financial account', to: 'samuel.okafor@gmail.com', created: '20 Feb, 08:15', description: 'Content writing' },
  { amount: '-€3,750.00', status: null, fees: '-€3.80', total: '-€3,753.80', type: 'Payout', from: 'Financial account', to: 'marie.laurent@startup.fr', created: '19 Feb, 14:37', description: 'Data migration' },
  { amount: '-US$12,500.00', status: null, fees: '-US$4.50', total: '-US$12,504.50', type: 'Payout', from: 'Financial account', to: 'finance@buildright.io', created: '18 Feb, 16:30', description: 'Integration setup' },
  { amount: '-US$2,500.00', status: null, fees: '-US$4.50', total: '-US$2,504.50', type: 'Payout', from: 'Financial account', to: 'maria.garcia@acmecorp.com', created: '18 Feb, 15:42', description: 'Monthly contractor fee' },
  { amount: '-US$3,200.00', status: null, fees: '-US$4.50', total: '-US$3,204.50', type: 'Payout', from: 'Financial account', to: 'tanaka.yuki@fastmail.jp', created: '17 Feb, 11:00', description: 'Translation services' },
  { amount: '-US$750.00', status: 'Failed', fees: '—', total: '-US$750.00', type: 'Payout', from: 'Financial account', to: 'priya.patel@outlook.com', created: '16 Feb, 22:10', description: 'Freelance dev work' },
  { amount: '-USDC 5,000.00', status: null, fees: '-US$1.00', total: '-USDC 5,001.00', type: 'Payout', from: 'Financial account', to: 'crypto@walletco.com', created: '15 Feb, 03:12', description: 'USDC settlement' },
  { amount: '-US$15,000.00', status: null, fees: '-US$4.50', total: '-US$15,004.50', type: 'Payout', from: 'Financial account', to: 'ap@meridiangroup.com', created: '14 Feb, 09:30', description: 'Platform license — Q4' },
  { amount: '-US$399.00', status: null, fees: '-US$4.50', total: '-US$403.50', type: 'Payout', from: 'Financial account', to: 'hello@craftshop.com', created: '14 Feb, 18:07', description: 'Business plan — monthly' },
  { amount: '-US$1,800.00', status: 'Failed', fees: '—', total: '-US$1,800.00', type: 'Payout', from: 'Financial account', to: 'carlos.silva@rapidgrow.com', created: '13 Feb, 11:45', description: 'Marketing services' },
  { amount: 'US$100,000.00', status: null, fees: '—', total: 'US$100,000.00', type: 'Transfer', from: 'Payments balance', to: 'Financial account', created: '12 Feb, 08:00', description: 'Balance transfer' },
  { amount: '-US$2,500.00', status: null, fees: '-US$4.50', total: '-US$2,504.50', type: 'Payout', from: 'Financial account', to: 'maria.garcia@acmecorp.com', created: '11 Feb, 10:30', description: 'Monthly contractor fee' },
  { amount: '-£500.00', status: null, fees: '-£3.80', total: '-£503.80', type: 'Payout', from: 'Financial account', to: 'samuel.okafor@gmail.com', created: '10 Feb, 09:00', description: 'Content writing' },
  { amount: '-US$22,000.00', status: null, fees: '-US$4.50', total: '-US$22,004.50', type: 'Payout', from: 'Financial account', to: 'billing@scalefast.io', created: '9 Feb, 09:00', description: 'Enterprise license' },
  { amount: '-US$399.00', status: null, fees: '-US$4.50', total: '-US$403.50', type: 'Payout', from: 'Financial account', to: 'hello@craftshop.com', created: '8 Feb, 18:07', description: 'Business plan — monthly' },
  { amount: '-US$6,800.00', status: null, fees: '-US$4.50', total: '-US$6,804.50', type: 'Payout', from: 'Financial account', to: 'james.wilson@hey.com', created: '7 Feb, 20:46', description: 'Implementation services' },
  { amount: '-US$950.00', status: null, fees: '-US$4.50', total: '-US$954.50', type: 'Payout', from: 'Financial account', to: 'raj.kumar@freelance.in', created: '3 Feb, 16:00', description: 'Backend development' },
];

const activityFilters = ['Currency', 'Type', 'Created', 'Available on'];
const financialFilters = ['Currency', 'Type', 'Created'];

export default function Transactions() {
  const [activeTab, setActiveTab] = useState('Payments');
  const [activeStatus, setActiveStatus] = useState('All');
  const [activeBalance, setActiveBalance] = useState('payments');
  const navigate = useNavigate();
  const basePath = useBasePath();
  const { payouts: userPayouts, variant } = usePayouts();
  const isNewUser = variant === 'new-user';
  const allFinancialActivity = [...userPayouts.map(toFinancialActivityItem), ...(isNewUser ? [] : financialActivity)];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-display-small text-default">Transactions</h1>
        <div className="flex items-center gap-2">
          {activeTab === 'Payments' && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-button-primary-bg text-button-primary-text rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
              <Icon name="add" size="xsmall" fill="currentColor" />
              <span className="text-label-small-emphasized">Create payment</span>
            </button>
          )}
          {activeTab === 'Payouts' && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-default hover:bg-offset transition-colors cursor-pointer">
              <Icon name="settings" size="xsmall" fill="currentColor" />
              <span className="text-label-small-emphasized">Manage</span>
            </button>
          )}
          {activeTab === 'All activity' && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-default hover:bg-offset transition-colors cursor-pointer">
              <Icon name="export" size="xsmall" fill="currentColor" />
              <span className="text-label-small-emphasized">Export</span>
            </button>
          )}
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-default hover:bg-offset transition-colors cursor-pointer">
            <Icon name="analytics" size="xsmall" fill="currentColor" />
            <span className="text-label-small-emphasized">Analyse</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-5 border-b border-border">
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

      {/* Payments tab content */}
      {activeTab === 'Payments' && (
        <>
          {/* Resource banner */}
          <div className="flex items-center justify-between px-4 py-3 mb-5 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-subdued">
                <Icon name="document" size="small" fill="currentColor" />
                <span className="text-label-small-emphasized">Resource</span>
              </div>
              <span className="text-body-small text-default">Explore the shifts that defined the internet economy in 2025 and how we're building for the future in our annual letter.</span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <button className="text-label-small-emphasized text-brand hover:underline cursor-pointer">Read the letter</button>
              <button className="text-icon-subdued hover:text-default cursor-pointer">
                <Icon name="close" size="small" fill="currentColor" />
              </button>
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex gap-1.5 mb-5">
            {statusTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveStatus(tab.label)}
                className={`flex-1 px-4 py-3 text-left border rounded-lg cursor-pointer transition-colors ${
                  activeStatus === tab.label
                    ? 'border-brand bg-brand-25'
                    : 'border-border hover:bg-offset'
                }`}
              >
                <div className={`text-label-small ${activeStatus === tab.label ? 'text-brand' : 'text-subdued'}`}>{tab.label}</div>
                <div className={`text-heading-medium ${activeStatus === tab.label ? 'text-brand' : 'text-default'}`}>{tab.count}</div>
              </button>
            ))}
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
            <div className="flex items-center gap-3 shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer">
                <Icon name="export" size="small" fill="currentColor" />
                Export
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer">
                <Icon name="settings" size="small" fill="currentColor" />
                Edit columns
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full table-fixed">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-3 pr-2 w-8">
                  <input type="checkbox" className="rounded border-border" />
                </th>
                {columns.map((col) => (
                  <th key={col.key} className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: col.width }}>{col.header}</th>
                ))}
                <th className="pb-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} onClick={() => navigate(`${basePath}/transactions/pi_${index}`)} className="border-b border-border hover:bg-offset transition-colors cursor-pointer h-10">
                  <td className="pr-2">
                    <input type="checkbox" className="rounded border-border" />
                  </td>
                  <td className="pr-4 overflow-hidden">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span className="text-label-medium-emphasized text-default">{tx.amount}</span>
                      <span className="text-body-small text-subdued">{tx.currency}</span>
                      <Badge variant={tx.statusVariant}>{tx.status}</Badge>
                    </div>
                  </td>
                  <td className="pr-4 overflow-hidden whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-4 bg-[#1A1F71] rounded flex items-center justify-center shrink-0">
                        <span className="text-white text-[8px] font-bold italic">VISA</span>
                      </div>
                      <span className="text-body-small text-default">{tx.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="pr-4 text-body-small text-default overflow-hidden text-ellipsis whitespace-nowrap">{tx.description}</td>
                  <td className="pr-4 text-body-small text-subdued overflow-hidden text-ellipsis whitespace-nowrap">{tx.customer}</td>
                  <td className="pr-4 text-body-small text-subdued whitespace-nowrap">{tx.date}</td>
                  <td className="pr-4 text-body-small text-subdued whitespace-nowrap">{tx.refundedDate}</td>
                  <td className="pr-4 text-body-small text-subdued overflow-hidden text-ellipsis whitespace-nowrap">{tx.declineReason}</td>
                  <td>
                    <button className="text-icon-subdued hover:text-default cursor-pointer">
                      <Icon name="overflow" size="small" fill="currentColor" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 text-body-small text-subdued">{transactions.length} items</div>
        </>
      )}

      {/* Payouts tab content */}
      {activeTab === 'Payouts' && (
        <>
          {/* Filters row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {payoutFilters.map((filter) => (
                <button
                  key={filter}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-label-small text-subdued hover:bg-offset transition-colors cursor-pointer"
                >
                  <Icon name="add" size="xsmall" fill="currentColor" />
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-label-small-emphasized text-default hover:bg-offset transition-colors cursor-pointer">
                <Icon name="export" size="small" fill="currentColor" />
                Export
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-3 text-label-small text-subdued font-normal pr-4 w-[30%]">Amount</th>
                <th className="pb-3 text-label-small text-subdued font-normal pr-4">Destination</th>
                <th className="pb-3 text-label-small text-subdued font-normal text-right">Arrive by</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout, index) => (
                <tr key={index} onClick={() => navigate(`${basePath}/payouts/po_${index}`)} className="border-b border-border hover:bg-offset transition-colors cursor-pointer h-10">
                  <td className="pr-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span className="text-label-medium-emphasized text-default">{payout.amount}</span>
                      <span className="text-body-small text-subdued">{payout.currency}</span>
                      <Badge variant={payout.statusVariant}>{payout.status}</Badge>
                    </div>
                  </td>
                  <td className="pr-4 text-body-small text-default">{payout.destination}</td>
                  <td className="text-body-small text-subdued text-right">{payout.arriveBy}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 text-body-small text-subdued">{payouts.length} items</div>
        </>
      )}

      {/* All activity tab content */}
      {activeTab === 'All activity' && (
        <>
          {/* Balance toggle */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setActiveBalance('payments')}
              className={`flex-1 px-4 py-3 text-left border rounded-lg cursor-pointer transition-colors ${
                activeBalance === 'payments'
                  ? 'border-brand bg-brand-25'
                  : 'border-border hover:bg-offset'
              }`}
            >
              <span className={`text-label-medium-emphasized ${activeBalance === 'payments' ? 'text-brand' : 'text-default'}`}>Payments balance</span>
            </button>
            <button
              onClick={() => setActiveBalance('financial')}
              className={`flex-1 px-4 py-3 text-left border rounded-lg cursor-pointer transition-colors ${
                activeBalance === 'financial'
                  ? 'border-brand bg-brand-25'
                  : 'border-border hover:bg-offset'
              }`}
            >
              <span className={`text-label-medium-emphasized ${activeBalance === 'financial' ? 'text-brand' : 'text-default'}`}>Financial account</span>
            </button>
          </div>

          {/* Filters row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {(activeBalance === 'payments' ? activityFilters : financialFilters).map((filter) => (
                <button
                  key={filter}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-label-small text-subdued hover:bg-offset transition-colors cursor-pointer"
                >
                  <Icon name="add" size="xsmall" fill="currentColor" />
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Payments balance table */}
          {activeBalance === 'payments' && (
            <>
              <table className="w-full table-fixed">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '16%' }}>Amount</th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '10%' }}>Fees</th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '16%' }}>Total</th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '8%' }}>Type</th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4">Description</th>
                    <th className="pb-3 text-label-small text-subdued font-normal text-right" style={{ width: '10%' }}>Created</th>
                    <th className="pb-3 text-label-small text-subdued font-normal text-right" style={{ width: '10%' }}>Available on</th>
                  </tr>
                </thead>
                <tbody>
                  {allActivity.map((item, index) => (
                    <tr key={index} className="border-b border-border hover:bg-offset transition-colors cursor-pointer h-10">
                      <td className="pr-4 text-label-medium-emphasized text-default whitespace-nowrap">{item.amount}</td>
                      <td className="pr-4 text-body-small text-subdued whitespace-nowrap">{item.fees}</td>
                      <td className="pr-4 text-body-small text-default whitespace-nowrap">{item.total}</td>
                      <td className="pr-4 text-body-small text-default">{item.type}</td>
                      <td className="pr-4 text-body-small text-default overflow-hidden text-ellipsis whitespace-nowrap">{item.description}</td>
                      <td className="text-body-small text-subdued text-right">{item.created}</td>
                      <td className="text-body-small text-subdued text-right">{item.availableOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 text-body-small text-subdued">{allActivity.length} items</div>
            </>
          )}

          {/* Financial account table */}
          {activeBalance === 'financial' && (
            <>
              <table className="w-full table-fixed">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '16%' }}>Amount</th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '10%' }}>Fees</th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '16%' }}>Total</th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '8%' }}>Type</th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4" style={{ width: '18%' }}>From</th>
                    <th className="pb-3 text-label-small text-subdued font-normal pr-4">To</th>
                    <th className="pb-3 text-label-small text-subdued font-normal text-right" style={{ width: '12%' }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {allFinancialActivity.map((item, index) => (
                    <tr key={index} onClick={() => navigate(`${basePath}/financial-payouts/${item.id || `obp_${index}`}`)} className="border-b border-border hover:bg-offset transition-colors cursor-pointer h-10">
                      <td className="pr-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-label-medium-emphasized text-default">{item.amount}</span>
                          {item.status && <Badge variant={item.status === 'Failed' ? 'danger' : 'warning'}>{item.status}</Badge>}
                        </div>
                      </td>
                      <td className="pr-4 text-body-small text-subdued whitespace-nowrap">{item.fees}</td>
                      <td className="pr-4 text-body-small text-default whitespace-nowrap">{item.total}</td>
                      <td className="pr-4 text-body-small text-default">{item.type}</td>
                      <td className="pr-4 text-body-small text-default overflow-hidden text-ellipsis whitespace-nowrap">{item.from}</td>
                      <td className="pr-4 text-body-small text-default overflow-hidden text-ellipsis whitespace-nowrap">{item.to}</td>
                      <td className="text-body-small text-subdued text-right whitespace-nowrap">{item.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 text-body-small text-subdued">{allFinancialActivity.length} items</div>
            </>
          )}
        </>
      )}
    </div>
  );
}

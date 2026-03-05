import { useNavigate } from 'react-router-dom';
import { Icon } from './icons/SailIcons';

const scenarios = [
  {
    number: 1,
    name: 'New user paying a recipient for the first time',
    description: 'You are a new user to the Stripe Financial account product. You need to pay money to a recipient you have not sent money to before.',
    path: '/new-user',
  },
  {
    number: 2,
    name: 'Active user paying a recipient',
    description: 'You have been using Stripe Financial accounts for a few months, you need to send an ACH payout to a recipient.',
    path: '/existing-user',
  },
  {
    number: 3,
    name: 'Active user paying a recipient without having their details',
    description: "You are a user of Stripe's Financial accounts and need to send a payment to a recipient but you don't have their details to hand.",
    path: '/existing-no-details',
  },
];

export default function PrototypeList() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-bl from-neutral-100 to-brand-0 flex items-center justify-center py-12">
      <div className="max-w-3xl w-full mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-display-small text-default mb-2">User testing scenarios</h1>
          <p className="text-body-medium text-subdued">Select a scenario to begin the test session.</p>
        </div>

        <div className="grid gap-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.number}
              onClick={() => navigate(scenario.path)}
              className="bg-surface border border-border rounded-xl p-6 text-left hover:border-brand hover:shadow-md transition-all duration-150 cursor-pointer group"
            >
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                  <span className="text-label-medium-emphasized text-brand">{scenario.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-label-large-emphasized text-default">{scenario.name}</h2>
                    <Icon name="chevronRight" size="small" fill="currentColor" className="text-icon-subdued group-hover:text-brand transition-colors shrink-0" />
                  </div>
                  <p className="text-body-small text-subdued mt-1">{scenario.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

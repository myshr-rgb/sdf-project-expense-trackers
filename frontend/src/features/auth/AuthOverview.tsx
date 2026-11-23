import Icon from '../../components/ui/Icon';
export default function AuthOverview() {
  return (
    <section
      aria-label="PlumLedger overview"
      className="flex flex-col justify-between gap-gutter-lg bg-royal-plum p-page-margin text-peach-cream lg:min-h-screen lg:p-gutter-xl"
    >
      <div className="flex items-center gap-gutter-md">
        <span className="grid size-11 place-items-center rounded-xl bg-peach-cream text-midnight-plum">
          <Icon name="account_balance_wallet" />
        </span>
        <span className="font-headline text-headline-lg">PlumLedger</span>
      </div>
      <div className="flex max-w-md flex-col gap-gutter-lg">
        <h1 className="text-balance font-headline text-display-lg-mobile lg:text-display-lg">
          Know where every rupee goes, without spreadsheets.
        </h1>
        <p className="hidden text-body-lg text-warm-blush lg:block">
          Track daily expenses, manage income sources, set category budgets, and
          get personalised AI insights built for students and young
          professionals.
        </p>
        <div className="hidden flex-col gap-gutter-sm pt-gutter-md lg:flex">
          {[
            ['Smart Category Budgets', 'FR5 · FR11', 'bg-velvet-plum'],
            ['AI Spending Insights', 'FR9 · FR10', 'bg-dusty-mauve'],
            [
              'Private & Secure Tracking',
              'NFR1 · NFR9',
              'bg-peach-cream text-midnight-plum',
            ],
          ].map(([label, requirements, color]) => (
            <div
              key={label}
              className={`flex items-center justify-between rounded-full px-gutter-lg py-gutter-md text-label-md ${color}`}
            >
              {label}
              <span className="font-mono text-mono-sm tabular-nums">
                {requirements}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-label-sm text-warm-blush">
        <span className="hidden lg:inline">
          AI-Powered Smart Personal Finance &amp; Expense Tracker
        </span>
        <span className="lg:hidden">Private &amp; Secure Tracking</span>
      </p>
    </section>
  );
}

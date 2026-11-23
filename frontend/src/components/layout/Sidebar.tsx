import type { Profile } from '../../repositories/repository';
import Icon from '../ui/Icon';
import Navigation from './Navigation';
import ProfileMenu from './ProfileMenu';
export default function Sidebar({ user }: { user: Profile }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col justify-between overflow-y-auto border-r border-light-outline-variant bg-light-surface-container-lowest p-gutter-xl lg:flex">
      <div className="flex flex-col gap-gutter-xl">
        <div className="flex items-center gap-gutter-md">
          <span className="grid size-10 place-items-center rounded-xl bg-royal-plum text-peach-cream">
            <Icon name="account_balance_wallet" />
          </span>
          <div>
            <p className="font-headline text-headline-md">PlumLedger</p>
            <p className="text-label-sm text-light-on-surface-variant">
              Smart Finance
            </p>
          </div>
        </div>
        <Navigation />
      </div>
      <div className="border-t border-light-outline-variant pt-gutter-lg">
        <ProfileMenu user={user} />
      </div>
    </aside>
  );
}

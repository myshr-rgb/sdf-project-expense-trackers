import { useLocation, Outlet } from 'react-router-dom';
import type { Profile } from '../../repositories/repository';
import { pages } from './pages';
import Sidebar from './Sidebar';
import Navigation from './Navigation';
import ProfileMenu from './ProfileMenu';
const monthLabel = new Intl.DateTimeFormat('en-IN', {
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
});
export default function AppShell({ user }: { user: Profile }) {
  const { pathname } = useLocation();
  const page = pages.find((p) => pathname.split('/')[1] === p.path);
  return (
    <div className="min-h-screen lg:pl-64">
      <Sidebar user={user} />
      <header className="sticky top-0 z-10 flex items-center justify-between gap-gutter-lg border-b border-light-outline-variant bg-light-surface px-page-margin py-gutter-lg lg:px-gutter-xl">
        <div className="min-w-0">
          <p className="truncate text-label-md text-light-on-surface-variant">
            Hello, {user.name.split(/\s+/)[0]}!
          </p>
          <h1 className="font-headline text-headline-lg">{page?.title}</h1>
        </div>
        <span className="hidden rounded-full bg-peach-cream px-gutter-lg py-gutter-sm text-label-md text-midnight-plum lg:inline">
          {monthLabel.format(new Date())}
        </span>
        <div className="lg:hidden">
          <ProfileMenu user={user} mobile />
        </div>
      </header>
      <main className="mx-auto grid w-full max-w-7xl gap-gutter-xl p-page-margin pb-24 lg:grid-cols-12 lg:p-gutter-xl">
        <Outlet />
      </main>
      <Navigation mobile />
    </div>
  );
}

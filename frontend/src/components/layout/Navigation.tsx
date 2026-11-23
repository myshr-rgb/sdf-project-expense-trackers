import { NavLink } from 'react-router-dom';
import { pages } from './pages';
import Icon from '../ui/Icon';

export default function Navigation({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav
      aria-label={mobile ? 'Mobile navigation' : 'Main navigation'}
      className={
        mobile
          ? 'fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-light-outline-variant bg-light-surface-container-lowest p-gutter-xs pb-[max(4px,env(safe-area-inset-bottom))] lg:hidden'
          : 'flex flex-col gap-gutter-xs'
      }
    >
      {pages.map((page) => (
        <NavLink
          key={page.path}
          to={'/' + page.path}
          className={({ isActive }) =>
            `flex min-h-11 items-center rounded-full ${mobile ? 'flex-col justify-center text-label-sm' : 'gap-gutter-md px-gutter-lg py-gutter-md text-label-lg'} ${isActive ? 'bg-royal-plum text-peach-cream' : 'text-light-on-surface-variant hover:bg-peach-cream'}`
          }
        >
          <Icon name={page.icon} />
          <span className="max-w-full break-words text-center">
            {page.name}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}

import { useAuthAction } from '../../features/auth/useAuth';
import type { Profile } from '../../repositories/repository';
import Icon from '../ui/Icon';
export default function ProfileMenu({
  user,
  mobile = false,
}: {
  user: Profile;
  mobile?: boolean;
}) {
  const auth = useAuthAction();
  return (
    <details className="relative">
      <summary
        aria-label="Account settings"
        className="flex min-h-11 cursor-pointer list-none items-center gap-gutter-sm rounded-xl"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-peach-cream font-title text-title-md">
          {Array.from(user.name)[0]}
        </span>
        {!mobile && (
          <span className="min-w-0 flex-1">
            <span className="block truncate font-title text-title-md">
              {user.name}
            </span>
            <span className="text-label-sm text-light-on-surface-variant">
              Student Plan
            </span>
          </span>
        )}
        {!mobile && <Icon name="expand_more" />}
      </summary>
      <div
        className={`absolute z-30 flex w-48 flex-col rounded-xl border border-light-outline-variant bg-light-surface-container-lowest p-gutter-sm ${mobile ? 'right-0 top-full' : 'bottom-full left-0'}`}
      >
        {mobile && (
          <p className="break-words px-gutter-sm text-label-md">
            {user.name} · Student Plan
          </p>
        )}
        <button
          disabled={auth.isPending}
          className="min-h-11 rounded-xl text-left px-gutter-sm hover:bg-peach-cream"
          onClick={() => auth.mutate({ kind: 'logout', userId: user.id })}
        >
          Log out
        </button>
        <button
          disabled={auth.isPending}
          className="min-h-11 rounded-xl px-gutter-sm text-left text-light-error hover:bg-light-error-container"
          onClick={() => {
            if (
              window.confirm(
                'Delete your account and all its financial data from this browser? This is permanent.',
              )
            )
              auth.mutate({ kind: 'delete', userId: user.id });
          }}
        >
          Delete account and data
        </button>
        {auth.isError && <p role="alert">{auth.error.message}</p>}
      </div>
    </details>
  );
}

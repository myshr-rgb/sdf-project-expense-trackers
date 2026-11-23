import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  loginSchema,
  registrationSchema,
  type AuthFields,
} from '../../services/authService';
import { useAuthAction } from './useAuth';
import AuthOverview from './AuthOverview';
import Icon from '../../components/ui/Icon';

export default function SignInPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const deleted = location.state?.accountDeleted === true;
  useEffect(() => {
    if (!deleted) return;
    const timer = window.setTimeout(
      () => navigate('/sign-in', { replace: true }),
      4000,
    );
    return () => window.clearTimeout(timer);
  }, [deleted, navigate]);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [visible, setVisible] = useState(false);
  const registering = mode === 'register';
  const auth = useAuthAction();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<AuthFields>({
    defaultValues: { name: '', email: '', password: '', consent: false },
  });
  function switchMode(next: typeof mode) {
    if (mode === next) return;
    reset();
    auth.reset();
    setVisible(false);
    setMode(next);
  }
  const submit = handleSubmit((fields) => {
    const parsed = (registering ? registrationSchema : loginSchema).safeParse(
      fields,
    );
    if (!parsed.success) {
      parsed.error.issues.forEach(({ path, message }, i) =>
        setError(
          path[0] as keyof AuthFields,
          { message },
          { shouldFocus: i === 0 },
        ),
      );
      return;
    }
    auth.mutate({ kind: mode, fields });
  });
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <AuthOverview />
      {deleted && (
        <div
          role="status"
          className="fixed inset-x-page-margin bottom-gutter-lg z-30 flex items-center justify-between gap-gutter-md rounded-xl bg-royal-plum px-gutter-lg text-peach-cream lg:left-auto"
        >
          Account and data deleted.
          <button
            aria-label="Dismiss confirmation"
            className="grid size-11 place-items-center"
            onClick={() => navigate('/sign-in', { replace: true })}
          >
            <Icon name="close" />
          </button>
        </div>
      )}
      <section
        aria-label="Account authentication"
        className="flex items-center justify-center p-page-margin lg:p-gutter-xl"
      >
        <div className="flex w-full max-w-md flex-col gap-gutter-lg rounded-2xl border border-light-outline-variant bg-light-surface-container-lowest p-gutter-xl">
          <div
            aria-label="Account access"
            role="group"
            className="grid grid-cols-2 gap-gutter-xs rounded-full bg-light-surface-container-low p-gutter-xs"
          >
            {(['login', 'register'] as const).map((key) => (
              <button
                type="button"
                key={key}
                disabled={auth.isPending}
                aria-pressed={key === mode}
                onClick={() => switchMode(key)}
                className={`min-h-11 rounded-full text-label-lg ${key === mode ? 'bg-royal-plum text-peach-cream' : 'text-light-on-surface-variant'}`}
              >
                {key === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>
          <div>
            <h2 className="font-headline text-headline-lg">
              {registering ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-gutter-xs text-light-on-surface-variant">
              {registering
                ? 'Start tracking income, expenses, and budgets in minutes.'
                : 'Sign in to review your budgets and AI insights.'}
            </p>
          </div>
          <form
            noValidate
            onSubmit={submit}
            className="flex flex-col gap-gutter-md"
          >
            {(['name', 'email', 'password'] as const)
              .filter((key) => key !== 'name' || registering)
              .map((key) => (
                <div className="flex flex-col gap-gutter-xs" key={key}>
                  <label htmlFor={key} className="text-label-md">
                    {
                      {
                        name: 'Full Name',
                        email: 'Email Address',
                        password: 'Password',
                      }[key]
                    }
                  </label>
                  <div className="relative">
                    <input
                      {...register(key)}
                      id={key}
                      required
                      aria-invalid={!!errors[key]}
                      aria-describedby={
                        errors[key] ? key + '-error' : undefined
                      }
                      type={
                        key === 'password'
                          ? visible
                            ? 'text'
                            : 'password'
                          : key === 'email'
                            ? 'email'
                            : 'text'
                      }
                      autoComplete={
                        key === 'password'
                          ? registering
                            ? 'new-password'
                            : 'current-password'
                          : key
                      }
                      placeholder={
                        {
                          email: 'you@university.edu.in',
                          name: 'Your full name',
                          password: 'Enter your password',
                        }[key]
                      }
                      className="min-h-11 w-full rounded-xl border border-light-outline-variant bg-light-surface-container-low px-gutter-md py-gutter-sm focus-visible:ring-2 focus-visible:ring-royal-plum aria-invalid:border-light-error"
                      style={
                        key === 'password'
                          ? { paddingRight: '3rem' }
                          : undefined
                      }
                    />
                    {key === 'password' && (
                      <button
                        type="button"
                        aria-label={visible ? 'Hide password' : 'Show password'}
                        onClick={() => setVisible(!visible)}
                        className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-xl text-light-on-surface-variant"
                      >
                        <Icon
                          name={visible ? 'visibility_off' : 'visibility'}
                        />
                      </button>
                    )}
                  </div>
                  {errors[key] && (
                    <p
                      id={key + '-error'}
                      className="text-label-md text-light-error"
                    >
                      {errors[key]?.message}
                    </p>
                  )}
                </div>
              ))}
            {registering && (
              <div>
                <label className="flex min-h-11 items-start gap-gutter-sm">
                  <input
                    type="checkbox"
                    {...register('consent')}
                    aria-invalid={!!errors.consent}
                    aria-describedby={
                      errors.consent ? 'consent-error' : undefined
                    }
                    className="mt-gutter-xs accent-royal-plum"
                  />
                  <span>
                    I consent to PlumLedger storing my profile and financial
                    records in this browser for personal finance tracking. I can
                    withdraw consent by deleting my account and data.
                  </span>
                </label>
                {errors.consent && (
                  <p
                    id="consent-error"
                    className="text-label-md text-light-error"
                  >
                    {errors.consent.message}
                  </p>
                )}
              </div>
            )}
            {auth.isError && (
              <p role="alert" className="text-label-md text-light-error">
                {auth.error.message}
              </p>
            )}
            <button
              disabled={auth.isPending}
              className="mt-gutter-sm rounded-full bg-royal-plum py-gutter-md text-label-lg text-peach-cream hover:bg-velvet-plum"
            >
              {registering
                ? 'Create PlumLedger Account'
                : 'Sign In to PlumLedger'}
            </button>
          </form>
          {!registering && (
            <button
              type="button"
              disabled={auth.isPending}
              onClick={() => auth.mutate({ kind: 'demo' })}
              className="min-h-11 rounded-full bg-peach-cream text-label-lg text-midnight-plum hover:bg-warm-blush"
            >
              Use Demo Account
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

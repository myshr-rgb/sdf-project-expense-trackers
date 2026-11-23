import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import SignInPage from './features/auth/SignInPage';
import { sessionKey } from './features/auth/useAuth';
import { authService } from './services/authService';
import AppShell from './components/layout/AppShell';
import { pages } from './components/layout/pages';

export default function AppRoutes() {
  const location = useLocation();
  const cache = useQueryClient();
  const session = useQuery({
    queryKey: sessionKey,
    queryFn: () => authService.session(),
    retry: false,
  });
  useEffect(() => {
    return authService.subscribeToSessionChanges(() => {
      void cache.invalidateQueries({ queryKey: sessionKey });
    });
  }, [cache]);
  if (session.isPending)
    return (
      <main role="status" className="p-page-margin">
        Opening PlumLedger…
      </main>
    );
  if (session.isError)
    return (
      <main role="alert" className="p-page-margin">
        Your saved account could not be opened.{' '}
        <button className="underline" onClick={() => void session.refetch()}>
          Try again
        </button>
      </main>
    );
  const from = location.state?.from;
  const destination = pages.some((p) => '/' + p.path === from)
    ? from
    : '/dashboard';
  return (
    <Routes>
      <Route
        path="/sign-in"
        element={
          session.data ? <Navigate replace to={destination} /> : <SignInPage />
        }
      />
      <Route
        element={
          session.data ? (
            <AppShell user={session.data} />
          ) : (
            <Navigate
              replace
              to="/sign-in"
              state={{ from: location.pathname }}
            />
          )
        }
      >
        {pages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={
              <section aria-label={page.name} className="lg:col-span-8" />
            }
          />
        ))}
      </Route>
      <Route path="*" element={<Navigate replace to="/dashboard" />} />
    </Routes>
  );
}

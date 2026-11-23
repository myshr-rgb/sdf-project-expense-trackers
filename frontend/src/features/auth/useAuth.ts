import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService, type AuthFields } from '../../services/authService';
import type { Profile } from '../../repositories/repository';
export const sessionKey = ['session'] as const;
type Action =
  | { kind: 'login' | 'register'; fields: AuthFields }
  | { kind: 'demo' }
  | { kind: 'logout' | 'delete'; userId: string };

export function useAuthAction() {
  const cache = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    gcTime: 0,
    mutationFn: async (action: Action): Promise<Profile | null> => {
      switch (action.kind) {
        case 'login':
          return authService.login(action.fields);
        case 'register':
          return authService.register(action.fields);
        case 'demo':
          return authService.demo();
        case 'logout':
          await authService.logout(action.userId);
          return null;
        case 'delete':
          await authService.deleteAccount(action.userId);
          return null;
      }
    },
    onSuccess: async (profile, action) => {
      await cache.cancelQueries({ queryKey: sessionKey });
      cache.removeQueries({
        predicate: (q) => q.queryKey[0] !== sessionKey[0],
      });
      cache.setQueryData(sessionKey, profile);
      if (action.kind === 'delete') {
        navigate('/sign-in', {
          replace: true,
          state: { accountDeleted: true },
        });
      }
    },
  });
}

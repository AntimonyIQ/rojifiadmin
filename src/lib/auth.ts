import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useToast } from '@/hooks/use-toast';

type User = {
  email: string;
  name: string;
} | null;

interface AuthState {
  isAuthenticated: boolean;
  user: User;
  login: (user: Omit<NonNullable<User>, 'token'>) => void;
  logout: () => void;
}

export const useAuthState = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => {
        set({ isAuthenticated: false, user: null });
        
        // In a real application, we would make an API call to invalidate the token
        // For this example, we'll just clear the state
        
        // Get toast outside of the Zustand store to avoid circular dependencies
        const { toast } = useToast();
        if (toast) {
          toast({
            title: "Logged out successfully",
            description: "You have been logged out of your account",
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

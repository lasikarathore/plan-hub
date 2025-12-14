import { create } from 'zustand';
import type { User, UserProfile } from '../types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        avatar: undefined,
        createdAt: new Date(),
      };

      set({ 
        user: mockUser, 
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (name: string, email: string, _password: string) => {
    set({ isLoading: true });
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name,
        avatar: undefined,
        createdAt: new Date(),
      };

      set({ 
        user: mockUser, 
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({ 
      user: null, 
      profile: null,
      isAuthenticated: false 
    });
  },

  updateProfile: (profileUpdate: Partial<UserProfile>) => {
    set((state) => ({
      profile: state.profile 
        ? { ...state.profile, ...profileUpdate }
        : profileUpdate as UserProfile
    }));
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },
}));

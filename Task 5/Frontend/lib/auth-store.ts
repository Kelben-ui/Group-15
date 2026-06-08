import { create } from 'zustand';
import type { User, Learner, Instructor, Parent, AdminUser } from './types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

// Mock user data for demo purposes
const mockUsers: Record<string, any> = {
  'learner@example.com': {
    id: '1',
    name: 'Alex Johnson',
    email: 'learner@example.com',
    role: 'learner' as const,
    avatar: '👨‍🎓',
    enrolledCourses: ['course-1', 'course-2'],
    completedCourses: ['course-3'],
    totalProgress: 65,
    learningHours: 24,
    badges: ['Quick Learner', 'Consistent'],
    createdAt: new Date('2024-01-15'),
  },
  'instructor@example.com': {
    id: '2',
    name: 'Sarah Williams',
    email: 'instructor@example.com',
    role: 'instructor' as const,
    avatar: '👩‍🏫',
    expertise: ['Mathematics', 'Physics', 'Chemistry'],
    coursesTaught: ['course-1', 'course-2'],
    studentsCount: 156,
    rating: 4.8,
    createdAt: new Date('2023-06-10'),
  },
  'parent@example.com': {
    id: '3',
    name: 'Michael Chen',
    email: 'parent@example.com',
    role: 'parent' as const,
    avatar: '👨‍👩‍👧',
    childrenIds: ['1'],
    createdAt: new Date('2024-02-01'),
  },
  'admin@example.com': {
    id: '4',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as const,
    avatar: '👨‍💼',
    permissions: ['manage-users', 'manage-courses', 'view-analytics'],
    createdAt: new Date('2023-01-01'),
  },
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const user = mockUsers[email.toLowerCase()];
      if (!user) {
        throw new Error('Invalid email or password');
      }

      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('authUser', JSON.stringify(user));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, error: null });
    localStorage.removeItem('authUser');
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'learner',
        createdAt: new Date(),
      };

      set({ user: newUser, isAuthenticated: true, isLoading: false });
      localStorage.setItem('authUser', JSON.stringify(newUser));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false 
      });
      throw error;
    }
  },

  setUser: (user) => {
    set({ user, isAuthenticated: user !== null });
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }
  },

  clearError: () => set({ error: null }),
}));

// Initialize auth from localStorage
if (typeof window !== 'undefined') {
  const savedUser = localStorage.getItem('authUser');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      useAuthStore.setState({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Failed to restore auth:', error);
    }
  }
}

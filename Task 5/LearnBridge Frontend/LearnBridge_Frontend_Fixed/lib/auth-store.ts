import { create } from 'zustand';
import type { User, UserRole } from './types';
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
    name: 'Maria Fomen',
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
    name: 'Dr. John Doe',
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
    name: 'James Doe Parent',
    email: 'parent@example.com',
    role: 'parent' as const,
    avatar: '👨‍👩‍👧',
    childrenIds: ['1'],
    createdAt: new Date('2024-02-01'),
  },
  'admin@example.com': {
    id: '4',
    name: 'System Administrator',
    email: 'admin@example.com',
    role: 'admin' as const,
    avatar: '👨‍💼',
    permissions: ['manage-users', 'manage-courses', 'view-analytics'],
    createdAt: new Date('2023-01-01'),
  },
};

const REGISTERED_USERS_KEY = 'registeredUsers';

function getRegisteredUsers(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  try {
    const savedUsers = localStorage.getItem(REGISTERED_USERS_KEY);
    return savedUsers ? JSON.parse(savedUsers) : {};
  } catch (error) {
    console.error('Failed to read registered users:', error);
    return {};
  }
}

function saveRegisteredUsers(users: Record<string, any>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

function buildUserForRole(userData: Partial<User> & { password: string }): User {
  const role = (userData.role || 'learner') as UserRole;
  const baseUser = {
    id: Math.random().toString(36).slice(2, 11),
    name: userData.name || '',
    email: (userData.email || '').toLowerCase(),
    role,
    phone: userData.phone || '',
    createdAt: new Date(),
  };

  if (role === 'learner') {
    return {
      ...baseUser,
      role: 'learner',
      avatar: '👨‍🎓',
      enrolledCourses: [],
      completedCourses: [],
      totalProgress: 0,
      learningHours: 0,
      badges: [],
    } as any;
  }

  if (role === 'instructor') {
    return {
      ...baseUser,
      role: 'instructor',
      avatar: '👩‍🏫',
      expertise: [],
      coursesTaught: [],
      studentsCount: 0,
      rating: 0,
    } as any;
  }

  if (role === 'parent') {
    return {
      ...baseUser,
      role: 'parent',
      avatar: '👨‍👩‍👧',
      childrenIds: [],
    } as any;
  }

  return {
    ...baseUser,
    role: 'admin',
    avatar: '👨‍💼',
    permissions: ['view-analytics'],
  } as any;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
  set({
    isLoading: true,
    error: null,
  });

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    const user = {
      ...data.user,
      role: data.user.role.toLowerCase(),
      enrolledCourses: data.user.enrolledCourses || [],
      completedCourses: data.user.completedCourses || [],
      totalProgress: data.user.totalProgress || 0,
      learningHours: data.user.learningHours || 0,
      badges: data.user.badges || [],
      avatar: data.user.avatarUrl || "👤",
      createdAt: data.user.createdAt
        ? new Date(data.user.createdAt)
        : new Date(),
    } as User;

    localStorage.setItem("learnbridge_token", data.token);
    localStorage.setItem("authUser", JSON.stringify(user));

    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  } catch (error) {
    set({
      error: error instanceof Error ? error.message : "Login failed",
      isLoading: false,
    });

    throw error;
  }
},

  logout: () => {
    set({ user: null, isAuthenticated: false, error: null });
    localStorage.removeItem('authUser');
  },

  register: async (userData: Partial<User> & { password: string }) => {
  set({
    isLoading: true,
    error: null,
  });

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: (userData.role || "learner").toUpperCase(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    const role = data.user.role.toLowerCase() as UserRole;

    const newUser = {
      ...data.user,
      role,
      avatar: data.user.avatarUrl || "👤",
      enrolledCourses: data.user.enrolledCourses || [],
      completedCourses: data.user.completedCourses || [],
      totalProgress: data.user.totalProgress || 0,
      learningHours: data.user.learningHours || 0,
      badges: data.user.badges || [],
      createdAt: data.user.createdAt
        ? new Date(data.user.createdAt)
        : new Date(),
    } as User;

    localStorage.setItem("learnbridge_token", data.token);
    localStorage.setItem("authUser", JSON.stringify(newUser));

    set({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  } catch (error) {
    set({
      error: error instanceof Error ? error.message : "Registration failed",
      isLoading: false,
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

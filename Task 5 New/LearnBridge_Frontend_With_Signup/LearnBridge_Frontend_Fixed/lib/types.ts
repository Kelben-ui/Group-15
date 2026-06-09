// User roles for the platform
export type UserRole = 'learner' | 'instructor' | 'parent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  bio?: string;
  createdAt: Date;
}

export interface Learner extends User {
  role: 'learner';
  enrolledCourses: string[];
  completedCourses: string[];
  totalProgress: number;
  learningHours: number;
  badges: string[];
}

export interface Instructor extends User {
  role: 'instructor';
  expertise: string[];
  coursesTaught: string[];
  studentsCount: number;
  rating: number;
}

export interface Parent extends User {
  role: 'parent';
  childrenIds: string[];
}

export interface AdminUser extends User {
  role: 'admin';
  permissions: string[];
}

// Course related types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in hours
  students: number;
  rating: number;
  thumbnail?: string;
  price?: number;
  createdAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number;
  content: string;
  videoUrl?: string;
  order: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string;
  points: number;
}

export interface LiveClass {
  id: string;
  courseId: string;
  instructorId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  zoomUrl?: string;
  recordingUrl?: string;
  capacity: number;
  enrolled: number;
}

export interface ProgressRecord {
  id: string;
  learnerId: string;
  courseId: string;
  lessonsCompleted: number;
  totalLessons: number;
  progress: number; // percentage
  timeSpent: number; // in minutes
  quizScores: number[];
  lastAccessedAt: Date;
}

export interface Announcement {
  id: string;
  instructorId: string;
  courseId?: string;
  title: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'course' | 'assignment' | 'message' | 'announcement';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

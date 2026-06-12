import type { UserRole } from './types';

export type NetworkQuality = 'good' | 'unstable' | 'offline';
export type PageId =
  | 'dashboard'
  | 'courses'
  | 'adaptive-content'
  | 'downloads'
  | 'quizzes'
  | 'live-classes'
  | 'progress'
  | 'chat'
  | 'settings'
  | 'content-management'
  | 'attendance'
  | 'students'
  | 'reports'
  | 'children'
  | 'users'
  | 'system-status';

export interface NavItemData {
  id: PageId;
  label: string;
  description?: string;
}

export const appIdentity = {
  name: 'LearnBridge',
  tagline: 'Learning that continues, even with low connectivity.',
  description:
    'An adaptive PWA e-learning platform for low-resource environments with offline learning, low-data content delivery, live interaction, assessment, attendance, progress monitoring, and role-based dashboards.',
};

export const stakeholderRoles: Record<UserRole, string> = {
  learner: 'Learner',
  instructor: 'Instructor',
  parent: 'Parent',
  admin: 'Administrator',
};

export const courses = [
  {
    id: 'bio-101',
    title: 'Introduction to Biology',
    instructor: 'Dr. John Doe',
    category: 'Science',
    level: 'Beginner',
    description: 'Cell structure, living organisms, and basic biology concepts.',
    progress: 60,
    lessons: 8,
    completed: 5,
    duration: '4h 20m',
    quality: 'Adaptive',
    offlineReady: true,
    format: ['Video', 'Audio', 'Text', 'Slides'],
  },
  {
    id: 'math-100',
    title: 'Mathematics Basics',
    instructor: 'Ms. Sarah Williams',
    category: 'Mathematics',
    level: 'Beginner',
    description: 'Number systems, equations, graph reading, and basic problem solving.',
    progress: 72,
    lessons: 12,
    completed: 9,
    duration: '6h 10m',
    quality: 'Low-data',
    offlineReady: true,
    format: ['Video', 'Text', 'Quiz'],
  },
  {
    id: 'eng-102',
    title: 'English Grammar',
    instructor: 'Mr. Michael Chen',
    category: 'Language',
    level: 'Beginner',
    description: 'Grammar rules, sentence construction, comprehension, and writing practice.',
    progress: 35,
    lessons: 10,
    completed: 3,
    duration: '3h 45m',
    quality: 'Text fallback',
    offlineReady: true,
    format: ['Audio', 'Text', 'Slides'],
  },
  {
    id: 'chem-101',
    title: 'Introduction to Chemistry',
    instructor: 'Dr. Grace N.',
    category: 'Science',
    level: 'Beginner',
    description: 'Atoms, molecules, states of matter, and laboratory safety foundations.',
    progress: 15,
    lessons: 7,
    completed: 1,
    duration: '4h 00m',
    quality: 'Adaptive',
    offlineReady: false,
    format: ['Video', 'Text'],
  },
];

export const modules = [
  {
    id: 'm1',
    courseId: 'bio-101',
    title: 'Cells and Life',
    duration: '12:45 min',
    status: 'Available offline',
    qualityOptions: ['Auto', 'Low Data', 'Text Only'],
  },
  {
    id: 'm2',
    courseId: 'bio-101',
    title: 'Cell Organelles',
    duration: '15:30 min',
    status: 'Not downloaded',
    qualityOptions: ['Auto', 'Low Data', 'Standard'],
  },
  {
    id: 'm3',
    courseId: 'math-100',
    title: 'Linear Equations',
    duration: '18:00 min',
    status: 'Available offline',
    qualityOptions: ['Auto', 'Text Only'],
  },
];

export const quizzes = [
  {
    id: 'q1',
    title: 'Biology Quiz 2',
    course: 'Introduction to Biology',
    questions: 10,
    timeLimit: '15 min',
    status: 'Open',
    score: 85,
  },
  {
    id: 'q2',
    title: 'Mathematics Practice Test',
    course: 'Mathematics Basics',
    questions: 15,
    timeLimit: '25 min',
    status: 'Open',
    score: null,
  },
  {
    id: 'q3',
    title: 'English Grammar Check',
    course: 'English Grammar',
    questions: 12,
    timeLimit: '20 min',
    status: 'Downloaded draft',
    score: null,
  },
];

export const liveSessions = [
  {
    id: 'l1',
    title: 'Cell Structure Live Class',
    course: 'Introduction to Biology',
    instructor: 'Dr. John Doe',
    time: 'Today, 2:00 PM',
    mode: 'Low-bandwidth text + audio',
    status: 'Live now',
  },
  {
    id: 'l2',
    title: 'Linear Equations Q&A',
    course: 'Mathematics Basics',
    instructor: 'Ms. Sarah Williams',
    time: 'Tomorrow, 10:00 AM',
    mode: 'Text chat with recording',
    status: 'Upcoming',
  },
];

export const progressSummary = {
  overall: 78,
  attendance: 92,
  subjects: [
    { name: 'Biology', value: 80 },
    { name: 'Mathematics', value: 72 },
    { name: 'English', value: 76 },
    { name: 'Chemistry', value: 64 },
  ],
  recentActivity: [
    'Submitted Biology Quiz 2 — 85%',
    'Downloaded Mathematics Basics for offline access',
    'Joined Cell Structure live chat',
    'Completed English Grammar module 3',
  ],
};

export const instructorStats = {
  totalStudents: 248,
  courses: 12,
  lessons: 36,
  quizzes: 18,
  pendingSubmissions: 42,
};

export const studentRows = [
  { name: 'Maria F.', course: 'Biology', progress: 80, attendance: 92, lastSeen: 'Today' },
  { name: 'James Doe', course: 'Mathematics', progress: 72, attendance: 88, lastSeen: 'Yesterday' },
  { name: 'Alex Johnson', course: 'English', progress: 76, attendance: 90, lastSeen: 'Today' },
];

export const adminMetrics = {
  users: 1245,
  instructors: 86,
  activeCourses: 54,
  activeSessions: 12,
  serverStatus: 'Online',
  databaseStatus: 'Online',
  storageUsage: 72,
  backupStatus: 'Up to date',
};

export const navByRole: Record<UserRole, NavItemData[]> = {
  learner: [
    { id: 'dashboard', label: 'Home' },
    { id: 'courses', label: 'Browse Courses' },
    { id: 'adaptive-content', label: 'Adaptive Lesson' },
    { id: 'downloads', label: 'Offline Downloads' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'live-classes', label: 'Live Classes' },
    { id: 'progress', label: 'Progress' },
    { id: 'chat', label: 'Messages / Q&A' },
  ],
  instructor: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'content-management', label: 'Upload Materials' },
    { id: 'courses', label: 'Manage Courses' },
    { id: 'quizzes', label: 'Create Quizzes' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'live-classes', label: 'Live Sessions' },
    { id: 'students', label: 'Students' },
    { id: 'reports', label: 'Reports' },
  ],
  parent: [
    { id: 'dashboard', label: 'Parent Home' },
    { id: 'children', label: 'My Children' },
    { id: 'progress', label: 'Progress & Attendance' },
    { id: 'reports', label: 'Activity Reports' },
    { id: 'chat', label: 'Messages' },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'users', label: 'User Management' },
    { id: 'courses', label: 'Course Oversight' },
    { id: 'reports', label: 'Reports' },
    { id: 'system-status', label: 'System Status' },
    { id: 'settings', label: 'Settings' },
  ],
};

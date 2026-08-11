import type { UserRole } from './auth';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  district?: string;
  state?: string;
  targetExams?: string[];
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentStats {
  totalExams: number;
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
  accuracy: number;
  rank?: number;
  streak: number;
  totalTimeSpent: number;
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  totalExams: number;
}

export type UserRole = 'ADMIN' | 'WAREHOUSE_MANAGER' | 'CLIENT';

// User model matching backend API
export interface User {
  id?: number;
  username?: string;
  name: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];
  active?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  roles: UserRole[];
}

export interface AuthUser {
  username: string;
  roles: UserRole[];
  token: string;
}

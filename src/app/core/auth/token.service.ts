    import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface DecodedToken {
  exp?: number;
  iat?: number;
  [key: string]: any;
}

interface UserInfo {
  username: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (this.isBrowser) {
      if (token) sessionStorage.setItem('accessToken', token);
      else sessionStorage.removeItem('accessToken');
    }
  }

  setRefreshToken(token: string | null) {
    this.refreshToken = token;
    if (this.isBrowser) {
      if (token) localStorage.setItem('refreshToken', token);
      else localStorage.removeItem('refreshToken');
    }
  }

  getAccessToken(): string | null {
    if (!this.accessToken && this.isBrowser) {
      this.accessToken = sessionStorage.getItem('accessToken');
    }
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    if (!this.refreshToken && this.isBrowser) {
      this.refreshToken = localStorage.getItem('refreshToken');
    }
    return this.refreshToken;
  }

  setUser(username: string, roles: string[]): void {
    if (this.isBrowser) {
      const userInfo: UserInfo = { username, roles };
      sessionStorage.setItem('current_user', JSON.stringify(userInfo));
    }
  }

  getUser(): UserInfo | null {
    if (!this.isBrowser) return null;
    const userStr = sessionStorage.getItem('current_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  clearTokens(): void {
    this.clear();
    if (this.isBrowser) {
      sessionStorage.removeItem('current_user');
    }
  }

  clear() {
    this.setAccessToken(null);
    this.setRefreshToken(null);
  }

  isAccessTokenValid(): boolean {
    return !this.isAccessTokenExpired();
  }

  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    const decoded = this.decode(token);
    if (!decoded?.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp <= now;
  }

  decode(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch {
      return null;
    }
  }
}

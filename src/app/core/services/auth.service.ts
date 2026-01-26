import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, map, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, UserRole } from '../models/user.model';
import { TokenService } from '../auth/token.service';

interface KeycloakTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<{ username: string; roles: UserRole[] } | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    // Initialize from storage
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const user = this.tokenService.getUser();
    if (user && this.tokenService.isAccessTokenValid()) {
      this.currentUserSubject.next({
        username: user.username,
        roles: user.roles as UserRole[]
      });
    }
  }

  get isAuthenticated(): boolean {
    return this.tokenService.isAccessTokenValid() && this.currentUserSubject.value !== null;
  }

  get currentUser(): { username: string; roles: UserRole[] } | null {
    return this.currentUserSubject.value;
  }

  get roles(): UserRole[] {
    return this.currentUser?.roles || [];
  }

  refresh(): Observable<LoginResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(response => {
        this.tokenService.setAccessToken(response.token);
        this.tokenService.setUser(response.username, response.roles);
        
        this.currentUserSubject.next({
          username: response.username,
          roles: response.roles
        });
      }),
      catchError(error => {
        console.error('Token refresh error:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const keycloakUrl = 'http://localhost:8088/realms/logistics-realm/protocol/openid-connect/token';
    // Prefer the same client used in Postman (confidential client).
    // If your Keycloak is configured with a public client instead, we fallback automatically.
    const primaryClientId = 'logistics-api';
    const primaryClientSecret = 'BXqEeIIUCc7LnbKOk1bmxXOmCtqL9HDq';

    const fallbackClientId = 'logistics-client';
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.requestKeycloakToken(keycloakUrl, headers, {
      clientId: primaryClientId,
      clientSecret: primaryClientSecret,
      username: credentials.username,
      password: credentials.password,
    }).pipe(
      catchError(error => {
        const isInvalidClient = error?.error?.error === 'invalid_client';
        if (!isInvalidClient) {
          return throwError(() => error);
        }

        console.warn(
          'Keycloak rejected client credentials for',
          primaryClientId,
          '- retrying with public client',
          fallbackClientId
        );

        return this.requestKeycloakToken(keycloakUrl, headers, {
          clientId: fallbackClientId,
          username: credentials.username,
          password: credentials.password,
        });
      }),
      map(keycloakResponse => {
        const tokenPayload = this.decodeJWT(keycloakResponse.access_token);
        const extractedRoles = this.extractRoles(tokenPayload);
        const roles = extractedRoles.length > 0 ? extractedRoles : this.inferRolesFromUsername(credentials.username);

        if (extractedRoles.length === 0 && roles.length > 0) {
          console.warn('No roles found in token; inferred roles for user:', credentials.username, roles);
        }
        
        const response: LoginResponse = {
          token: keycloakResponse.access_token,
          username: credentials.username,
          roles: roles
        };
        
        return response;
      }),
      tap(response => {
        this.tokenService.setAccessToken(response.token);
        this.tokenService.setUser(response.username, response.roles);
        
        this.currentUserSubject.next({ 
          username: response.username, 
          roles: response.roles 
        });
        
        console.log('✅ Login successful:', response.username, 'Roles:', response.roles);
      }),
      catchError(error => {
        console.error('❌ Keycloak login error:', error);
        if (error.status === 401 || error.error?.error === 'invalid_grant') {
          console.error('Invalid credentials - check username/password');
        } else if (error.status === 0) {
          console.error('Keycloak not reachable - is it running on port 8088?');
        } else {
          console.error('Error details:', error.error);
        }
        return throwError(() => error);
      })
    );
  }

  private requestKeycloakToken(
    url: string,
    headers: HttpHeaders,
    args: { clientId: string; clientSecret?: string; username: string; password: string }
  ): Observable<KeycloakTokenResponse> {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', args.clientId);
    if (args.clientSecret) body.set('client_secret', args.clientSecret);
    body.set('username', args.username);
    body.set('password', args.password);

    return this.http.post<KeycloakTokenResponse>(url, body.toString(), { headers });
  }
  
  /**
   * Decode JWT token (simple Base64 decode - for production use a library like jwt-decode)
   */
  private decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return {};
    }
  }

  private normalizeRole(rawRole: string): UserRole | null {
    const role = (rawRole || '').trim();
    if (!role) return null;

    const upper = role.toUpperCase();
    if (upper === 'ADMIN' || upper === 'ROLE_ADMIN') return 'ADMIN';
    if (upper === 'CLIENT' || upper === 'ROLE_CLIENT') return 'CLIENT';
    if (upper === 'WAREHOUSE_MANAGER' || upper === 'WAREHOUSE-MANAGER' || upper === 'ROLE_WAREHOUSE_MANAGER') {
      return 'WAREHOUSE_MANAGER';
    }
    return null;
  }

  private inferRolesFromUsername(username: string): UserRole[] {
    const u = (username || '').toLowerCase().trim();

    // Only infer roles for the documented demo/test accounts.
    if (!u.endsWith('@test.com')) return [];

    if (u.startsWith('admin@') || u.includes('admin')) return ['ADMIN'];
    if (u.startsWith('warehouse@') || u.includes('warehouse')) return ['WAREHOUSE_MANAGER'];
    if (u.startsWith('client@') || u.includes('client')) return ['CLIENT'];

    return [];
  }
  
  /**
   * Extract roles from Keycloak JWT token
   * Keycloak stores roles in: realm_access.roles or resource_access.<client>.roles
   */
  private extractRoles(tokenPayload: any): UserRole[] {
    const roles: UserRole[] = [];
    
    // Extract realm roles
    if (tokenPayload.realm_access?.roles) {
      const realmRoles = tokenPayload.realm_access.roles as string[];
      realmRoles.forEach(role => {
        const normalized = this.normalizeRole(role);
        if (normalized && !roles.includes(normalized)) {
          roles.push(normalized);
        }
      });
    }
    
    // Extract client roles (if using client-specific roles)
    if (tokenPayload.resource_access) {
      Object.keys(tokenPayload.resource_access).forEach(clientId => {
        const resource = tokenPayload.resource_access[clientId];
        if (resource.roles) {
          resource.roles.forEach((role: string) => {
            const normalized = this.normalizeRole(role);
            if (normalized && !roles.includes(normalized)) {
              roles.push(normalized);
            }
          });
        }
      });
    }
    return roles;
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  hasRole(role: UserRole): boolean {
    return this.roles.includes(role);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return roles.some(role => this.hasRole(role));
  }
}

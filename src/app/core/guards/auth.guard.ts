import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../auth/token.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const tokens = inject(TokenService);
  const router = inject(Router);

  const hasValidToken = !!tokens.getAccessToken() && !tokens.isAccessTokenExpired();
  if (authService.isAuthenticated && hasValidToken) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

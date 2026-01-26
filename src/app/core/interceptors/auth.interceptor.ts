import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../auth/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getAccessToken();

  // Skip adding token for login endpoint
  if (req.url.includes('/auth/login') || req.url.includes('/protocol/openid-connect/token')) {
    return next(req);
  }

  if (accessToken && tokenService.isAccessTokenValid()) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};

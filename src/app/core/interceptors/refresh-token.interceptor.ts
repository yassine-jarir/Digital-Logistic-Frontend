import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../auth/token.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // If 401 and access token expired, attempt refresh
      if (error.status === 401 && tokenService.isAccessTokenExpired()) {
        const refresh = tokenService.getRefreshToken();
        if (!refresh) {
          authService.logout();
          return throwError(() => error);
        }
        return authService.refresh().pipe(
          switchMap((ok) => {
            if (!ok) {
              authService.logout();
              return throwError(() => error);
            }
            const updatedAccess = tokenService.getAccessToken();
            const replayed = req.clone({
              setHeaders: updatedAccess ? { Authorization: `Bearer ${updatedAccess}` } : {},
            });
            return next(replayed);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Bad Request';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please login again.';
            authService.logout();
            break;
          case 403:
            errorMessage = 'Access denied. You don\'t have permission.';
            // Do not hard-redirect on API 403s; pages can handle partial failures.
            // (Route-level access control is handled by guards.)
            break;
          case 404:
            errorMessage = error.error?.message || 'Resource not found';
            break;
          case 409:
            errorMessage = error.error?.message || 'Conflict - operation failed';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          default:
            errorMessage = error.error?.message || `Error: ${error.status}`;
        }
      }

      // Show notification for non-401 errors (401 triggers logout)
      if (error.status !== 401) {
        notificationService.error(errorMessage);
      }

      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        detail: error.error?.detail,
        timestamp: error.error?.timestamp,
        path: error.error?.path
      }));
    })
  );
};

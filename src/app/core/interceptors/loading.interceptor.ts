import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // You can inject a LoadingService here to show/hide spinner
  // const loadingService = inject(LoadingService);
  // loadingService.show();

  return next(req).pipe(
    // finalize(() => loadingService.hide())
  );
};

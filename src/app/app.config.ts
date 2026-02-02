import { ApplicationConfig, InjectionToken, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { mockBackendInterceptor } from './core/interceptors/mock-backend.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { productsReducer } from './features/client/pages/products/store/products.reducer';
import { ProductsEffects } from './features/client/pages/products/store/products.effects';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptors([
        // mockBackendInterceptor, // Disabled - using real backend
        authInterceptor,
        errorInterceptor,
        loadingInterceptor,
      ])
    ),
    { provide: API_BASE_URL, useValue: 'http://localhost:9090/api' },
    provideStore({ clientProducts: productsReducer }),
    provideEffects([ProductsEffects])
  ]
};

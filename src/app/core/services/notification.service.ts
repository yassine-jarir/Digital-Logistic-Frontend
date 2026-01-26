import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  success(message: string) {
    // Minimal placeholder: console; can be replaced by snackbar component
    console.log('[SUCCESS]', message);
  }
  error(message: string) {
    console.error('[ERROR]', message);
  }
  info(message: string) {
    console.log('[INFO]', message);
  }
}

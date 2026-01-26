import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div 
        *ngFor="let notification of notifications" 
        class="notification"
        [class.success]="notification.type === 'success'"
        [class.error]="notification.type === 'error'"
        [class.info]="notification.type === 'info'"
        [class.warning]="notification.type === 'warning'"
      >
        <span class="icon">{{ getIcon(notification.type) }}</span>
        <span class="message">{{ notification.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .notification {
      min-width: 300px;
      max-width: 500px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: slideIn 0.3s ease-out;
      background: white;
      border-left: 4px solid;
    }

    .notification.success {
      border-left-color: #4caf50;
      background: #f1f8f4;
    }

    .notification.error {
      border-left-color: #f44336;
      background: #fef4f3;
    }

    .notification.info {
      border-left-color: #2196f3;
      background: #f0f7ff;
    }

    .notification.warning {
      border-left-color: #ff9800;
      background: #fff8f0;
    }

    .icon {
      font-size: 1.25rem;
      font-weight: bold;
    }

    .message {
      flex: 1;
      font-size: 0.95rem;
      color: #333;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 576px) {
      .notification-container {
        right: 10px;
        left: 10px;
      }

      .notification {
        min-width: auto;
      }
    }
  `]
})
export class NotificationToastComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notification$.subscribe(notification => {
      this.notifications.push(notification);

      // Auto-remove after duration
      setTimeout(() => {
        this.removeNotification(notification);
      }, notification.duration || 3000);
    });
  }

  removeNotification(notification: Notification): void {
    const index = this.notifications.indexOf(notification);
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'info': return 'ℹ';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  }
}

import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../api/user.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Users received:', users);
        this.ngZone.run(() => {
          this.users = users;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error loading users:', err);
        this.ngZone.run(() => {
          this.error = 'Failed to load users. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to deactivate user ${user.name}?`)) {
      this.userService.deleteUser(String(user.id!)).subscribe({
        next: () => {
          this.loadUsers();
          console.log('User deactivated successfully');
        },
        error: (err: any) => {
          console.error('Error deactivating user:', err);
          this.error = 'Failed to deactivate user. Please try again.';
        }
      });
    }
  }
}

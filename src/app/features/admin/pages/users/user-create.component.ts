import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../api/user.service';
import { UserRole } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent {
  user = {
    email: '',
    name: '',
    password: '',
    role: 'CLIENT' as UserRole
  };

  roles: UserRole[] = ['ADMIN', 'WAREHOUSE_MANAGER', 'CLIENT'];
  loading = false;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.user.email || !this.user.name || !this.user.password) {
      this.error = 'All fields are required';
      return;
    }

    this.loading = true;
    this.error = null;

    this.userService.createUser(this.user).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/users']);
      },
      error: (err: any) => {
        console.error('Error creating user:', err);
        this.error = err.error?.message || 'Failed to create user. Please try again.';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }
}

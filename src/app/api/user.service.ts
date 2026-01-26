import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { User } from '../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private base = inject(API_BASE_URL);

  // ADMIN endpoints
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/admin/users`);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.base}/admin/users/${id}`);
  }

  createUser(body: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.base}/admin/users`, body);
  }

  updateUser(id: string, body: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.base}/admin/users/${id}`, body);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/users/${id}`);
  }
}

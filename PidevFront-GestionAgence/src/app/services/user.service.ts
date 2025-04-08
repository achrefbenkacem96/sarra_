import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators'; // ✅ Import tap operator

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8083/users';
  public signupEmail: string | null = null;

  constructor(private http: HttpClient) { }

  signup(user: User, image?: File): Observable<any> {
    const formData = new FormData();
    formData.append('user', JSON.stringify(user));
    if (image) {
      formData.append('image', image);
    }
    return this.http.post(`${this.baseUrl}`, formData).pipe(
      tap(() => {
        // Store email in localStorage after successful signup
        localStorage.setItem('signupEmail', user.email);
      })
    );
    return this.http.post(`${this.baseUrl}`, formData);
  }
  verifyOtp(data: { email: string, otp: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify`, data, { responseType: 'text' });
  }
  resendOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resend-otp`, { email },{ responseType: 'text' });
  }
  getAllUsers(): Observable<User[]> {

    return this.http.get<User[]>(`${this.baseUrl}`);
  }
  deleteUser(cin: string): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${cin}`, { responseType: 'text' });
  }
  updateUser(cin: string, user: User, image?: File): Observable<User> {
    const formData = new FormData();
  
    // Fix: Append user as a plain string (not a Blob)
    formData.append('user', JSON.stringify(user));
  
    if (image) {
      formData.append('image', image);
    }
  
    return this.http.put<User>(`${this.baseUrl}/${cin}`, formData);
  }
  
  
}

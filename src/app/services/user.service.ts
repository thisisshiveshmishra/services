import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviorments/environment.prod';

const NAV_URL= environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    let params = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.http.post(`${NAV_URL}/users/login`, null, { params });
  }

  register(user: any): Observable<any> {
  return this.http.post(`${NAV_URL}/users/register`, user);
}


  logout() {
    const user = this.getCurrentUser();
    if (user && user.id) {
      this.http.post(`${NAV_URL}/users/logout/${user.id}`, {}).subscribe();
    }
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
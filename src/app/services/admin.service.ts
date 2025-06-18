import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviorments/environment.prod';

const BASE_URL = 'http://localhost:8080/api/admin';
const NAV_URL = environment.apiURL;


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  register(admin: any): Observable<any> {
    return this.http.post(`${BASE_URL}/register`, admin);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${BASE_URL}/login`, null, {
      params: { username, password },
      responseType: 'text'
    });
  }
   getAllServiceRequests(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:8080/api/help/getAllRequests');
}
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviorments/environment.prod';

const NAV_URL = environment.apiURL;


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  register(admin: any): Observable<any> {
    return this.http.post(`${NAV_URL}/admin/register`, admin);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${NAV_URL}/admin/login`, null, {
      params: { username, password },
      responseType: 'text'
    });
  }
   getAllServiceRequests(): Observable<any[]> {
  return this.http.get<any[]>(`${NAV_URL}/help/getAllRequests`);
}
}

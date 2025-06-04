import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {
 
  private baseUrl = 'http://localhost:8080/api/providers'; // Adjust backend port if needed
 
  constructor(private http: HttpClient) {}
 
  registerProvider(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, formData);
  }
 
  loginProvider(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get(`${this.baseUrl}/login`, { params, responseType: 'text' });
  }
  getAllProviders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }
 
  approveProvider(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/approve/${id}`, {});
  }
}
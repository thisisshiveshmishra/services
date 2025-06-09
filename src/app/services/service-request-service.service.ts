import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceRequest } from '../model/service-request';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestServiceService {

   private baseUrl = 'http://localhost:8080/api/help';

  constructor(private http: HttpClient) {}

  createServiceRequest(request: ServiceRequest): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(`${this.baseUrl}/CreateServiceRequest`, request);
  }

  updateServiceRequest(id: number, request: ServiceRequest): Observable<ServiceRequest> {
    return this.http.put<ServiceRequest>(`${this.baseUrl}/updateServiceRequest/${id}`, request);
  }

  getAllRequests(): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(`${this.baseUrl}/getAllRequests`);
  }

  getRequestById(id: number): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(`${this.baseUrl}/getRequestById/${id}`);
  }

  getRequestByName(name: string): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(`${this.baseUrl}/getRequestByName/${name}`);
  }

  getRequestByEmail(email: string): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(`${this.baseUrl}/getRequestByEmail/${email}`);
  }

  deleteRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteRequestById/${id}`);
  }

  
}


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceRequest } from '../model/service-request';
import { environment } from '../enviorments/environment.prod';
const baseUrl=environment.apiURL;
@Injectable({
  providedIn: 'root'
})
export class ServiceRequestServiceService {

  

  constructor(private http: HttpClient) {}

  createServiceRequest(request: ServiceRequest): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(`${baseUrl}/help/CreateServiceRequest`, request);
  }

  updateServiceRequest(id: number, request: ServiceRequest): Observable<ServiceRequest> {
    return this.http.put<ServiceRequest>(`${baseUrl}/help/updateServiceRequest/${id}`, request);
  }

  getAllRequests(): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(`${baseUrl}/help/getAllRequests`);
  }

  getRequestById(id: number): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(`${baseUrl}/help/getRequestById/${id}`);
  }

  getRequestByName(name: string): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(`${baseUrl}/help/getRequestByName/${name}`);
  }

  getRequestByEmail(email: string): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(`${baseUrl}/help/getRequestByEmail/${email}`);
  }

  deleteRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/help/deleteRequestById/${id}`);
  }

  
}


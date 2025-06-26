import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviorments/environment.prod';
import { Serviceprovider } from '../model/serviceprovider';

export interface SearchRequest {

  category: string;

  location: string;

}



const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {

  private baseUrl = ''; // Adjust backend port if needed

  constructor(private http: HttpClient) {}

  registerProvider(formData: FormData): Observable<any> {
    return this.http.post(`${NAV_URL}/providers/save`, formData);
  }


login(email: string, password: string): Observable<any> {
  const params = new HttpParams()
    .set('email', email)
    .set('password', password);

  return this.http.get(`${NAV_URL}/providers/login`, {
    params,
    responseType: 'text',
  });
}

  getAllProviders(): Observable<any[]> {
    return this.http.get<any[]>(`${NAV_URL}/providers`);
  }

  approveProvider(id: number): Observable<any> {
    return this.http.put(`${NAV_URL}/providers/approve/${id}`, {});
  }

    getMatchesForAllRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${NAV_URL}/providers/match-all`);
  }

  getProviderByEmail(email: string): Observable<any> {
  return this.http.get(`${NAV_URL}/providers/email/${email}`);
}

  updateProvider(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${NAV_URL}/providers/update/${id}`, formData);
  }


   searchProviders(request: SearchRequest): Observable<Serviceprovider[]> {

    return this.http.post<Serviceprovider[]>(`${NAV_URL}/providers/search`, request);

  }


  // service-provider.service.ts
forgotPassword(email: string, newPassword: string): Observable<string> {
  const params = new HttpParams()
    .set('email', email)
    .set('newPassword', newPassword);

  return this.http.put(`${NAV_URL}/providers/forgot-password`, null, {
    params,
    responseType: 'text',
  });
}

saveProvider(formData: FormData): Observable<any> {
  return this.http.post(`${NAV_URL}/providers/save`, formData);
}


uploadImages(providerId: number, formData: FormData) {
  return this.http.post(`${NAV_URL}/providers/${providerId}/upload-images`, formData);
}

getImages(providerId: number) {
  return this.http.get<string[]>(`${NAV_URL}/providers/${providerId}/images`);
}

getProviderById(id: number): Observable<Serviceprovider> {
  return this.http.get<Serviceprovider>(`${NAV_URL}/providers/${id}`);
}

getProviderImages(id: number): Observable<string[]> {
  return this.http.get<string[]>(`${NAV_URL}/providers/${id}/images`);
}

}

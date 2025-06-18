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
    return this.http.post(`${NAV_URL}/providers/register`, formData);
  }

 login(email: string, password: string): Observable<any> {
  const params = new HttpParams()
    .set('email', email)
    .set('password', password);

  return this.http.post(`${NAV_URL}/providers/login`, null, {
    params,
    responseType: 'text'
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



}

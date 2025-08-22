import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../enviorments/environment.prod';
import { Serviceprovider } from '../model/serviceprovider';
 
export interface SearchRequest {
  category: string;
  location: string;
}
 
export interface ImageResponseDTO {
  imageId: number;
  base64Image: string;
}
 
const NAV_URL = environment.apiURL;
 
@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {
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
 
  rejectProvider(id: number) {
    return this.http.put(`${NAV_URL}/providers/${id}/reject`, null, { responseType: 'text' });
  }
 
  getMatchesForAllRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${NAV_URL}/providers/match-all`);
  }
 
  getProviderByEmail(email: string): Observable<any> {
    return this.http.get(`${NAV_URL}/providers/email/${email}`);
  }
 
  updateProvider(id: number, formData: FormData): Observable<any> {
    // keep your current update endpoint
    return this.http.put(`${NAV_URL}/providers/update/${id}`, formData);
  }
 
  searchProviders(request: SearchRequest): Observable<Serviceprovider[]> {
    return this.http.post<Serviceprovider[]>(`${NAV_URL}/providers/search`, request);
  }
 
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
 
  // ✅ Upload multiple images
  uploadImages(providerId: number, formData: FormData): Observable<any> {
    // matches your backend: POST /api/providers/{providerId}/upload-images
    return this.http.post(`${NAV_URL}/providers/${providerId}/upload-images`, formData, {
      responseType: 'text'
    });
  }
 
  // ✅ Fetch all images of a provider (imageId + base64Image) — primary method
  getProviderImages(providerId: number): Observable<ImageResponseDTO[]> {
    // matches your backend: GET /api/providers/{providerId}/images
    return this.http.get<ImageResponseDTO[]>(`${NAV_URL}/providers/${providerId}/images`);
  }
 
  // ✅ Alias so existing calls to getImages(...) keep working
  getImages(providerId: number): Observable<ImageResponseDTO[]> {
    return this.getProviderImages(providerId);
  }
 
  // ✅ Delete image by ID
  deleteImage(imageId: number): Observable<any> {
    // matches your backend: DELETE /api/providers/images/{imageId}
    return this.http.delete(`${NAV_URL}/providers/images/${imageId}`, {
      responseType: 'text'
    });
  }
 
  getProviderById(id: number): Observable<Serviceprovider> {
    return this.http.get<Serviceprovider>(`${NAV_URL}/providers/${id}`);
  }
 
  getProvidersByIds(ids: number[]): Observable<Serviceprovider[]> {
    const requests = ids.map(id => this.getProviderById(id));
    return forkJoin(requests);
  }
}
 
 
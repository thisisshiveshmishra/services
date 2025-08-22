import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviorments/environment.prod';

const NAV_URL= environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) {}

  sendMessage(userId: number, providerId: number, message: any): Observable<any> {
    return this.http.post(`${NAV_URL}/messages/${userId}/${providerId}`, message);
  }

  getMessagesByProvider(providerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${NAV_URL}/messages/byProviderWithUser/${providerId}`);
  }

  // ✅ New method to fetch chat between user and provider
  getMessagesByProviderAndUser(providerId: number, userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${NAV_URL}/messages/byProviderAndUser/${providerId}/${userId}`);
  }

  sendReply(messageId: number, reply: any): Observable<any> {
    return this.http.post(`${NAV_URL}/messages/replies/${messageId}`, reply);
  }
}

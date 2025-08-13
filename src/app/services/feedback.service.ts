import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviorments/environment.prod';

interface FeedbackPayload {
  name: string;
  email: string;
  message: string;
  rating: number;
}
const API_URL=environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {


  constructor(private http: HttpClient) {}

  // submitFeedback(feedback: FeedbackPayload): Observable<any> {
  //   return this.http.post(`${API_URL}/feedback/submitFeedback`, feedback);
  // }

  submitFeedback(feedback: {
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    message: string;
  }): Observable<any> {
    return this.http.post(`${API_URL}/feedback/submitFeedback`, feedback);
  }
 
    getAllFeedback(): Observable<any[]> {
  return this.http.get<any[]>(`${API_URL}/feedback/getAllFeedback`);
}
}

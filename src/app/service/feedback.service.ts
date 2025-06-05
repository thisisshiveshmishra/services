import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface FeedbackPayload {
  name: string;
  email: string;
  message: string;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private readonly API_URL = 'http://localhost:8080/api/feedback';

  constructor(private http: HttpClient) {}

  submitFeedback(feedback: FeedbackPayload): Observable<any> {
    return this.http.post(`${this.API_URL}/submitFeedback`, feedback);
  }
}

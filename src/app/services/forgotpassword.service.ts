import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviorments/environment.prod';

const NAV_URL= environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ForgotpasswordService {


  constructor(private http: HttpClient) {}

  // ------------------- 1️⃣ Request OTP -------------------
  requestOtp(email: string): Observable<string> {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${NAV_URL}/password/request-otp`, null, {
      params,
      responseType: 'text'
    });
  }

  // ------------------- 2️⃣ Verify OTP -------------------
  verifyOtp(email: string, otp: string): Observable<string> {
    const params = new HttpParams().set('email', email).set('otp', otp);
    return this.http.post(`${NAV_URL}/password/verify-otp`, null, {
      params,
      responseType: 'text'
    });
  }

  // ------------------- 3️⃣ Reset Password -------------------
  resetPassword(email: string, newPassword: string): Observable<string> {
  const params = new HttpParams()
    .set('email', email)
    .set('newPassword', newPassword);

  return this.http.post(`${NAV_URL}/password/reset`, null, {
    params,
    responseType: 'text'
  });
}
}

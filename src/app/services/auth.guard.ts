// auth.guard.ts
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    return true;
  } else {
    window.alert('Access denied. Please login as admin.');
    window.location.href = '/adminlogin';
    return false;
  }



  
};


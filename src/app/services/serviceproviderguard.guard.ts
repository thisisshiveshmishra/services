import { CanActivateFn } from '@angular/router';

export const serviceproviderguardGuard: CanActivateFn = (route, state) => {
 const providerEmail = localStorage.getItem('providerEmail');
  const providerId = localStorage.getItem('providerId');

  if (providerEmail) {
    return true; // ✅ logged in provider can access
  } else {
    window.alert('Access denied. Please login as service provider.');
    window.location.href = '/loginserviceprovider';
    return false; // ❌ block navigation
  }
};

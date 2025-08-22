// src/app/model/serviceprovider.ts
 
export interface Serviceprovider {
  id?: number;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  location: string;
  gender: string;
  category: string;
  password: string;
  profilePicture?: string;
  approved?: boolean;
  profilePictureBase64?: string;
}
 
// 👇 Add this interface for image API response
export interface ProviderImage {
  id: number;
  base64Image: string; // backend returns base64 string
  providerId: number;
}
 
 
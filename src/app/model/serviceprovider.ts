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
  profilePicture?: File | string;
  approved?: boolean; // If your backend handles approval logic 
}

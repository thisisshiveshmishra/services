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
  profilePicture?: string; // changed from number[] to string
  approved?: boolean;
  profilePictureBase64?: string;
}

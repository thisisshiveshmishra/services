export interface ServiceRequest {
    id?: number;
  name: string;
  surname: string;
  contactNumber: string;
  email: string;
  location: string;
  category?: string; // enum as string
  query?: string;
}

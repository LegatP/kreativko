import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  deliveryAddress?: {
    address: string;
    city: string;
    postCode: string;
    country: string;
  };
  termsAcceptedAt: Date;
  newsletterSubscribed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

import { setDoc } from "@/lib/firebase/firestore";

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  deliveryAddress: {
    address: string;
    city: string;
    postCode: string;
    country: string;
  };
  termsAcceptedAt: Date;
  newsletterSubscribed: boolean;
}

export async function setUserProfile(
  userId: string,
  profile: Partial<UserProfile>
) {
  return setDoc({
    ref: `users/${userId}`,
    data: profile,
  });
}

import { Timestamp } from "firebase/firestore";
import { DesignUrls } from "../orders/types";

export interface DesignSession {
  id: string;
  userId: string;
  uploadedAssets: { url: string }[];
  createdDesigns: { url: string; title: string }[];
  designUrls?: DesignUrls;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

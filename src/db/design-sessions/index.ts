import db, { addDoc, updateDoc } from "@/lib/firebase/firestore";
import {
  DocumentData,
  FirestoreDataConverter,
  Timestamp,
  WithFieldValue,
  QueryDocumentSnapshot,
  SnapshotOptions,
  doc,
} from "firebase/firestore";
import {
  useDocumentData,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";

export const DESIGN_SESSION_COLLECTION = "design_sessions";

export interface DesignSession {
  id: string;
  userId: string;
  uploadedAssets: { url: string }[];
  createdDesigns: { url: string; title: string }[];
  createdAt: Timestamp;
}

export const createDesignSession = addDoc<DesignSession>(
  DESIGN_SESSION_COLLECTION
);

export const updateDesignSession = updateDoc<DesignSession>(
  DESIGN_SESSION_COLLECTION
);

const converter: FirestoreDataConverter<DesignSession> = {
  toFirestore(data: WithFieldValue<DesignSession>): DocumentData {
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): DesignSession {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
    } as DesignSession;
  },
};

export const useDesignSessionOnce = (id: string) => {
  const d = doc(db, DESIGN_SESSION_COLLECTION, id).withConverter(converter);
  return useDocumentDataOnce<DesignSession>(d);
};

export const useDesignSessionListener = (id: string) => {
  const d = doc(db, DESIGN_SESSION_COLLECTION, id).withConverter(converter);
  return useDocumentData<DesignSession>(d);
};

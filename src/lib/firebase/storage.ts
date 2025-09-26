import auth from "./auth";
import app from "./init";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";

const storage = getStorage(app);

export const uploadFile = async (file: File | string) => {
  const fileName = `${auth.currentUser!.uid}/${Date.now()}_${
    file instanceof File ? file.name : `ai_generated.png`
  }`;
  const storageRef = ref(storage, fileName);

  try {
    if (typeof file === "string") {
      await uploadString(storageRef, file, "base64");
    } else {
      await uploadBytes(storageRef, file, { contentType: file.type });
    }
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};

export default storage;

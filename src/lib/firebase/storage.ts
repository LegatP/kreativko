import auth from "./auth";
import fb from "./init";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";

const storage = getStorage(fb);

export const uploadFile = async (file: File | string) => {
  const fileName = `${auth.currentUser!.uid}/${Date.now()}_${file.name}`;
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

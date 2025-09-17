import auth from "./auth";
import fb from "./init";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage(fb);

export const uploadFile = async (file: File) => {
  const fileName = `${auth.currentUser!.uid}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, fileName);

  try {
    await uploadBytes(storageRef, file, { contentType: file.type });
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};

export default storage;

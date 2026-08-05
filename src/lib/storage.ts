import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadUserPostMedia(
  userId: string,
  file: File | Blob,
  folder: "uploads" | "generated" = "generated"
): Promise<string> {
  const storage = getStorage();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
  
  // Encapsulate path inside /users/{userId}/{folder}/
  const fileRef = ref(storage, `users/${userId}/${folder}/${fileName}`);

  const snapshot = await uploadBytes(fileRef, file, {
    contentType: file.type || "image/png",
  });

  return await getDownloadURL(snapshot.ref);
}
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "@/firebase/clientApp";

interface UseProjectCoverImageUploadProps {
  userId: string;
  repoId: string | number;
}

interface UseProjectCoverImageUploadResult {
  uploadCoverImage: (file: File) => Promise<string | null>;
  progress: number;
  isUploading: boolean;
  error: string | null;
  imgUrl: string;
}

export const useProjectCoverImageUpload = ({ userId, repoId }: UseProjectCoverImageUploadProps): UseProjectCoverImageUploadResult => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState("");

  const uploadCoverImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    setProgress(0);
    setImgUrl("");
    const extension = file.name.split(".").pop();
    const storageRef = ref(
      storage,
      `users/${userId}/repos/${repoId}/images/coverImage/${file.name}`
    );
    try {
      notifications.show({
        id: "load-data",
        loading: true,
        title: "Uploading Image",
        message: `Cover image is uploading... (0%)`,
        autoClose: false,
        withCloseButton: false,
      });
      const uploadTask = uploadBytesResumable(storageRef, file);
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progress);
            notifications.update({
              id: "load-data",
              title: "Uploading Image",
              message: `Cover image is uploading... (${progress}%)`,
              loading: true,
              autoClose: false,
              withCloseButton: false,
            });
          },
          (err) => {
            setError(err.message);
            notifications.update({
              id: "load-data",
              color: "red",
              title: "Something went wrong",
              message: err.message,
              autoClose: 2000,
            });
            setIsUploading(false);
            reject(err);
          },
          async () => {
            try {
              notifications.update({
                id: "load-data",
                title: "Saving Image Info",
                message: `Cover image uploaded, saving info...`,
                loading: true,
                autoClose: false,
                withCloseButton: false,
              });
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const docRef = doc(
                db,
                `users/${userId}/repos/${repoId}/projectData/mainContent`
              );
              const parentStorageRef = doc(db, `users/${userId}/repos/${repoId}`);
              const backupStorageRef = doc(
                db,
                `users/${userId}/repos/${repoId}/projectData/images`
              );
              const sizes = [
                "200x200",
                "400x400",
                "768x768",
                "1024x1024",
                "2000x2000",
                "4000x4000",
              ];
              const coverImageMeta = {
                name: file.name,
                extension,
                sizes,
              };
              await setDoc(
                docRef,
                {
                  coverImageMeta: coverImageMeta,
                  coverImage: downloadURL,
                },
                { merge: true }
              );
              await setDoc(
                parentStorageRef,
                {
                  coverImageMeta: coverImageMeta,
                  coverImage: downloadURL,
                },
                { merge: true }
              );
              await setDoc(
                backupStorageRef,
                {
                  coverImageMeta: coverImageMeta,
                  coverImage: downloadURL,
                },
                { merge: true }
              );
              setImgUrl(downloadURL);
              notifications.update({
                id: "load-data",
                color: "teal",
                title: "Image was saved",
                message: "Cover image uploaded to the database",
                // icon: <IconCheck />,
                autoClose: 2000,
              });
              setIsUploading(false);
              resolve();
            } catch (firestoreErr: any) {
              setError(firestoreErr.message);
              notifications.update({
                id: "load-data",
                color: "red",
                title: "Something went wrong",
                message: firestoreErr.message,
                // icon: <IconCross size="1rem" />,
                autoClose: 2000,
              });
              setIsUploading(false);
              reject(firestoreErr);
            }
          }
        );
      });
      return storageRef.fullPath ? await getDownloadURL(storageRef) : null;
    } catch (err: any) {
      setError(err.message);
      setIsUploading(false);
      return null;
    }
  };

  return { uploadCoverImage, progress, isUploading, error, imgUrl };
}; 
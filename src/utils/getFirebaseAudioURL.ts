export const getFirebaseAudioURL = (mp3FileName: string) => {
  const baseURL = process.env.NEXT_PUBLIC_FIREBASE_AUDIO_URL;
  const firebaseToken = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_ID;
  const url = `${baseURL}${mp3FileName}.mp3?alt=media&token=${firebaseToken}`;

  return url;
};

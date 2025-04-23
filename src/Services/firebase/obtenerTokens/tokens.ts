import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const fetchAllDeviceTokens = async (): Promise<string[]> => {
  try {
    const snapshot = await getDocs(collection(db, "deviceTokens"));
    const tokens: string[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.token) {
        tokens.push(data.token);
      }
    });

    return tokens;
  } catch (error) {
    console.error("Error fetching device tokens:", error);
    return [];
  }
};

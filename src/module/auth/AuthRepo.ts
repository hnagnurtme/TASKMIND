import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/configurations/firebase.config";
import { doc, setDoc, getDoc, } from "firebase/firestore";

export class AuthRepo {
  static async register(email: string, password: string, name: string) {
    try {
      // Đăng ký user bằng Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lưu thông tin user profile vào Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        name,
        createdAt: new Date()
      });

      return { success: true, userId: user.uid };
    } catch (error) {
      console.error("Error registering user:", error);
      return { success: false, error };
    }
  }

  static async login(email: string, password: string) {
    try {
      // Login qua Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lấy profile từ Firestore
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (!docSnap.exists()) {
        return { success: false, message: "User profile not found" };
      }

      return { success: true, user: { uid: user.uid, ...docSnap.data() } };
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, error };
    }
  }
}

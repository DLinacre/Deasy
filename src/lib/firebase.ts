import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider with tasks and chat scopes
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/tasks");
provider.addScope("https://www.googleapis.com/auth/tasks.readonly");
provider.addScope("https://www.googleapis.com/auth/chat.messages");
provider.addScope("https://www.googleapis.com/auth/chat.messages.create");
provider.addScope("https://www.googleapis.com/auth/chat.spaces");
provider.addScope("https://www.googleapis.com/auth/chat.spaces.readonly");
provider.addScope("https://www.googleapis.com/auth/chat.memberships");
provider.addScope("https://www.googleapis.com/auth/chat.memberships.readonly");

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize Auth Listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If we don't have a cached token but have a user, we might need a re-auth,
        // or we can try to retrieve the token. For simplicity, we trigger auth flow.
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Trigger google sign-in with popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to get access token from Firebase Auth");
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const googleSignOut = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

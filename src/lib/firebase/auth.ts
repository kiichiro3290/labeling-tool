"use client"

import { UserCredential, createUserWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth/cordova"
import { auth } from "./client";

export const login = (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    console.log(auth)
    return signInWithRedirect(auth, provider)
}

export const logout = (): Promise<void> => {
    return signOut(auth);
};

export const createUser = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
}



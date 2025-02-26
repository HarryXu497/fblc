import { firebaseAuth, firestore } from "$lib/firebase";
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    type User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

/**
 * Creates an auth object with a stateful 'value' property
 * and helper methods to manage the state
 */
function createAuthState() {
    let userState = $state<User | null>(null);

    return {
        get value() {
            return userState;
        },
        set value(user: User | null) {
            userState = user;
        },
        async signUp(
            email: string,
            password: string,
            firstName: string,
            lastName: string,
        ) {
            const res = await createUserWithEmailAndPassword(
                firebaseAuth,
                email,
                password,
            );

            // Set display name in Firebase Auth
            await updateProfile(res.user, {
                displayName: firstName + " " + lastName,
            });

            // Set corresponding document in Firebase Cloud Firestore
            await setDoc(doc(firestore, "users", res.user.uid), {
                displayName: firstName + " " + lastName,
                email: email,
            });

            return res;
        },
        async logIn(email: string, password: string) {
            await signInWithEmailAndPassword(firebaseAuth, email, password);
        },
        async logOut() {
            await signOut(firebaseAuth);
        },
        async resetPassword(email: string) {
            await sendPasswordResetEmail(firebaseAuth, email);
        },
    };
}

const auth = createAuthState();

export default auth;

import { firestore } from "$lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { PublicUser } from "$lib/models/PublicUser.model";

/**
 * Gets the publically avaiable details of a user from the user ID
 * @param userId the ID of the user to retrieve
 * @returns public user detals or null if the user does not exist
 */
async function getPublicUser(userId: string): Promise<PublicUser | null> {
    const docRef = doc(firestore, "users", userId);

    const userDoc = await getDoc(docRef);

    if (!userDoc.exists) {
        return null;
    }

    return {
        displayName: userDoc.get("displayName") as string,
        email: userDoc.get("email") as string,
    };
}

export { getPublicUser };

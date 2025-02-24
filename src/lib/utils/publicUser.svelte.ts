import { firestore } from "$lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { PublicUser } from "$lib/models/PublicUser.model";

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

import { firestore } from "$lib/firebase";
import type { Garden, Tile } from "$lib/models/Garden.model";
import auth from "$lib/state/auth.svelte";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
} from "firebase/firestore";
import crops from "$lib/state/crops.svelte";

/**
 * Gets a garden from its ID
 * @param listingId the ID of the garden
 * @returns a corresponding Garden object or null if the user is not authenticated
 */
async function getGarden(gardenId: string): Promise<Garden | null> {
    const userId = auth.value?.uid;

    if (!userId) {
        return null;
    }

    const docRef = doc(firestore, "gardens", userId, "gardens", gardenId);

    const gardenDoc = await getDoc(docRef);

    if (!gardenDoc.exists()) {
        throw Error("garden does not exist");
    }

    const width = gardenDoc.get("width") as number;
    const height = gardenDoc.get("height") as number;
    const scale = gardenDoc.get("scale") as number;
    const name = gardenDoc.get("name") as string;

    const tilesCollectionRef = collection(docRef, "tiles");
    const tileDocs = await getDocs(tilesCollectionRef);

    // Convert Firestore tile data to a 2D tile array
    const tiles: Tile[][] = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => ({ crop: null, planted: false })),
    );

    for (const tileDoc of tileDocs.docs) {
        // Get the coordinate from the document id, which is formatted as x-coordinate,y-coordinate
        const [x, y] = tileDoc.id.split(",").map((n) => Number(n));

        // Delete doc if the location is invalid
        // This is due to edited location dimensions
        if (y >= tiles.length || x >= tiles[y].length) {
            await deleteDoc(tileDoc.ref);
        } else {
            const crop = tileDoc.get("name") as string;

            tiles[y][x] = {
                crop: crops.fromName(crop),
                planted: (tileDoc.get("planted") as boolean) || false,
            };
        }
    }

    return {
        id: gardenId,
        name,
        width,
        height,
        scale,
        tiles,
    };
}

/**
 * Gets all gardens
 * @returns a list of Garden objects or null if the user is not authenticated
 */
async function getGardens(): Promise<Garden[] | null> {
    const userId = auth.value?.uid;

    if (!userId) {
        return null;
    }

    const collectionRef = collection(firestore, "gardens", userId, "gardens");

    const gardenDocs = await getDocs(collectionRef);

    const gardens = await Promise.all(
        gardenDocs.docs.map((garden) => getGarden(garden.id)),
    );

    return gardens.filter((garden) => garden !== null);
}

export { getGarden, getGardens };

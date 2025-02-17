import { firestore } from "$lib/firebase";
import type { Garden, Tile } from "$lib/models/Garden.model";
import auth from "$lib/state/auth.svelte";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import crops from "./crops.svelte";

async function getGarden(gardenId: string): Promise<Garden | null> {
    const userId = auth.value?.uid;

    if (!userId) {
        return null;
    }

    const docRef = doc(firestore, "gardens", userId, "gardens", gardenId);

    const gardenDoc = await getDoc(docRef);

    const width = gardenDoc.get("width") as number;
    const height = gardenDoc.get("height") as number;
    const scale = gardenDoc.get("scale") as number;
    const name = gardenDoc.get("name") as string;
      
    const tiles: Tile[][] = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => ({ crop: null }))
    );

    const tilesCollectionRef = collection(docRef, "tiles");

    const tileDocs = await getDocs(tilesCollectionRef);

    for (const tileDoc of tileDocs.docs) {
        const [x, y] = tileDoc.id.split(",").map(n => Number(n));

        const crop = tileDoc.get("name") as string;

        tiles[y][x] = { crop: crops.fromName(crop) };
    }
  
    return {
        id: gardenId,
        name,
        width,
        height,
        scale,
        tiles,
    }
}

async function getGardens(): Promise<Garden[] | null> {
    const userId = auth.value?.uid;

    if (!userId) {
        return null;
    }

    const collectionRef = collection(firestore, "gardens", userId, "gardens");

    const gardenDocs = await getDocs(collectionRef)

    const gardens = await Promise.all(
        gardenDocs.docs
            .map(garden => getGarden(garden.id))
    )
  
    return gardens.filter(garden => garden !== null)
}

export { getGarden, getGardens }
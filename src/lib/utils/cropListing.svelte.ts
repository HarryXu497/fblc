import { firestore } from "$lib/firebase";
import auth from "$lib/state/auth.svelte";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import type { CropListing } from "$lib/models/CropListing.model";

async function getCropListing(listingId: string): Promise<CropListing | null> {
    const userId = auth.value?.uid;

    if (!userId) {
        return null;
    }

    const cropListingRef = doc(firestore, "seeds", listingId);

    const listingDoc = await getDoc(cropListingRef);

    return {
        id: listingDoc.id,
        geohash: listingDoc.get("geohash") as string,
        lat: listingDoc.get("lat") as number,
        lng: listingDoc.get("lng") as number,
        name: listingDoc.get("name") as string,
        description: listingDoc.get("description") as string,
        price: listingDoc.get("price") as number,
        quantity: listingDoc.get("quantity") as number,
        uid: auth.value!.uid as string,
        imageURLs: listingDoc.get("imageURLs") as string[],
    }
}

async function getCropListings(): Promise<CropListing[] | null> {
    const userId = auth.value?.uid;

    if (!userId) {
        return null;
    }

    const cropListingCollectionRef = collection(firestore, "seeds");

    const listingDocs = await getDocs(cropListingCollectionRef);

    return listingDocs.docs.map(listingDoc => ({
        id: listingDoc.id,
        geohash: listingDoc.get("geohash") as string,
        lat: listingDoc.get("lat") as number,
        lng: listingDoc.get("lng") as number,
        name: listingDoc.get("name") as string,
        description: listingDoc.get("description") as string,
        price: listingDoc.get("price") as number,
        quantity: listingDoc.get("quantity") as number,
        uid: auth.value!.uid as string,
        imageURLs: listingDoc.get("imageURLs") as string[],
    }))
}

export { getCropListing, getCropListings }
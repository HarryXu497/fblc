<script lang="ts">
    /**
     * A page that allows a user to upload a crop listing
     */

    import { goto } from "$app/navigation";
    import { modulo } from "$lib/components/LocationInput.svelte";
    import Metadata from "$lib/components/Metadata.svelte";
    import SellForm, { type SellValues } from "$lib/components/SellForm.svelte";
    import { firestore, storage } from "$lib/firebase";
    import type { CropListing } from "$lib/models/CropListing.model";
    import auth from "$lib/state/auth.svelte";
    import { addDoc, collection } from "firebase/firestore";
    import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
    import { geohashForLocation } from "geofire-common";
    import { v4 as uuidv4 } from "uuid";

    /**
     * Callback function executed when the form is submitted
     * @param sellValues values from the form inputs
     */
    async function onSubmit({
        crop,
        description,
        type,
        price,
        quantity,
        images,
        location,
    }: SellValues) {
        if (
            !location ||
            !type ||
            !crop ||
            !description.trim() ||
            !price ||
            !quantity ||
            !auth.value ||
            !images?.length
        ) {
            throw Error("Invalid inputs");
        }

        // Calculate geohash of user location
        const lat = location.lat;
        const lng = modulo(location.lng + 180, 360) - 180;
        const hash = geohashForLocation([lat, lng]);

        // Generate a unique ID for each image
        const imageFiles: File[] = [];

        for (const image of images) {
            imageFiles.push(image);
        }

        const imageIDs = imageFiles.map((image) => uuidv4());

        // Upload the files
        const downloadURLs = await Promise.all(
            imageFiles.map(async (img, i) => {
                if (!auth.value) {
                    return null;
                }

                const fileRef = ref(
                    storage,
                    `${auth.value.uid}/${imageIDs[i]}`,
                );
                const uploadTask = await uploadBytes(fileRef, img);
                return getDownloadURL(uploadTask.ref);
            }),
        );

        const seedsCollectionRef = collection(firestore, "seeds");
        await addDoc(seedsCollectionRef, {
            geohash: hash,
            lat: lat,
            lng: lng,
            name: crop.name,
            description: description,
            price: price,
            quantity: quantity,
            uid: auth.value.uid,
            imageIDs: imageIDs,
            imageURLs: downloadURLs.filter((a) => a !== null),
        } as CropListing);
        await goto("/buy");
    }
</script>

<Metadata title="sell crops | farmer's market" />

<SellForm {onSubmit} requireImages={false} />

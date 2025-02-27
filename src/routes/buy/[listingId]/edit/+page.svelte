<script lang="ts">
    /**
     * A page that allows users to edit their own listings
     */

    import { goto } from "$app/navigation";
    import Metadata from "$lib/components/Metadata.svelte";
    import { firestore, storage } from "$lib/firebase";
    import type { CropListing } from "$lib/models/CropListing.model";
    import auth from "$lib/state/auth.svelte";
    import crops from "$lib/state/crops.svelte";
    import getUserLocation from "$lib/utils/userLocation.svelte";
    import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
    import {
        deleteObject,
        getDownloadURL,
        ref,
        uploadBytes,
    } from "firebase/storage";
    import { geohashForLocation } from "geofire-common";
    import { v4 as uuidv4 } from "uuid";
    import type { PageProps } from "../$types";
    import { getCropListing } from "$lib/utils/cropListing.svelte";
    import SellForm, { type SellValues } from "$lib/components/SellForm.svelte";
    import { modulo } from "$lib/components/LocationInput.svelte";

    /**
     * Contains the listing ID from the URL
     */
    let { data }: PageProps = $props();

    let listing = $state<CropListing | null>(null);
    let initialValues = $state<SellValues | null>(null);

    $effect(() => {
        getCropListing(data.listingId)
            .then((l) => {
                // Prefill form values if they exist
                if (auth.value && l !== null) {
                    if (l.uid !== auth.value.uid) {
                        throw Error(
                            `Crop listing with id '${l.id}'' does not belong to the user.`,
                        );
                    }

                    initialValues = {
                        crop: crops.fromName(l.name),
                        description: l.description,
                        price: l.price,
                        quantity: l.quantity,
                        images: null,
                        location: {
                            lat: l.lat,
                            lng: l.lng,
                        }
                    };

                    listing = l;
                }
            })
            .catch((e) => goto("/buy"));
    });

    /**
     * Callback function executed when the form is submitted
     * @param sellValues values from the form inputs
     */
    async function onSubmit({
        crop,
        description,
        price,
        quantity,
        images,
        location,
    }: SellValues) {
        if (
            !location ||
            !crop ||
            !description.trim() ||
            !price ||
            !quantity ||
            !auth.value
        ) {
            throw Error("Invalid inputs");
        }

        // Calculate geohash based on current location
        const lat = location.lat;
        const lng = modulo(location.lng + 180, 360) - 180;
        const hash = geohashForLocation([lat, lng]);

        const seedDocRef = doc(firestore, "seeds", data.listingId);

        // Do not edit the images if none are uploaded
        if (!images || images.length === 0) {
            await updateDoc(seedDocRef, {
                geohash: hash,
                lat: lat,
                lng: lng,
                name: crop.name,
                description: description,
                price: price,
                quantity: quantity,
                uid: auth.value.uid,
            });
        } else {
            // Generate unique IDs for each image file
            const imageFiles: File[] = [];

            for (const image of images) {
                imageFiles.push(image);
            }

            const imageIDs = imageFiles.map((image) => uuidv4());

            // Upload each image file and get a download URL from each
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
            // Delete old images
            const listingDoc = await getDoc(seedDocRef);
            const oldImageIDs = listingDoc.get("imageIDs") as string[];

            await Promise.all(
                oldImageIDs.map(async (id) => {
                    if (!auth.value) {
                        return null;
                    }

                    const oldImageRef = ref(storage, `${auth.value.uid}/${id}`);
                    await deleteObject(oldImageRef);
                }),
            );


            // Add new images
            await setDoc(seedDocRef, {
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
            });
        }

        await goto(`/buy/${data.listingId}`);
    }
</script>

<Metadata title="edit crops | farmer's market" />

<SellForm
    {onSubmit}
    initialValues={initialValues || undefined}
    requireImages={false}
>
    {#snippet header()}
        {#if listing}
            editing <span class="text-accent">{listing.name}</span>
        {:else}
            editing <span class="text-accent">...</span>
        {/if}
    {/snippet}
</SellForm>

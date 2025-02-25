<script lang="ts">
    import { goto } from "$app/navigation";
    import Metadata from "$lib/components/Metadata.svelte";
    import { firestore, storage } from "$lib/firebase";
    import type { Crop } from "$lib/models/Crop.model";
    import type { CropListing } from "$lib/models/CropListing.model";
    import auth from "$lib/state/auth.svelte";
    import crops from "$lib/state/crops.svelte";
    import getUserLocation from "$lib/utils/userLocation.svelte";
    import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
    import { deleteObject, getDownloadURL, list, ref, uploadBytes } from "firebase/storage";
    import { geohashForLocation } from "geofire-common";
    import { v4 as uuidv4 } from "uuid";
    import type { PageProps } from "../$types";
    import { getCropListing } from "$lib/utils/cropListing.svelte";
    import SellForm from "$lib/components/SellForm.svelte";

    let { data }: PageProps = $props();

    let listing = $state<CropListing | null>(null);
    let error = $state<string | null>(null);
    let crop = $state<Crop | null>(null);
    let description = $state<string>("");
    let price = $state<number | null>(null);
    let quantity = $state<number | null>(null);
    let images = $state<FileList | null>(null);

    $effect(() => {
        getCropListing(data.listingId)
            .then(l => {
                if (auth.value && l !== null) {
                    if (l.uid !== auth.value.uid) {
                        throw Error(`Crop listing with id '${l.id}'' does not belong to the user.`);
                    }

                    crop = crops.fromName(l.name);
                    description = l.description;
                    price = l.price;
                    quantity = l.quantity;

                    listing = l
                }

            })
            .catch(e => goto("/buy"))
    })

    async function onSubmit(e: SubmitEvent) {
        e.preventDefault();

        let location: GeolocationPosition | null;

        try {
            location = await getUserLocation();
        } catch (e) {
            error = "User cannot be located.";
            return;
        }

        if (
            !location ||
            !crop ||
            !description.trim() ||
            !price ||
            !quantity ||
            !auth.value ||
            !images
        ) {
            return;
        }

        const lat = location.coords.latitude;
        const lng = location.coords.longitude;
        const hash = geohashForLocation([lat, lng]);

        const imageFiles: File[] = [];

        for (const image of images) {
            imageFiles.push(image);
        }

        const imageIDs = imageFiles.map(image => uuidv4());

        const downloadURLs = await Promise.all(
            imageFiles.map(async (img, i) => {
                if (!auth.value) {
                    return null;
                }

                const fileRef = ref(storage, `${auth.value.uid}/${imageIDs[i]}`);
                const uploadTask = await uploadBytes(fileRef, img);
                return getDownloadURL(uploadTask.ref);
            }),
        );

        const seedDocRef = doc(firestore, "seeds", data.listingId);

        if (images.length === 0) {
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
            const listingDoc = await getDoc(seedDocRef);

            const oldImageIDs = listingDoc.get("imageIDs") as string[];

            await Promise.all(oldImageIDs.map(async id => {
                if (!auth.value) {
                    return null;
                }

                const oldImageRef = ref(storage, `${auth.value.uid}/${id}`);
                await deleteObject(oldImageRef);
            }))

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
    bind:error={error}
    bind:crop={crop}
    bind:description={description}
    bind:price={price}
    bind:quantity={quantity}
    bind:images={images}
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
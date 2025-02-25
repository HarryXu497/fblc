<script lang="ts">
    import { goto } from "$app/navigation";
    import Metadata from "$lib/components/Metadata.svelte";
    import { firestore, storage } from "$lib/firebase";
    import type { Crop } from "$lib/models/Crop.model";
    import type { CropListing } from "$lib/models/CropListing.model";
    import auth from "$lib/state/auth.svelte";
    import crops from "$lib/state/crops.svelte";
    import getUserLocation from "$lib/utils/userLocation.svelte";
    import { doc, setDoc } from "firebase/firestore";
    import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
    import { geohashForLocation } from "geofire-common";
    import { v4 as uuidv4 } from "uuid";
    import type { PageProps } from "../$types";
    import { getCropListing } from "$lib/utils/cropListing.svelte";

    let { data }: PageProps = $props();

    let error = $state<string | null>(null);
    let crop = $state<Crop | null>(null);
    let description = $state<string>("");
    let price = $state<number | null>(null);
    let quantity = $state<number | null>(null);
    let images = $state<FileList | null>(null);

    $effect(() => {
        getCropListing(data.listingId)
            .then(listing => {
                if (auth.value && listing !== null) {
                    if (listing.uid !== auth.value.uid) {
                        throw Error(`Crop listing with id '${listing.id}'' does not belong to the user.`);
                    }

                    crop = crops.fromName(listing.name);
                    description = listing.description;
                    price = listing.price;
                    quantity = listing.quantity;
                    images = null
                }

            })
            .catch(e => goto("/buy"))
    })

    async function onSubmit(e: SubmitEvent) {
        e.preventDefault();

        const location = await getUserLocation();

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
        } as CropListing);

        await goto(`/buy/${data.listingId}`);
    }
</script>

<Metadata title="edit crops | farmer's market" />

<main class="size flex w-screen flex-col items-center justify-center">
    <div class="w-fit">
        <h1 class="mb-4 text-center text-4xl">
            sell your <span class="text-accent">crops</span>
        </h1>
        <form class="auth-form w-full items-center" onsubmit={onSubmit}>
            <div class="form-control">
                <label for="crop">crop</label>
                <select required name="crop" id="crop" bind:value={crop}>
                    <option value={null}>none</option>
                    {#if crops.value !== null}
                        {#each crops.value as crop}
                            <option value={crop}>{crop.name}</option>
                        {/each}
                    {/if}
                </select>
            </div>
            <div class="form-control">
                <label for="description">description</label>
                <textarea
                    required
                    class="h-48"
                    name="description"
                    id="description"
                    placeholder="description"
                    bind:value={description}
                ></textarea>
            </div>
            <div class="name-control flex w-full justify-between gap-[10%]">
                <div class="form-control w-1/2">
                    <label for="price" class="font-bold">price</label>
                    <input
                        bind:value={price}
                        required
                        min="0"
                        step="0.01"
                        type="number"
                        name="price"
                        id="price"
                        placeholder="price"
                    />
                </div>
                <div class="form-control w-1/2">
                    <label for="quantity">quantity</label>
                    <input
                        bind:value={quantity}
                        required
                        min="0"
                        step="1"
                        type="number"
                        name="quantity"
                        id="quantity"
                        placeholder="quantity"
                    />
                </div>
            </div>
            <div class="form-control">
                <label for="images">images</label>
                <label
                    class="image-selector block w-full text-center text-gray-500"
                    for="images">select your images</label
                >
                <input
                    required
                    multiple
                    accept="image/*"
                    class="hidden"
                    type="file"
                    name="images"
                    id="images"
                    bind:files={images}
                />
            </div>
            {#if images !== null}
                <div class="flex flex-col overflow-ellipsis">
                    {#each images as image}
                        <span>{image.name}</span>
                    {/each}
                </div>
            {/if}
            {#if error}
                <p class="text-[#b64040]">{error}</p>
            {/if}
            <button
                class="mt-2 w-full rounded-lg bg-accent py-2 text-white transition-transform hover:-translate-y-1 hover:cursor-pointer"
                type="submit"
            >
                Submit
            </button>
        </form>
    </div>
</main>

<style lang="postcss">
    @reference "tailwindcss";

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    label:not(.image-selector) {
        @apply mb-[2px] block w-full font-bold text-black;
    }

    .form-control > input,
    .form-control > select,
    .form-control > textarea,
    .form-control > .image-selector {
        @apply w-full rounded-md p-2 outline-none;
        background-color: var(--color-light-accent);

        &::placeholder {
            @apply text-gray-500;
        }
    }

    .image-selector {
        @apply text-gray-500;
    }

    .form-control > input:focus,
    .form-control > select:focus,
    .form-control > textarea:focus,
    .form-control > .image-selector {
        @apply shadow-inner;
    }

    .form-control,
    .name-control {
        width: min(60vw, 30rem);
    }

    .size {
        height: calc(100vh - 5rem);
    }
</style>

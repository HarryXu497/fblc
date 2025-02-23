<script lang="ts">
    import { goto } from "$app/navigation";
    import { firestore, storage } from "$lib/firebase";
    import type { Crop } from "$lib/models/Crop.model";
    import type { CropListing } from "$lib/models/CropListing.model";
    import auth from "$lib/state/auth.svelte";
    import crops from "$lib/state/crops.svelte";
    import getUserLocation from "$lib/utils/userLocation.svelte";
    import { addDoc, collection } from "firebase/firestore";
    import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
    import { geohashForLocation } from "geofire-common";
    import { v4 as uuidv4 } from "uuid";
  
    let error = $state<string | null>(null);
    let crop = $state<Crop | null>(null);
    let description = $state<string>("");
    let price = $state<number | null>(null);
    let quantity = $state<number | null>(null);
    let images = $state<FileList | null>(null);

    async function onSubmit(e: SubmitEvent) {
        e.preventDefault();

        const location = await getUserLocation();

        if (!location || !crop || !description.trim() || !price || !quantity || !auth.value || !images) {
            return;
        }

        const lat = location.coords.latitude;
        const lng = location.coords.longitude;
        const hash = geohashForLocation([lat, lng]);
        
        const imageFiles: File[] = [];

        for (const image of images) {
            imageFiles.push(image);
        }

        imageFiles.map(f => f.name).forEach(console.log)

        const downloadURLs = await Promise.all(imageFiles.map(async img => {
            if (!auth.value) {
                return null;
            }

            const fileRef = ref(storage, `${auth.value.uid}/${uuidv4()}`);
            const uploadTask = await uploadBytes(fileRef, img);
            return getDownloadURL(uploadTask.ref)
        })) 

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
            imageURLs: downloadURLs.filter(a => a !== null),
        } as CropListing);
        await goto("/buy")
    }

    // TODO: visual validation
</script>
  
<main class="w-screen size flex flex-col items-center justify-center">
	<div class="w-fit">
		<h1 class="text-4xl mb-4 text-center">
			sell your <span class="text-accent">crops</span>
		</h1>
    <form
        class="auth-form items-center w-full"
        onsubmit={onSubmit}
    >
        <div class="form-control">
            <label for="crop">crop</label>
            <select
                required
                name="crop"
                id="crop"
                bind:value={crop}
            >
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
        <div class="name-control flex justify-between gap-[10%] w-full">
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
            <label class="image-selector text-center block w-full text-gray-500" for="images">select your images</label>
            <input
              required
              multiple
              accept="image/*"
              class="hidden"
              type="file"
              name="images"
              id="images"
              bind:files={images}
            >
        </div>
        {#if images !== null}
            <div class="flex flex-col">
                {#each images as image}
                    <span>{image.name}</span>
                {/each}
            </div>
        {/if}
        {#if error}
            <p class="text-[#b64040]">{error}</p>
        {/if}
        <button
            class="w-full bg-accent rounded-lg py-2 mt-2 text-white hover:-translate-y-1 transition-transform hover:cursor-pointer"
            type="submit">
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
      @apply font-bold block text-black w-full mb-[2px];
    }

    .form-control > input,
    .form-control > select,
    .form-control > textarea,
    .form-control > .image-selector {
      @apply rounded-md outline-none p-2 w-full;
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
  
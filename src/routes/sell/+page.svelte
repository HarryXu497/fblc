<script lang="ts">
    import { goto } from "$app/navigation";
    import { firestore } from "$lib/firebase";
    import type { Crop } from "$lib/models/Crop.model";
    import auth from "$lib/state/auth.svelte";
    import crops from "$lib/utils/crops.svelte";
    import { addDoc, collection } from "firebase/firestore";
    import { geohashForLocation } from "geofire-common";
  
    let error = $state<string | null>(null);
    let crop = $state<Crop | null>(null);
    let description = $state<string>("");
    let price = $state<number | null>(null);
    let quantity = $state<number | null>(null);
    let images = $state<File[] | null>(null);

    async function getUserLocation() {
        if (navigator && navigator.geolocation) {
            return new Promise<GeolocationPosition | null>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        maximumAge: 0,
                        enableHighAccuracy: true,
                    }
                )  
            })
        }

        return Promise.resolve(null);
    }
  
    async function onSubmit(e: SubmitEvent) {
        e.preventDefault();

        const location = await getUserLocation();

        if (!location || !crop || !description.trim() || !price || !quantity || !auth.value) {
            return;
        }

        const lat = location.coords.latitude;
        const lng = location.coords.longitude;
        const hash = geohashForLocation([lat, lng]);

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
        });
        goto("/marketplace")
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
                class="placeholder:text-gray"
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
                class="placeholder:text-gray"
                type="number"
                name="quantity"
                id="quantity"
                placeholder="quantity"
            />
            </div>
        </div>
        <div class="form-control">
            <label for="images">images</label>
            <label class="image-selector text-center font-light block w-full text-gray" for="images">select your images</label>
            <input
              required
              class="hidden"
              type="file"
              name="images"
              id="images"
              bind:value={images}
            >
        </div>
        {images}
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
  
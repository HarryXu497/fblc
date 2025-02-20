<script lang="ts">
    import CropCard from "$lib/components/CropListing/CropCard.svelte";
    import { firestore } from "$lib/firebase";
    import type { CropListing } from "$lib/models/CropListing.model";
    import auth from "$lib/state/auth.svelte";
    import { collection, onSnapshot } from "firebase/firestore";
    import { onMount } from "svelte";

    let cropListings = $state<CropListing[] | null>(null);

    $effect(() => {
        if (!auth || !auth.value) {
            return;
        }

        const cropListingsRef = collection(firestore, "seeds");

        const unsubscribe = onSnapshot(cropListingsRef, (listings) => {
            cropListings = listings.docs.map(d => ({
                id: d.id,
                geohash: d.get("geohash") as string,
                lat: d.get("lat") as number,
                lng: d.get("lng") as number,
                name: d.get("name") as string,
                description: d.get("description") as string,
                price: d.get("price") as number,
                quantity: d.get("quantity") as number,
                uid: auth.value!.uid as string,
            }))
        });

        return unsubscribe;
    })
</script>

<main class="my-4">
    <h1 class="text-4xl text-center">marketplace</h1>
    {#if cropListings !== null}
    <section class="grid grid-cols-3 px-12 gap-2">
        {#each cropListings as listing}
            <CropCard {listing}/>
        {/each}
    </section>
    {:else}
    <section class="flex flex-row justify-center items-center">
       <p class="text-xl">loading listings...</p>
    </section>
    {/if}
</main>
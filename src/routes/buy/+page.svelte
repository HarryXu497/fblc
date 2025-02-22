<script lang="ts">
    import { base } from "$app/paths";
    import CropCard from "$lib/components/CropListing/CropCard.svelte";
    import FallbackIcon from "$lib/components/FallbackIcon.svelte";
    import { firestore } from "$lib/firebase";
    import type { CropListing } from "$lib/models/CropListing.model";
    import auth from "$lib/state/auth.svelte";
    import { collection, onSnapshot } from "firebase/firestore";
  
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
                imageURLs: d.get("imageURLs") as string[],
            }))
        });

        return unsubscribe;
    })
</script>

{#if cropListings}
    {#if cropListings.length === 0}
        <main
            class="w-full h-[calc(100%_-_6rem)] flex flex-row items-center justify-center"
        >
            <p class="text-4xl">no listings yet</p>
        </main>
    {:else}
        <main class="flex flex-col items-center gap-8">
            <h1 class="text-5xl font-bold">
                crop <span class="text-accent">listings</span>
            </h1>
            <section
                class="grid grid-cols-3 px-8 w-[clamp(20rem,_80%,_96rem)] gap-8 mb-8"
            >
                {#each cropListings as listing}
                    <CropCard {listing}/>
                {/each}
            </section>
        </main>
    {/if}
{:else}
    <main
        class="w-full h-[calc(100%_-_6rem)] flex flex-row items-center justify-center"
    >
        <p class="text-4xl">loading listings...</p>
    </main>
{/if}
<a
    class="
        rounded-xl bg-accent hover:-translate-y-1
        transition-transform text-xl text-white px-3 py-2 drop-shadow-xl fixed right-12 bottom-12
        flex flex-row items-center gap-2
    "
    href="{base}/sell"
>
    <FallbackIcon class="text-white font-bold" icon="ri:add-line" />
    sell crops
</a>

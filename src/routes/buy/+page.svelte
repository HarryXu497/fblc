<script lang="ts">
    import { base } from "$app/paths";
    import CropCard from "$lib/components/CropListing/CropCard.svelte";
    import FallbackIcon from "$lib/components/FallbackIcon.svelte";
    import SearchBar, { type SearchValues } from "$lib/components/SearchBar.svelte";
    import { firestore } from "$lib/firebase";
    import type { CropListing } from "$lib/models/CropListing.model";
    import auth from "$lib/state/auth.svelte";
    import { getCropListings } from "$lib/utils/cropListing.svelte";
    import getUserLocation from "$lib/utils/userLocation.svelte";
    import { collection, endAt, getDocs, onSnapshot, orderBy, query, startAt } from "firebase/firestore";
    import { distanceBetween, geohashQueryBounds } from "geofire-common";
  
    let cropListings = $state<CropListing[] | null>(null);

    $effect(() => {
        if (!auth || !auth.value) {
            return;
        }

        const cropListingsRef = collection(firestore, "seeds");

        getDocs(cropListingsRef)
            .then(listingDocs => {
                return listingDocs.docs.map(d => ({
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
                } as CropListing))
            })
            .then(l => cropListings = l);
    })

    async function onSearch(value: SearchValues) {
        const centerPos = await getUserLocation();

        if (!centerPos) {
            return;
        }

        let listings: CropListing[] | null = [];
        
        if (value.distance) {
            const center = [centerPos.coords.latitude, centerPos.coords.longitude] as [number, number];
            const radiusInM = value.distance * 1000;

            const bounds = geohashQueryBounds(center, radiusInM);
            const promises = [];
            for (const b of bounds) {
                const q = query(
                    collection(firestore, 'seeds'), 
                    orderBy('geohash'), 
                    startAt(b[0]), 
                    endAt(b[1])
                );

                promises.push(getDocs(q));
            }

            // Collect all the query results together into a single list
            const snapshots = await Promise.all(promises);

            for (const snap of snapshots) {
                for (const doc of snap.docs) {
                    const lat = doc.get('lat');
                    const lng = doc.get('lng');

                    // We have to filter out a few false positives due to GeoHash
                    // accuracy, but most will match
                    const distanceInKm = distanceBetween([lat, lng], center);
                    const distanceInM = distanceInKm * 1000;
                    if (distanceInM <= radiusInM) {
                        listings.push({
                            id: doc.id,
                            geohash: doc.get("geohash") as string,
                            lat: doc.get("lat") as number,
                            lng: doc.get("lng") as number,
                            name: doc.get("name") as string,
                            description: doc.get("description") as string,
                            price: doc.get("price") as number,
                            quantity: doc.get("quantity") as number,
                            uid: auth.value!.uid as string,
                            imageURLs: doc.get("imageURLs") as string[],
                        });
                    }
                }
            }
        } else {
            listings = await getCropListings();
        }
    }
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
            <div class="w-[clamp(20rem,_80%,_36rem)]">
                <SearchBar {onSearch}/>
            </div>
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

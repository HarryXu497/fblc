<script lang="ts">
    /**
     * A page that renders a grid of available crop listings
     */

    import { base } from "$app/paths";
    import CropCard from "$lib/components/CropListing/CropCard.svelte";
    import FallbackIcon from "$lib/components/FallbackIcon.svelte";
    import Metadata from "$lib/components/Metadata.svelte";
    import SearchBar, {
        type SearchValues,
    } from "$lib/components/SearchBar.svelte";
    import { firestore } from "$lib/firebase";
    import type { CropListing } from "$lib/models/CropListing.model";
    import auth from "$lib/state/auth.svelte";
    import { getCropListings } from "$lib/utils/cropListing.svelte";
    import getUserLocation from "$lib/utils/userLocation.svelte";
    import type { GeocodeResult } from "@googlemaps/google-maps-services-js";
    import {
        collection,
        endAt,
        getDocs,
        orderBy,
        query,
        startAt,
    } from "firebase/firestore";
    import { distanceBetween, geohashQueryBounds } from "geofire-common";
    import pluralize from "pluralize";

    let cropListings = $state<CropListing[] | null>(null);
    let numDots = $state<number | null>(null);

    $effect(() => {
        if (numDots !== null) {
            const interval = setInterval(() => {
                if (numDots) {
                    numDots = (numDots % 3) + 1;
                }
            }, 200);

            return () => clearInterval(interval);
        }
    });

    // Computes addresses of each listing
    let cropLocations = $derived.by<Promise<GeocodeResult>[] | null>(() => {
        const locations: Promise<GeocodeResult>[] = [];

        if (cropListings === null) {
            return null;
        }

        for (const listing of cropListings) {
            const promise = fetch(
                `/geocode?lat=${listing.lat}&lng=${listing.lng}`,
            ).then((res) => res.json() as unknown as GeocodeResult);

            locations.push(promise);
        }

        return locations;
    });

    // Gets all listings
    $effect(() => {
        getCropListings()
            .then((l) => cropListings = l)
    });

    /**
     * Callback function called when a query is submitted through the search bar
     * @param values the values of the query
     */
    async function onSearch(values: SearchValues) {
        // Search animation
        numDots = 1;
        
        let listings: CropListing[] | null = [];
        
        if (values.distance && values.distance <= 0) {
            numDots = null;
            throw Error("distance must be positive");
        }

        // Get user location and perform distance query
        const centerPos = await getUserLocation();

        if (centerPos && values.distance) {
            const center = [
                centerPos.coords.latitude,
                centerPos.coords.longitude,
            ] as [number, number];
            const radiusInM = values.distance * 1000;

            // Calculates geohash bounds for the specified radius from the center
            const bounds = geohashQueryBounds(center, radiusInM);
            const promises = [];

            for (const bound of bounds) {
                const q = query(
                    collection(firestore, "seeds"),
                    orderBy("geohash"),
                    startAt(bound[0]),
                    endAt(bound[1]),
                );

                promises.push(getDocs(q));
            }

            // Collect all the query results together into a single list
            const queryResults = await Promise.all(promises);

            for (const result of queryResults) {
                for (const doc of result.docs) {
                    const lat = doc.get("lat");
                    const lng = doc.get("lng");

                    // Filter out false positives because geohashing can generate false positivies
                    const distanceInM = distanceBetween([lat, lng], center) * 1000;

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
                            type: doc.get("type") as "seed" | "crop",
                            imageIDs: doc.get("imageIDs") as string[],
                            imageURLs: doc.get("imageURLs") as string[],
                        });
                    }
                }
            }
        } else {
            listings = await getCropListings();
        }

        if (!listings) {
            return;
        }

        // Filter by crop
        listings = listings.filter((listing) => {
            if (values.crop === null) {
                return true;
            }

            return listing.name === values.crop.name;
        });
        
        // Filter by type
        listings = listings.filter((listing) => {
            if (values.type === null) {
                return true;
            }
            
            return listing.type === values.type;
        });
        
        // Filter by text query
        listings = listings.filter((listing) => {
            if (values.query === null) {
                return true;
            }

            // Search name, quantity, price, and description
            return pluralize(listing.name, listing.quantity)
                    .toLocaleLowerCase()
                    .startsWith(values.query.toLocaleLowerCase()) || 
                listing.quantity
                    .toLocaleString()
                    .startsWith(values.query.toLocaleLowerCase()) ||
                listing.price
                    .toLocaleString()
                    .startsWith(values.query.toLocaleLowerCase()) ||
                listing.description
                    .toLocaleLowerCase()
                    .startsWith(values.query.toLocaleLowerCase());
        });

        cropListings = listings;
        numDots = null;
    }
</script>

<Metadata title="marketplace | farmer's market" />

{#if cropListings}
    <main class="flex h-full flex-col items-center gap-8">
        <h1 class="text-5xl font-bold">
            crop <span class="text-accent">listings</span>
        </h1>
        <div class="w-[clamp(20rem,_80%,_36rem)]">
            <SearchBar {onSearch} />
        </div>
        {#if cropListings.length === 0}
            <section
                class="flex h-[calc(100%_-_6rem)] w-full flex-row items-center justify-center"
            >
                <p class="pb-48 text-4xl">no listings</p>
            </section>
        {:else if numDots !== null}
            <!-- Searching animation -->
            <section
                class="flex h-[calc(100%_-_6rem)] w-full flex-row items-center justify-center"
            >
                <p class="pb-48 text-4xl">searching{".".repeat(numDots)}</p>
            </section>
        {:else}
            <section
                class="mb-8 grid w-[clamp(20rem,_80%,_96rem)] grid-cols-3 gap-8"
            >
                {#each cropListings as listing, i}
                    {#if cropLocations !== null}
                        <CropCard {listing} location={cropLocations[i]} />
                    {:else}
                        <CropCard {listing} />
                    {/if}
                {/each}
            </section>
        {/if}
    </main>
{:else}
    <!-- Content displayed while loading the listings -->
    <main
        class="flex h-[calc(100%_-_6rem)] w-full flex-row items-center justify-center"
    >
        <p class="text-4xl">loading listings...</p>
    </main>
{/if}
<a
    class="
        fixed right-12 bottom-12
        flex flex-row items-center gap-2 rounded-xl bg-accent px-3 py-2 text-xl
        text-white drop-shadow-xl transition-transform hover:-translate-y-1
    "
    href="{base}/sell"
>
    <FallbackIcon class="font-bold text-white" icon="ri:add-line" />
    sell crops
</a>

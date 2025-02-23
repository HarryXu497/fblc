<script lang="ts">
    import Carousel from "$lib/components/Carousel.svelte";
    import type { CropListing } from "$lib/models/CropListing.model";
    import type { PublicUser } from "$lib/models/PublicUser.model";
    import { getCropListing } from "$lib/utils/cropListing.svelte";
    import { getPublicUser } from "$lib/utils/publicUser.svelte";
    import type { PageProps } from "./$types";
    import type { GeocodeResult } from "@googlemaps/google-maps-services-js";
    import pluralize from "pluralize"

    let { data }: PageProps = $props();

    let user = $state<PublicUser | null>(null);
    let listing = $state<CropListing | null>(null);
    let location = $state<GeocodeResult | null>(null);

    $effect(() => {
        if (!listing) {
            return;
        }

        fetch(`/geocode?lat=${listing.lat}&lng=${listing.lng}`)
            .then(res => res.json())
            .then(l => location = l);
    })

    $effect(() => {
        if (!listing) {
            return;
        }

        getPublicUser(listing.uid)
            .then(u => user = u);
    })

    $effect(() => {
        getCropListing(data.listingId)
            .then(l => listing = l);
    })

    const intl = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });
</script>

{#if listing && user}
    <main class="h-[calc(100%_-_6rem)] w-[clamp(20rem,_60%,_72rem)] mx-auto flex flex-col gap-3">
        <div class="flex flex-col gap-2">
            <div class="flex flex-row justify-between items-center">
                <h1 class="font-bold text-4xl">
                    {pluralize(listing.name, listing.quantity)} from
                    <span class="text-4xl font-bold text-accent">{location?.address_components[3].short_name.toLocaleLowerCase()}</span>
                </h1>
                <h2 class="text-4xl font-bold">{listing.quantity} for {intl.format(listing.price)}</h2>
            </div>
            <div class="flex flex-row justify-between items-center">
                <h2 class="text-2xl lowercase">listed by <span class="text-accent">{user.displayName || "Unknown"}</span></h2>
                <a href="mailto:{user.email}" class="rounded-xl text-xl bg-accent hover:-translate-y-0.5 shadow hover:cursor-pointer transition-transform text-white px-5 py-1">contact</a>
            </div>
        </div>
        <Carousel imageURLs={listing.imageURLs}/>
    </main>
{:else}
    <main class="h-[calc(100%_-_6rem)] w-full flex flex-row justify-center items-center">
        <p>Loading listing...</p>
    </main>
{/if}
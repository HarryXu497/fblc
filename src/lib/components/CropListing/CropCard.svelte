<script lang="ts">
    /** 
     * A card component that displays information about a crop listing
    */

    import type { CropListing } from "$lib/models/CropListing.model";
    import Window from "$lib/components/Window.svelte";
    import { base } from "$app/paths";
    import type { GeocodeResult } from "@googlemaps/google-maps-services-js";
    import pluralize from "pluralize";

    /**
     * @param listing the crop listing displayed by the component
     * @param location a promise resolving to the location of the crop listing
    */
    interface Props {
        listing: CropListing;
        location?: Promise<GeocodeResult>;
    }

    let { listing, location, }: Props = $props();
</script>

<a href="{base}/buy/{listing.id}">
    <Window>
        {#snippet top()}
            <p class="text-white">
                {pluralize(listing.name.toLocaleLowerCase(), listing.quantity)}
                {#if location}
                    {#await location}
                        from ...
                    {:then value}
                        from <span class="text-accent"
                            >{value.address_components[3].short_name.toLocaleLowerCase()}</span
                        >
                    {/await}
                {/if}
            </p>
        {/snippet}
        <div
            class="relative mr-4 ml-2.5 flex aspect-square flex-row items-center justify-center bg-white"
        >
            <img
                src={listing.imageURLs[0]}
                alt=""
                class="absolute inset-0 h-full w-full object-cover"
            />
        </div>
        {#snippet bottom()}
            <p class="text-white">
                {listing.quantity} for ${listing.price}
            </p>
        {/snippet}
    </Window>
</a>

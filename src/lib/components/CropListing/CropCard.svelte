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

    let { listing, location }: Props = $props();

    /**
     * Computes name of the locality containing the address,
     * or the first component of the address if no locality exists at the location
     * @param res the reverse geocoding result
     */
    function computeLocality(res: GeocodeResult) {
        const locality =
            res?.address_components.find((l) =>
                l.types.some((g) => g === "locality"),
            ) || res?.address_components[0];

        return locality?.short_name.toLocaleLowerCase();
    }
</script>

<a href="{base}/buy/{listing.id}">
    <Window>
        <!-- This snippet's content goes in the top bar of the window -->
        {#snippet top()}
            <!-- listing name and location -->
            <p class="text-white">
                {pluralize(`${listing.name.toLocaleLowerCase()} ${listing.type.toLocaleLowerCase()}`, listing.quantity)}
                {#if location}
                    <!-- Awaits the asynchronous value and displays placeholder text -->
                    {#await location}
                        from ...
                    {:then value}
                        from <span class="text-accent"
                            >{computeLocality(value)}</span
                        >
                    {/await}
                {/if}
            </p>
        {/snippet}
        <!-- Show first image of listing -->
        <div
            class="relative mr-4 ml-2.5 flex aspect-square flex-row items-center justify-center bg-white"
        >
            <img
                src={listing.imageURLs[0]}
                alt=""
                class="absolute inset-0 h-full w-full object-cover"
            />
        </div>
        <!-- This snippet's content goes in the bottom bar of the window -->
        {#snippet bottom()}
            <!-- listing price and quantity -->
            <p class="text-white">
                {listing.quantity} for ${listing.price}
            </p>
        {/snippet}
    </Window>
</a>

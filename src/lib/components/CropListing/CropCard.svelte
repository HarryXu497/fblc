<script lang="ts">
    import type { CropListing } from "$lib/models/CropListing.model";
    import Window from "$lib/components/Window.svelte";
    import { base } from "$app/paths";
    import type { GeocodeResult } from "@googlemaps/google-maps-services-js";
    import pluralize from "pluralize";

    interface Props {
        listing: CropListing;
        location?: Promise<GeocodeResult>; 
    }


    let { listing, location }: Props = $props();
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
                        from <span class="text-accent">{value.address_components[3].short_name.toLocaleLowerCase()}</span>
                    {/await}
                {/if}
            </p>
        {/snippet}
        <div class="aspect-square flex flex-row items-center justify-center relative ml-2.5 mr-4">
            <img src={listing.imageURLs[0]} alt="" class="absolute inset-0 w-full h-full object-cover">
        </div>
        {#snippet bottom()}
            <p class="text-white">{listing.quantity} for ${listing.price} each</p>
        {/snippet}
    </Window>
</a>
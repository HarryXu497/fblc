<script lang="ts">
    import type { CropListing } from "$lib/models/CropListing.model";
    import Window from "$lib/components/Window.svelte";
    import { base } from "$app/paths";

    interface Props {
        listing: CropListing;
    }


    let { listing }: Props = $props();
</script>

<a href="{base}/buy/{listing.id}">
    <Window>
        {#snippet top()}
            <p class="text-white">{listing.name.toLocaleLowerCase()}</p>
        {/snippet}
        <div class="aspect-square flex flex-row items-center justify-center relative ml-2.5 mr-4">
            <img src={listing.imageURLs[0]} alt="" class="absolute inset-0 w-full h-full object-cover">
        </div>
        {#snippet bottom()}
            <p class="text-white">{listing.quantity} for ${listing.price} each</p>
        {/snippet}
    </Window>
</a>
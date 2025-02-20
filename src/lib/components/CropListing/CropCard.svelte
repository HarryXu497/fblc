<script lang="ts">
    import type { CropListing } from "$lib/models/CropListing.model";
    import Window from "$lib/components/Window.svelte";

    interface Props {
        listing: CropListing;
    }


    let { listing }: Props = $props();
</script>

<Window programText="lebron.exe">
    <div class="w-full aspect-square flex flex-row items-center justify-center">
        <h2>{listing.name}</h2>
    </div>
</Window>
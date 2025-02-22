<script lang="ts">
    import { base } from "$app/paths";
    import type { Garden } from "$lib/models/Garden.model";
    import GardenGridPreview from "$lib/components/Garden/GardenGridPreview.svelte";
    import Window from "./Window.svelte";

    interface Props {
        garden: Garden;
    }

    let { garden }: Props = $props();
</script>

<a href="{base}/gardens/{garden.id}" class="transition rounded overflow-hidden hover:cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1">
    <Window>
        {#snippet top()}
            <p class="text-white">{garden.name.toLocaleLowerCase()}</p>
        {/snippet}
        <div class="w-full aspect-square flex flex-row items-center justify-center">
            <GardenGridPreview {garden} px={20}/>
        </div>
    </Window>
</a>

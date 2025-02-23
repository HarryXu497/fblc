<script lang="ts">
    import GardenGrid from "$lib/components/Garden/GardenGrid.svelte";
    import type { Crop } from "$lib/models/Crop.model";
    import type { Garden } from "$lib/models/Garden.model";
    import Window from "../Window.svelte";
    import GardenSidebar from "$lib/components/Garden/GardenSidebar.svelte";

    interface Props {
        garden: Garden;
        onTileUpdate: (x: number, y: number, crop: Crop | null) => void;
    }

    let { garden, onTileUpdate }: Props = $props();

    let width = $state<number | null>(null);
    let height = $state<number | null>(null);

    const PADDING = 128;
    const GRID_GAP = 4;

    let px = $derived.by<number>(() => {
        if (height === null || width === null) {
            return 0;
        }

        const heightGaps = garden.height === 0 ? 0 : garden.height - 1
        const widthGaps = garden.width === 0 ? 0 : garden.width - 1

        const heightPx = Math.ceil((height - GRID_GAP * heightGaps - 2 * PADDING) / garden.height);
        const widthPx = Math.ceil((width - GRID_GAP * widthGaps - 2 * PADDING) / garden.width);

        return Math.min(widthPx, heightPx);
    });

  
    let brush = $state<Crop | null>(null);
</script>
  
<main class="flex flex-row items-center justify-center h-full gap-8 mx-12">
    <div class="flex flex-row justify-center items-center h-full grow gap-4 overflow-hidden" bind:clientHeight={height}>
        <Window>
            {#snippet top()}
                <p class="text-white">{garden.name.toLocaleLowerCase()}</p>
            {/snippet}
            <div class="flex flex-row justify-center grow items-center w-full h-full relative p-8" bind:clientWidth={width}>
                <GardenGrid {garden} {onTileUpdate} {brush} {px}/>
            </div>
        </Window>
    </div>
    <div class="h-full max-w-[24rem] min-w-[18rem] grow">
        <GardenSidebar bind:brush={brush} {garden}/>
    </div>
</main>

<style>
    main {
      height: calc(100% - 6rem - 1rem);
    }
</style>
  
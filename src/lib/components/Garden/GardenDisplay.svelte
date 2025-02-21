<script lang="ts">
    import GardenGrid from "$lib/components/Garden/GardenGrid.svelte";
    import type { Crop } from "$lib/models/Crop.model";
    import type { Garden } from "$lib/models/Garden.model";
    import Window from "../Window.svelte";
    import GardenPalette from "./GardenPalette.svelte";

    interface Props {
        garden: Garden;
        onTileUpdate: (x: number, y: number, crop: Crop | null) => void;
    }

    let { garden, onTileUpdate }: Props = $props();

    let width = $state<number | null>(null);
    let height = $state<number | null>(null);

    const PADDING = 96;
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

    function calculateWidth() {
        if (!width) {
            return 0;
        }

        const widthGaps = garden.width === 0 ? 0 : garden.width - 1;
        return garden.width * px + widthGaps * GRID_GAP;
    }

    function calculateHeight() {
        if (!height) {
            return 0;
        }

        const heightGaps = garden.height === 0 ? 0 : garden.height - 1;
        return garden.height * px + heightGaps * GRID_GAP;
    }
</script>
  
<main class="flex flex-row items-center justify-center h-full gap-8 mx-8 my-4">
    <div class="flex justify-center items-center h-full flex-row grow gap-4 overflow-hidden">
        <Window programText="{garden.name.replaceAll(" ", "_")}.exe">
            <div class="flex justify-center items-center w-full h-full relative p-24" bind:clientHeight={height} bind:clientWidth={width}>
                <div
                    class="absolute top-16.5 h-2 bg-accent rounded flex flex-row justify-center items-center"
                    style:width="{calculateWidth()}px"
                >
                    <p class="text-2xl bg-accent py-0.5 px-4 rounded">{garden.scale * garden.width}m</p>
                </div>
                <div
                    class="absolute left-12 w-2 bg-accent rounded flex flex-col justify-center items-center"
                    style:height="{calculateHeight()}px"
                >
                    <p class="text-2xl bg-accent py-0.5 px-4 rounded">{garden.scale * garden.height}m</p>
                </div>
                <GardenGrid {garden} {onTileUpdate} {brush} {px}/>
            </div>
        </Window>
    </div>
    <div class="h-full max-w-[24rem] min-w-[18rem] grow">
        <GardenPalette bind:brush={brush}/>
    </div>
</main>

<style>
    main {
      height: calc(100% - 6rem - 1rem);
    }
</style>
  
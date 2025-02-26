<script lang="ts">
    /** 
     * A component that displays a garden with a side palette and summary
    */

    import GardenGrid from "$lib/components/Garden/GardenGrid.svelte";
    import type { Crop } from "$lib/models/Crop.model";
    import type { Garden } from "$lib/models/Garden.model";
    import Window from "../Window.svelte";
    import GardenSidebar from "$lib/components/Garden/GardenSidebar.svelte";
    
    /**
     * @param garden the garden displayed by the component
     * @param onTileUpdate the callback function executed when a garden tile is updated
     * @param onDeleteGarden the callback function executed when a garden is deleted
    */
    interface Props {
        garden: Garden;
        onTileUpdate: (x: number, y: number, crop: Crop | null) => void;
        onDeleteGarden: () => void;
    }

    let { garden, onTileUpdate, onDeleteGarden, }: Props = $props();

    // Dimensions of the window rendering the garden 
    let width = $state<number | null>(null);
    let height = $state<number | null>(null);

    // Calculate the side length of an individual garden tile 
    const PADDING = 128;
    const GRID_GAP = 4;

    let px = $derived.by<number>(() => {
        if (height === null || width === null) {
            return 0;
        }

        const heightGaps = garden.height === 0 ? 0 : garden.height - 1;
        const widthGaps = garden.width === 0 ? 0 : garden.width - 1;

        const heightPx = Math.ceil(
            (height - GRID_GAP * heightGaps - 2 * PADDING) / garden.height,
        );
        const widthPx = Math.ceil(
            (width - GRID_GAP * widthGaps - 2 * PADDING) / garden.width,
        );

        return Math.min(widthPx, heightPx);
    });

    // Currently selected crop to plant
    let brush = $state<Crop | null>(null);
</script>

<main class="mx-12 flex h-full flex-row items-center justify-center gap-8">
    <div
        class="flex h-full grow flex-row items-center justify-center gap-4 overflow-hidden"
        bind:clientHeight={height}
    >
        <Window>
            {#snippet top()}
                <div class="flex flex-row w-full justify-between items-center">
                    <p class="text-white text-xl">{garden.name.toLocaleLowerCase()}</p>
                    <div class="flex flex-row gap-1 items-center">
                        <a
                            class="text-white rounded-sm bg-blue-700 text-xl px-3 hover:cursor-pointer hover:bg-blue-800"
                            href="/gardens/{garden.id}/edit"
                        >
                            edit
                        </a>
                        <button
                            class="text-white rounded-sm bg-red-700 text-xl px-3 hover:cursor-pointer hover:bg-red-800"
                            onclick={onDeleteGarden}
                        >
                            delete
                        </button>
                    </div>
                </div>
            {/snippet}
            <div
                class="relative flex h-full w-full grow flex-row items-center justify-center p-8"
                bind:clientWidth={width}
            >
                <GardenGrid {garden} {onTileUpdate} {brush} {px} />
            </div>
        </Window>
    </div>
    <div class="h-full max-w-[24rem] min-w-[18rem] grow">
        <GardenSidebar bind:brush {garden} />
    </div>
</main>

<style>
    main {
        height: calc(100% - 6rem - 1rem);
    }
</style>

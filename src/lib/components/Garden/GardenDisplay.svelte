<script lang="ts">
    import GardenGrid from "$lib/components/Garden/GardenGrid.svelte";
    import type { CropType, Garden, Tile } from "$lib/models/Garden.model";
    import GardenPalette from "./GardenPalette.svelte";
  
    const tiles: Tile[][] = Array.from({ length: 10 }, () =>
      Array.from({ length: 15 }, () => ({ crop: null }))
    );

    let width = $state<number | null>(null);
    let height = $state<number | null>(null);

    let garden = $state<Garden>({
        width: 15,
        height: 10,
        scale: 1,
        tiles: tiles,
    });


    const GRID_GAP = 4;

    let px = $derived.by<number>(() => {
        if (height === null || width === null) {
            return 0;
        }

        const heightGaps = garden.height === 0 ? 0 : garden.height - 1
        const widthGaps = garden.width === 0 ? 0 : garden.width - 1

        const heightPx = Math.ceil((height - GRID_GAP * heightGaps) / garden.height);
        const widthPx = Math.ceil((width - GRID_GAP * widthGaps) / garden.width);

        return Math.min(widthPx, heightPx);
    });

  
    let brush = $state<CropType | null>(null);
  
    function onTileUpdate(x: number, y: number, crop: CropType | null) {
      if (Number.isNaN(x) || Number.isNaN(y)) {
        return;
      }

      garden.tiles[y][x] = { crop };
    }
</script>
  
<main class="flex flex-row items-center justify-center h-full">
    <div class="grid w-full px-12 grid-cols-[85fr_25fr] gap-4 h-full">
        <div class="flex flex-row justify-start items-center h-full overflow-hidden" bind:clientHeight={height} bind:clientWidth={width}>
            <GardenGrid {garden} {onTileUpdate} {brush} {px}/>
        </div>
        <div class="h-full">
            <GardenPalette bind:brush={brush}/>
        </div>
    </div>
</main>
  
<style>
    main {
      height: calc(100% - 6rem);
    }
</style>
  
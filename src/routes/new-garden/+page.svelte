<script lang="ts">
    import GardenGrid from "$lib/components/Garden/GardenGrid.svelte";
    import type { CropType, Garden, Tile } from "$lib/models/Garden.model";

    const tiles: Tile[][] = Array.from({ length: 6 }, () =>
        Array.from({ length: 10 }, () => ({ crop: null }))
    );

    const garden: Garden = {
        width: 10,
        height: 6,
        scale: 1,
        tiles: tiles,
    };

    let mousedown = $state<boolean>(false);

    let dragComplete = $state<boolean>(true);
    let startPoint = $state<Point | null>(null);
    let endPoint = $state<Point | null>(null);

    type Point = { x: number, y: number };

    function onMouseDown(e: MouseEvent) {
        if (dragComplete) {
            startPoint = null;
            endPoint = null;
            dragComplete = false;
        }
        
        mousedown = true;
        
        const x = e.pageX;
        const y = e.pageY;
        
        startPoint = { x, y }
        e.preventDefault();
    }

    function onMouseUp(e: MouseEvent) {
        mousedown = false;

        const x = e.pageX;
        const y = e.pageY;

        endPoint = { x, y }
        dragComplete = true;
    }

    function onMouseMove(e: MouseEvent) {
        if (mousedown) {
            dragComplete = false;

            const x = e.pageX;
            const y = e.pageY;

            endPoint = { x, y };
        }
    }

    const TILE_SIZE = 100;

    const drawPoint1 = $derived.by<Point | null>(() => {
        if (!startPoint || !endPoint) {
            return null;
        }

        return {
            x: Math.min(startPoint.x, endPoint.x),
            y: Math.min(startPoint.y, endPoint.y),
        }
    })

    const drawPoint2 = $derived.by<Point | null>(() => {
        if (!startPoint || !endPoint) {
            return null;
        }

        return {
            x: Math.max(startPoint.x, endPoint.x),
            y: Math.max(startPoint.y, endPoint.y),
        }
    })
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main
    class="h-full w-full flex flex-row justify-center items-center select-none"
    onmousedown={onMouseDown}
    onmouseup={onMouseUp}
    onmousemove={onMouseMove}
>
    {#if drawPoint1 && drawPoint2}
        {@const HEIGHT = Math.floor((drawPoint2.y - drawPoint1.y) / TILE_SIZE)}
        {@const WIDTH = Math.floor((drawPoint2.x - drawPoint1.x) / TILE_SIZE)}
        <div
            class="grid container transition absolute gap-1 rounded-xl overflow-hidden w-fit"
            style:left="{drawPoint1.x}px"
            style:top="{drawPoint1.y}px"
            style:grid-template-columns="repeat({WIDTH}, {TILE_SIZE}px)"
            style:grid-template-rows="repeat({HEIGHT}, {TILE_SIZE}px)"
        >
            {#each { length: HEIGHT}, y}
                {#each { length: WIDTH}, x}
                    <div
                        class="
                            tile
                            w-full h-full flex flex-row justify-center items-center
                            hover:cursor-pointer
                            transition
                        "
                        style:width="{TILE_SIZE}px"
                        style:height="{TILE_SIZE}px"
                    >
                    </div>
                {/each}
            {/each}
        </div>
    {:else}
        <h1>Drag to create your garden!</h1>
    {/if}

</main>

<style>
    .tile {
        background-color: var(--color-garden-dirt);
    }
</style>


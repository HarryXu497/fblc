<script lang="ts">
    /** 
     * A component that previews a garden, without the interactivity or dimensions of 'GardenDisplay'
    */

    import type { Garden } from "$lib/models/Garden.model";

    /**
     * @param garden the garden displayed by the component
     * @param pxTransform a callback function that transform the calculated tile size
    */
    interface Props {
        garden: Garden;
        pxTransform?: (px: number) => number;
    }

    let { garden, pxTransform, }: Props = $props();

    // Dimensions of the available space
    let width = $state<number | null>(null);
    let height = $state<number | null>(null);

    // Calculate the size of each tile
    const PADDING = 12;
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

        if (pxTransform) {
            return pxTransform(Math.min(widthPx, heightPx));
        }

        return Math.min(widthPx, heightPx);
    });

    // Calculates the dimensions of the garden grid, including grid gaps
    let gridWidth = $derived.by(() => {
        const widthGaps = garden.width === 0 ? 0 : garden.width - 1;

        return Math.ceil(garden.width * px + GRID_GAP * widthGaps);
    });

    let gridHeight = $derived.by(() => {
        const heightGaps = garden.height === 0 ? 0 : garden.height - 1;

        return Math.ceil(garden.height * px + GRID_GAP * heightGaps);
    });
</script>

<section
    class="mr-3 ml-2.5 flex h-full w-full flex-row items-center justify-center"
    bind:clientWidth={width}
    bind:clientHeight={height}
>
    <div
        class="grid h-full w-full gap-1 overflow-hidden rounded-xl"
        style:grid-template-columns="repeat({garden.width}, {px}px)"
        style:grid-template-rows="repeat({garden.height}, {px}px)"
        style:width="{gridWidth}px"
        style:height="{gridHeight}px"
    >
        {#each { length: garden.height }, y}
            {#each { length: garden.width }, x}
                <div
                    class="
                        tile
                        relative flex h-full w-full flex-row items-center
                        justify-center bg-garden-dirt
                        transition
                        hover:cursor-pointer
                    "
                    data-x={x}
                    data-y={y}
                    style:width="{px}px"
                    style:height="{px}px"
                >
                    {#if garden.tiles[y][x].crop !== null}
                        <img
                            class="icon-img absolute inset-0 object-cover"
                            src="/icons/{garden.tiles[y][x].crop.name}.svg"
                            alt={garden.tiles[y][x].crop.name}
                            data-x={x}
                            data-y={y}
                        />
                    {/if}
                </div>
            {/each}
        {/each}
    </div>
</section>

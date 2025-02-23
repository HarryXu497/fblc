<script lang="ts">
    import type { Garden } from "$lib/models/Garden.model";

    interface Props {
        garden: Garden;
        pxTransform?: (px: number) => number;
    }

    let { garden, pxTransform }: Props = $props();

    let width = $state<number | null>(null);
    let height = $state<number | null>(null);

    const PADDING = 12;
    const GRID_GAP = 4;

    let px = $derived.by<number>(() => {
        if (height === null || width === null) {
            return 0;
        }

        const heightGaps = garden.height === 0 ? 0 : garden.height - 1
        const widthGaps = garden.width === 0 ? 0 : garden.width - 1

        const heightPx = Math.ceil((height - GRID_GAP * heightGaps - 2 * PADDING) / garden.height);
        const widthPx = Math.ceil((width - GRID_GAP * widthGaps - 2 * PADDING) / garden.width);

        if (pxTransform) {
            return pxTransform(Math.min(widthPx, heightPx));
        }

        return Math.min(widthPx, heightPx);
    });

    let gridWidth = $derived.by(() => {
        const widthGaps = garden.width === 0 ? 0 : garden.width - 1

        return Math.ceil(garden.width * px + GRID_GAP * widthGaps);
    })

    let gridHeight = $derived.by(() => {
        const heightGaps = garden.height === 0 ? 0 : garden.height - 1

        return Math.ceil(garden.height * px + GRID_GAP * heightGaps);
    })
</script>

<section
    class="flex flex-row justify-center items-center w-full h-full ml-2.5 mr-3"
    bind:clientWidth={width}
    bind:clientHeight={height}
>
    <div
        class="grid gap-1 rounded-xl overflow-hidden w-full h-full"
        style:grid-template-columns="repeat({garden.width}, {px}px)"
        style:grid-template-rows="repeat({garden.height}, {px}px)"
        style:width="{gridWidth}px"
        style:height="{gridHeight}px"
    >
        {#each { length: garden.width }, x}
            {#each { length: garden.height }, y}
                <div
                    class="
                        tile
                        w-full h-full flex flex-row justify-center items-center
                        bg-garden-dirt relative
                        hover:cursor-pointer
                        transition
                    "
                    data-x={x}
                    data-y={y}
                    style:width="{px}px"
                    style:height="{px}px"
                >
                {#if garden.tiles[y][x].crop !== null}
                    <img
                        class="absolute inset-0 object-cover icon-img"
                        src="/icons/{garden.tiles[y][x].crop.name}.svg"
                        alt={garden.tiles[y][x].crop.name}
                        data-x={x}
                        data-y={y}
                    >
                {/if}
                </div>
            {/each}
        {/each}
    </div>
</section>
<script lang="ts">
    import type { Crop } from "$lib/models/Crop.model";
    import type { Garden } from "$lib/models/Garden.model";

    interface Props {
        garden: Garden;
        px: number; // px size of a tile
        brush: Crop | null;
        onTileUpdate: (x: number, y: number, crop: Crop | null) => void
    }

    let { garden, brush, px, onTileUpdate }: Props = $props();


    let width = $state<number | null>(null);
    let height = $state<number | null>(null);

    const PADDING = 96;
    const GRID_GAP = 4;


    let mousedown = $state<boolean>(false);
    
    function onMouseMove(e: MouseEvent) {
        if (mousedown && e.target) {
            const x = Number((e.target as HTMLElement).dataset.x);
            const y = Number((e.target as HTMLElement).dataset.y);

            if (brush !== undefined) {
                onTileUpdate(x, y, brush);
            }
        }
    }
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

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section class="relative h-full flex flex-col justify-center">
    <div
        onmousedown={() => mousedown = true}
        onmouseup={() => mousedown = false}
        onmousemove={onMouseMove}
        class="grid gap-1 rounded-xl relative"
        style:grid-template-columns="repeat({garden.width}, {px}px)"
        style:grid-template-rows="repeat({garden.height}, {px}px)"
        bind:clientWidth={width}
        bind:clientHeight={height}
    >
    <div
        class="absolute -top-8 h-2 bg-accent rounded flex flex-row justify-center items-center"
        style:width="{calculateWidth()}px"
    >
        <p class="text-2xl bg-accent py-0.5 px-4 rounded">{garden.scale * garden.width}m</p>
    </div>
    <div
        class="absolute -left-12 w-2 bg-accent rounded flex flex-col justify-center items-center"
        style:height="{calculateHeight()}px"
    >
        <p class="text-2xl bg-accent py-0.5 px-4 rounded">{garden.scale * garden.height}m</p>
    </div>
        {#each { length: garden.height }, y}
            {#each { length: garden.width }, x}
            <div
                    class="
                        tile
                        w-full h-full flex flex-row justify-center items-center
                        hover:cursor-pointer transition relative select-none
                    "
                    data-x={x}
                    data-y={y}
                    style:width="{px}px"
                    style:height="{px}px"
                    style:border-top-left-radius={(x === 0 && y === 0) ? "0.25rem" : ""}
                    style:border-top-right-radius={(x === garden.width - 1 && y === 0) ? "0.25rem" : ""}
                    style:border-bottom-left-radius={(x === 0 && y === garden.height - 1) ? "0.25rem" : ""}
                    style:border-bottom-right-radius={(x === garden.width - 1 && y === garden.height - 1) ? "0.25rem" : ""}
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

<style>
    .tile {
        background-color: var(--color-garden-dirt);
    }

    .tile:hover {
        background-color: var(--color-garden-dirt-hover);
    }

    .icon-img {
        user-select: none;
        -drag: none;
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
    }
</style>
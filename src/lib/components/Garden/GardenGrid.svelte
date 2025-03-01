<script lang="ts">
    /**
     * A component that displays a garden with an interactive grid
     */

    import type { Garden } from "$lib/models/Garden.model";
    import type { Brush } from "./GardenDisplay.svelte";

    /**
     * @param garden the garden displayed by the component
     * @param px the side length of an individual garden tile
     * @param brush the currently selected crop to plant
     * @param onTileUpdate the callback function executed when a garden tile is updated
     */
    interface Props {
        garden: Garden;
        px: number; // px size of a tile
        brush: Brush;
        onTileUpdate: (x: number, y: number, brush: Brush) => void;
    }

    let { garden, brush, px, onTileUpdate }: Props = $props();

    // Dimensions of the garden in pixels
    let width = $state<number | null>(null);
    let height = $state<number | null>(null);

    // Size of each gap between grid items
    const GRID_GAP = 4;

    /**
     * Calculates the width of the garden, including grip gaps
     */
    function calculateWidth() {
        if (!width) {
            return 0;
        }

        const widthGaps = garden.width === 0 ? 0 : garden.width - 1;
        return garden.width * px + widthGaps * GRID_GAP;
    }

    /**
     * Calculates the height of the garde, including grid gaps
     */
    function calculateHeight() {
        if (!height) {
            return 0;
        }

        const heightGaps = garden.height === 0 ? 0 : garden.height - 1;
        return garden.height * px + heightGaps * GRID_GAP;
    }

    // Keeps track of when the mouse is down
    let mousedown = $state<boolean>(false);

    /**
     * Event listener function for the 'mousemove' event
     */
    function onMouseMove(e: MouseEvent) {
        if (mousedown && e.target) {
            const x = Number((e.target as HTMLElement).dataset.x);
            const y = Number((e.target as HTMLElement).dataset.y);

            onTileUpdate(x, y, brush);
        }
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section class="relative flex h-full flex-col justify-center">
    <div
        onmousedown={() => (mousedown = true)}
        onmouseup={() => (mousedown = false)}
        onmousemove={onMouseMove}
        class="relative grid gap-1 rounded-xl"
        style:grid-template-columns="repeat({garden.width}, {px}px)"
        style:grid-template-rows="repeat({garden.height}, {px}px)"
        bind:clientWidth={width}
        bind:clientHeight={height}
    >
        <!-- Horizontal measurement bar-->
        <div
            class="absolute -top-8 flex h-2 flex-row items-center justify-center rounded bg-accent"
            style:width="{calculateWidth()}px"
        >
            <p class="rounded bg-accent px-4 py-0.5 text-2xl">
                {garden.scale * garden.width}m
            </p>
        </div>
        <!-- Vertical measurement bar -->
        <div
            class="absolute -left-12 flex w-2 flex-col items-center justify-center rounded bg-accent"
            style:height="{calculateHeight()}px"
        >
            <p class="rounded bg-accent px-4 py-0.5 text-2xl">
                {garden.scale * garden.height}m
            </p>
        </div>
        <!-- Garden grid tiles -->
        {#each { length: garden.height }, y}
            {#each { length: garden.width }, x}
                <!-- class={{ ... }} applies a class if its value is truthy -->
                <button
                    class={{
                        "tile relative flex h-full w-full flex-row items-center justify-center transition select-none hover:cursor-pointer": true,
                        planted: garden.tiles[y][x].planted,
                    }}
                    onclick={() => {
                        if (!mousedown) {
                            onTileUpdate(x, y, brush);
                        }
                    }}
                    data-x={x}
                    data-y={y}
                    style:width="{px}px"
                    style:height="{px}px"
                    style:border-top-left-radius={x === 0 && y === 0
                        ? "0.25rem"
                        : ""}
                    style:border-top-right-radius={x === garden.width - 1 &&
                    y === 0
                        ? "0.25rem"
                        : ""}
                    style:border-bottom-left-radius={x === 0 &&
                    y === garden.height - 1
                        ? "0.25rem"
                        : ""}
                    style:border-bottom-right-radius={x === garden.width - 1 &&
                    y === garden.height - 1
                        ? "0.25rem"
                        : ""}
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
                </button>
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

    .tile.planted {
        background-color: var(--color-dark-accent);
    }

    .tile.planted:hover {
        background-color: var(--color-darker-accent);
    }

    /* Disable text/image highlighting on the crop icons */
    .icon-img {
        user-select: none;
        -drag: none;
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
    }
</style>

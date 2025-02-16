<script lang="ts">
    import { cropColors } from "$lib/data/crops";
    import type { CropType, Garden } from "$lib/models/Garden.model";

    interface Props {
        garden: Garden;
        px: number; // px size of a tile
        brush: CropType | null;
        onTileUpdate: (x: number, y: number, crop: CropType | null) => void
    }

    let { garden, brush, px, onTileUpdate }: Props = $props();

    let mousedown = $state<boolean>(false);
    
    function onMouseMove(e: MouseEvent) {
        if (mousedown && e.target) {
            const x = Number((e.target as HTMLElement).dataset.x);
            const y = Number((e.target as HTMLElement).dataset.y);

            onTileUpdate(x, y, brush);
        }
    }

    function computeBackgroundColor(x: number, y: number) {
        if (garden.tiles[y][x].crop !== null) {
            return cropColors[garden.tiles[y][x].crop];
        } else {
            return "";
        }
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
    onmousedown={() => mousedown = true}
    onmouseup={() => mousedown = false}
    onmousemove={onMouseMove}
    class="grid gap-1 rounded-xl overflow-hidden"
    style:grid-template-columns="repeat({garden.width}, {px}px)"
    style:grid-template-rows="repeat({garden.height}, {px}px)"
>
    {#each { length: garden.width }, x}
        {#each { length: garden.height }, y}
            <div
                class="
                    tile
                    w-full h-full flex flex-row justify-center items-center
                    hover:cursor-pointer
                    transition
                "
                data-x={x}
                data-y={y}
                style:width="{px}px"
                style:height="{px}px"
                style:background-color={computeBackgroundColor(x, y)}
            >
                
            </div>
        {/each}
    {/each}
</section>

<style>
    .tile {
        background-color: var(--color-garden-dirt);
    }

    .tile:hover {
        background-color: var(--color-garden-dirt-hover);
    }
</style>
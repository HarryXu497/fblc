<script lang="ts">
    import type { Garden } from "$lib/models/Garden.model";
    import crops from "$lib/state/crops.svelte";

    interface Props {
        garden: Garden;
        px: number; // px size of a tile
    }

    let { garden, px }: Props = $props();

    function computeBackgroundColor(x: number, y: number) {
        if (garden.tiles[y][x].crop !== null) {
            return garden.tiles[y][x].crop.color;
        } else {
            return "";
        }
    }
</script>

<section
    class="grid gap-1 rounded-xl overflow-hidden border-4 bg-black"
    style:grid-template-columns="repeat({garden.width}, {px}px)"
    style:grid-template-rows="repeat({garden.height}, {px}px)"
>
    {#each { length: garden.width }, x}
        {#each { length: garden.height }, y}
            <div
                class="
                    tile
                    w-full h-full flex flex-row justify-center items-center
                    bg-garden-dirt
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
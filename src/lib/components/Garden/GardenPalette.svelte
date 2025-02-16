<script lang="ts">
    import crops, { cropColors } from "$lib/data/crops";
    import type { CropType } from "$lib/models/Garden.model";

    interface Props {
        brush: CropType | null;
    }

    let { brush = $bindable() }: Props = $props();
</script>

{#snippet brushButton(crop: CropType | null)}
    <button onclick={() => brush = crop} class="flex flex-row items-center gap-2 text-3xl">
        <div style:background-color={crop ? cropColors[crop] : "var(--color-garden-dirt)"} class="aspect-square border-4 rounded-4xl w-6">
            
        </div>
        <p
            style:color={brush === crop ? "var(--color-accent)" : ""}
            style:font-weight={brush === crop ? "bold" : ""}
        >{crop ? crop : "Reset"}</p>
    </button>
{/snippet}

<section class="bg-[#BBBBBBAA] w-full h-full rounded-xl p-4">
    {#each crops as crop}
        {@render brushButton(crop)}
    {/each}
    {@render brushButton(null)}
</section>
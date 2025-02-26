<script lang="ts">
    /**
     * A component that displays a card with information about a garden
    */

    import { base } from "$app/paths";
    import type { Garden } from "$lib/models/Garden.model";
    import GardenGridPreview from "$lib/components/Garden/GardenGridPreview.svelte";
    import Window from "./Window.svelte";

    /**
     * @param garden the garden displayed by the component
    */
    interface Props {
        garden: Garden;
    }

    let { garden }: Props = $props();
</script>

<a
    href="{base}/gardens/{garden.id}"
    class="overflow-hidden rounded shadow-lg transition hover:-translate-y-1 hover:cursor-pointer hover:shadow-xl"
>
    <Window>
        {#snippet top()}
            <p class="text-white">{garden.name.toLocaleLowerCase()}</p>
        {/snippet}
        <div
            class="flex aspect-square w-full flex-row items-center justify-center"
        >
            <GardenGridPreview {garden}/>
        </div>
    </Window>
</a>

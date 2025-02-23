<script module lang="ts">
    interface SearchValues {
        query: string | null;
        crop: Crop | null;
        distance: number | null;
    }

    export type { SearchValues };
</script>
  
<script lang="ts">
    import type { Crop } from "$lib/models/Crop.model";
    import crops from "$lib/state/crops.svelte";
    import FallbackIcon from "./FallbackIcon.svelte";


    interface Props {
        onSearch: (values: SearchValues) => void;
    }

    let { onSearch }: Props = $props();

    let query = $state<string | null>(null);
    let crop = $state<Crop | null>(null);
    let distance = $state<number | null>(null); 

    function onSubmit(e: SubmitEvent) {
        e.preventDefault();

        const values: SearchValues = {
            query: query?.trim() || null,
            crop: crop,
            distance: distance
        }

        onSearch(values);
    }
</script>

<form
    class="w-full h-full rounded-md outline-none relative shadow-md gap-3 py-3 px-4 bg-light-accent focus-within:outline-2 outline-accent flex flex-row items-center"
    onsubmit={onSubmit}
>
    <button type="submit" class="hover:cursor-pointer">
        <FallbackIcon class="text-2xl" icon="ri:search-line" preload={["ri:search-line"]}/>
    </button>
    <div class="grow flex flex-row gap-2">
        <input
            type="text"
            id="search"
            class="rounded-md outline-none w-full bg-light-accent grow-4 placeholder:text-gray-500"
            placeholder="search"
            bind:value={query}
        >
        <div class="w-[2px]  bg-accent rounded-4xl"></div>
        <input
            type="number"
            placeholder="distance"
            class="placeholder:text-gray-500 grow shrink"
            bind:value={distance}
        >
        <div class="w-[2px]  bg-accent rounded-4xl"></div>
        <select bind:value={crop} style:color={crop === null ? "var(--color-gray-500)" : ""} class="grow shrink">
            <option value={null}>crop</option>
            {#if crops.value !== null}
                {#each crops.value as crop}
                    <option value={crop}>{crop.name}</option>
                {/each}
            {/if}
        </select>
    </div>
</form>

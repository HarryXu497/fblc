<script lang="ts">
    import GardenDisplay from "$lib/components/Garden/GardenDisplay.svelte";
    import type { PageProps } from "./$types";
    import type { Garden } from "$lib/models/Garden.model";
    import { getGarden } from "$lib/utils/garden.svelte";
    import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
    import { firestore } from "$lib/firebase";
    import auth from "$lib/state/auth.svelte";
    import type { Crop } from "$lib/models/Crop.model";
    import { goto } from "$app/navigation";
    import Metadata from "$lib/components/Metadata.svelte";

    let { data }: PageProps = $props();

    let garden = $state<Garden | null>(null);

    $effect(() => {
        getGarden(data.gardenId)
            .then((g) => (garden = g))
            .catch((e) => goto("/gardens"));
    });

    async function onTileUpdate(x: number, y: number, crop: Crop | null) {
        const userId = auth.value?.uid;

        if (!garden || !userId) {
            return;
        }

        if (Number.isNaN(x) || Number.isNaN(y)) {
            return;
        }

        garden.tiles[y][x] = { crop };

        const tilesCollectionRef = collection(
            firestore,
            "gardens",
            userId,
            "gardens",
            garden.id,
            "tiles",
        );

        const tileDocRef = doc(tilesCollectionRef, `${x},${y}`);

        if (crop !== null) {
            await setDoc(tileDocRef, { ...crop });
        } else {
            await deleteDoc(tileDocRef);
        }
    }

    async function onDeleteGarden() {
        if (!garden || !auth.value) {
            return;
        }

        const gardenDocRef = doc(firestore, "gardens", auth.value.uid, "gardens", garden.id);

        await deleteDoc(gardenDocRef);

        await goto("/gardens")
    }

    async function onEditGarden() {
        if (!garden || !auth.value) {
            return;
        }
    }
</script>

<Metadata
    title="{garden
        ? garden.name.toLocaleLowerCase()
        : 'garden'} | farmer's market"
/>

{#if garden}
    <GardenDisplay {garden} {onTileUpdate} {onDeleteGarden} {onEditGarden}/>
{:else}
    <main
        class="flex h-[calc(100%_-_6rem)] w-full flex-row items-center justify-center"
    >
        <p class="text-4xl">loading garden...</p>
    </main>
{/if}

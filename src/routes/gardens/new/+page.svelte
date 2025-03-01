<script lang="ts">
    /**
     * A page that allows users to drag and create their own gardens
     */

    import { goto } from "$app/navigation";
    import FallbackIcon from "$lib/components/FallbackIcon.svelte";
    import Metadata from "$lib/components/Metadata.svelte";
    import { firestore } from "$lib/firebase";
    import auth from "$lib/state/auth.svelte";
    import { addDoc, collection } from "firebase/firestore";

    // Stateful variables to keep track of the drag
    let mousedown = $state<boolean>(false);

    type Point = { x: number; y: number };
    let dragComplete = $state<boolean>(true);
    let startPoint = $state<Point | null>(null);
    let endPoint = $state<Point | null>(null);

    /**
     * Used to calculate the dimensions of the dragged garden
     * @param e the mouse event
     */
    function onMouseDown(e: MouseEvent) {
        if (dragComplete) {
            startPoint = null;
            endPoint = null;
            dragComplete = false;
        }

        mousedown = true;

        const x = e.pageX;
        const y = e.pageY;

        startPoint = { x, y };
        e.preventDefault();
    }

    /**
     * Used to calculate the dimensions of the dragged garden
     * @param e the mouse event
     */
    function onMouseUp(e: MouseEvent) {
        mousedown = false;

        const x = e.pageX;
        const y = e.pageY;

        endPoint = { x, y };
        dragComplete = true;
    }

    /**
     * Used to calculate the dimensions of the dragged garden
     * @param e the mouse event
     */
    function onMouseMove(e: MouseEvent) {
        if (mousedown) {
            dragComplete = false;

            const x = e.pageX;
            const y = e.pageY;

            endPoint = { x, y };
        }
    }

    const TILE_SIZE = 100;

    // The top left corner of the dragged garden
    const drawPoint1 = $derived.by<Point | null>(() => {
        if (!startPoint || !endPoint) {
            return null;
        }

        return {
            x: Math.min(startPoint.x, endPoint.x),
            y: Math.min(startPoint.y, endPoint.y),
        };
    });

    // The bottom right corner of the dragged garden
    const drawPoint2 = $derived.by<Point | null>(() => {
        if (!startPoint || !endPoint) {
            return null;
        }

        return {
            x: Math.max(startPoint.x, endPoint.x),
            y: Math.max(startPoint.y, endPoint.y),
        };
    });

    // The number of tiles composing the height of the dragged garden
    const height = $derived.by(() => {
        if (!drawPoint1 || !drawPoint2) {
            return null;
        }

        return Math.floor((drawPoint2.y - drawPoint1.y) / TILE_SIZE);
    });

    // The number of tiles composing the width of the dragged garden
    const width = $derived.by(() => {
        if (!drawPoint1 || !drawPoint2) {
            return null;
        }

        return Math.floor((drawPoint2.x - drawPoint1.x) / TILE_SIZE);
    });

    // Disallows gardens with a width or height of zero
    $effect(() => {
        if (width === null || height === null) {
            return;
        }

        if (dragComplete && (width === 0 || height === 0)) {
            startPoint = null;
            endPoint = null;
            dragComplete = false;
        }
    });

    let gardenName = $state<string>("");
    let invalidName = $state<boolean>(false);

    /**
     * Callback function to persist the dragged garden to Firestore.
     */
    async function onClick() {
        const userId = auth.value?.uid;

        if (!userId) {
            return;
        }

        if (gardenName.trim().length === 0) {
            invalidName = true;
            return;
        }

        const collectionRef = collection(
            firestore,
            "gardens",
            userId,
            "gardens",
        );

        if (!width || width <= 0 || !height || height <= 0) {
            return;
        }

        const res = await addDoc(collectionRef, {
            width,
            height,
            scale: 1,
            name: gardenName.trim(),
        });

        await goto(`/gardens/${res.id}`);
    }

    // Resets the name if a drag is finished
    $effect(() => {
        dragComplete;

        gardenName = "";
    });
</script>

<Metadata title="add garden | farmer's market" />

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main
    class="flex w-full flex-col items-center justify-center gap-4 select-none"
    onmousedown={onMouseDown}
    onmouseup={onMouseUp}
    onmousemove={onMouseMove}
>
    <!-- New garden name input -->
    {#if dragComplete && drawPoint1 && drawPoint2}
        <input
            class="p-2 text-center text-4xl/6 font-bold focus:outline-accent"
            type="text"
            placeholder="your garden"
            style:outline={invalidName ? "2px solid red" : ""}
            oninput={() => (invalidName = false)}
            onmousedown={(e) => e.stopPropagation()}
            onmouseup={(e) => e.stopPropagation()}
            onmousemove={(e) => e.stopPropagation()}
            bind:value={gardenName}
        />
    {/if}
    <!-- Garden preview grid -->
    {#if drawPoint1 && drawPoint2}
        <div
            class="absolute container grid w-fit gap-1 overflow-hidden rounded-xl transition"
            class:centered={dragComplete}
            style:left="{drawPoint1.x}px"
            style:top="{drawPoint1.y}px"
            style:grid-template-columns="repeat({width}, {TILE_SIZE}px)"
            style:grid-template-rows="repeat({height}, {TILE_SIZE}px)"
        >
            {#each { length: height! }}
                {#each { length: width! }}
                    <div
                        class="
                tile
                flex h-full w-full flex-row items-center justify-center
            "
                        style:width="{TILE_SIZE}px"
                        style:height="{TILE_SIZE}px"
                    ></div>
                {/each}
            {/each}
        </div>
    {:else}
        <h1>Drag to create your garden!</h1>
    {/if}
    <!-- Proceed button -->
    {#if dragComplete && drawPoint1 && drawPoint2}
        <button
            class="proceed text-2xl text-accent hover:cursor-pointer"
            onmousedown={(e) => e.stopPropagation()}
            onmouseup={(e) => e.stopPropagation()}
            onmousemove={(e) => e.stopPropagation()}
            onclick={onClick}
        >
            proceed
            <FallbackIcon
                icon="ri:arrow-right-long-line"
                preload={["ri:arrow-right-long-line"]}
                class="mr-1 inline-block"
            />
        </button>
    {/if}
</main>

<style>
    .tile {
        background-color: var(--color-garden-dirt);
    }

    .centered {
        position: static;
        margin-bottom: 0.25rem;
    }

    main {
        height: calc(100vh - 5rem);
    }

    .proceed {
        background: linear-gradient(currentColor 0 0) bottom left/
            var(--underline-width, 0%) 0.1em no-repeat;
        display: inline-block;
        padding: 0 0.5em 0.2em;
        text-decoration: none;
        transition: background-size 0.25s;
    }

    .proceed:hover {
        --underline-width: 100%;
    }
</style>

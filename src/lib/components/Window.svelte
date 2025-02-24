<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        top?: Snippet;
        bottom?: Snippet;
        children?: Snippet;
    }

    let { top, bottom, children }: Props = $props();
</script>

<section
    class="window relative flex h-full w-full flex-col overflow-hidden rounded-lg drop-shadow-2xl"
>
    <div
        class="top drop absolute top-0 right-0 left-0 z-50 flex h-10 w-full flex-row items-center justify-between px-2"
    >
        {@render top?.()}
    </div>
    <div class="side side-left absolute top-0 bottom-0 left-0 z-40 w-2.5"></div>
    <div
        class="side side-right absolute top-0 right-0 bottom-0 z-40 w-2.5"
    ></div>
    <div class="mt-12 mb-10 grow overflow-scroll">{@render children?.()}</div>
    <div
        class="bottom drop absolute right-0 bottom-0 left-0 z-50 flex h-9.5 w-full flex-row items-center justify-between px-2"
    >
        {@render bottom?.()}
    </div>
</section>

<style>
    .window {
        border: 0.5rem solid black;
        background-color: var(--color-window-dirt);
    }

    .top {
        box-sizing: border-box;
        background-color: hsl(26, 54%, 40%);
        border-top: 0.5rem solid hsl(25, 35%, 58%);
        box-shadow: 0px 18px 0px -10px var(--color-window-dirt-darker);
        border-left: 0.625rem solid hsl(25, 35%, 58%);
        border-right: 0.625rem solid hsl(25, 35%, 58%);
    }

    .bottom {
        background-color: hsl(26, 54%, 30%);
        border-top: 0.5rem solid hsl(25, 35%, 58%);
    }

    .side {
        box-sizing: border-box;
        background-color: hsl(25, 35%, 58%);
    }

    .side-right {
        box-shadow: -8px 0px 0px 0px var(--color-window-dirt-darker);
    }
</style>

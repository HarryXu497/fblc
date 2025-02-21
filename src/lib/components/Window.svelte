<script lang="ts">
    import type { Snippet } from "svelte";
    import FallbackIcon from "./FallbackIcon.svelte";

	interface Props {
		programText?: string;
		children?: Snippet;
	}

	let {
		programText = "garden.exe",
		children
	}: Props = $props();
</script>

<!-- <section class="rounded-xl overflow-hidden relative drop-shadow-md bg-lighter-accent w-full h-full">
	<div class="z-50 drop h-8 w-full absolute top-0 left-0 right-0 flex flex-row bg-white justify-between px-4 items-center">
		<p class="text-black">{programText}</p>
		<div class="flex flex-row gap-4">
			<FallbackIcon font-size="20px" class="text-black" icon="mdi:minimize" />
			<FallbackIcon font-size="20px" class="text-black" icon="mdi:window-restore" />
			<FallbackIcon font-size="20px" class="text-black" icon="mdi:close" />
		</div>
	</div>
	{@render children?.()}
	<div class="z-50 drop h-8 w-full absolute bottom-0 left-0 right-0 flex flex-row bg-white justify-center px-4 items-center gap-4">

	</div>
</section> -->

<section class="relative drop-shadow-2xl w-full h-full window rounded-lg overflow-hidden">
	<div class="top z-50 drop h-10 w-full absolute top-0 left-0 right-0 flex flex-row justify-between px-4 items-center">
		<p class="text-black">{programText}</p>
	</div>
    <div class="w-2.5 z-40 absolute top-0 bottom-0 left-0 side side-left">
        
    </div>
    <div class="w-2.5 z-40 absolute top-0 bottom-0 right-0 side side-right">

    </div>
	{@render children?.()}
	<div class="bottom z-50 drop h-9.5 w-full absolute bottom-0 left-0 right-0 flex flex-row bg-white justify-center px-4 items-center gap-4">

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

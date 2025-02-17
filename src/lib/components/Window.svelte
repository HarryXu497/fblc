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

<section class="rounded-xl overflow-hidden relative drop-shadow-md bg-lighter-accent w-full h-full">
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
</section>

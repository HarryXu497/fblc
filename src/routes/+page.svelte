<script lang="ts">
  import Window from "$lib/components/Window.svelte";
</script>

<svelte:head>
    <title>Farmers Market</title>
</svelte:head>

<main>
	<section class="grid grid-cols-12 grid-rows-12 h-screen fixed-height">
		<h1 class="text-[72px] col-start-2 row-start-3 col-end-6 row-end-4">farmers<span class="text-accent">market</span></h1>
		<div class="text-[24px] leading-8 col-start-2 row-start-5 col-end-6 row-end-7 flex flex-col gap-6">
			<p>99 percent of computer science students suffer from back pain.</p>
			<p class="text-accent">We can fix that.</p>
		</div>
		<div class="col-start-8 col-end-12 row-start-3 row-end-9">
			<Window>
                Hello World
            </Window>
		</div>
	</section>
	<section class="grid grid-cols-12 grid-rows-12 h-screen">
		<h1 class="text-[36px] col-start-7 col-end-12 row-start-1 row-end-2">detect poor posture <span class="text-accent">earlier</span></h1>
		<div class="text-[24px] leading-8 col-start-7 row-start-2 col-end-11 row-end-4 flex flex-col gap-6">
			<p>Our <span class="text-accent">bleeding edge AI technology</span> takes an innovative new approach to <span class="text-accent">posture diagnosis</span>.</p>
		</div>
		<div class="col-start-2 row-start-1 col-end-6 row-end-7">
			<Window/>
		</div>
	</section>
</main>

<style lang="scss">
	.fixed-height {
		height: calc(100vh - 5rem);
	}
</style>

<script lang="ts">
	import AuthForm from "$lib/components/AuthForm.svelte";
    import Metadata from "$lib/components/Metadata.svelte";
</script>

<Metadata
    title="log in | farmer's market"
/>

<div class="w-screen size flex flex-col items-center justify-center">
	<div class="w-fit">
		<h1 class="text-4xl mb-4 text-center">
			log <span class="text-accent">in</span>
		</h1>
		<AuthForm formType={"log-in"}/>
	</div>
</div>

<style>
	.size {
		height: calc(100vh - 5rem);
	}
</style>
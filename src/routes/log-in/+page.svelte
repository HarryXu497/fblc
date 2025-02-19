<script lang="ts">
	import AuthForm from "$lib/components/AuthForm.svelte";
</script>

<svelte:head>
	<title>Log In | Farmers Market</title>
</svelte:head>
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
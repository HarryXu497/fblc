<script lang="ts">
	import AuthForm from "$lib/components/AuthForm.svelte";

</script>

<svelte:head>
	<title>Sign Up | FarmersMarket</title>
</svelte:head>
<main class="w-screen size flex flex-col items-center justify-center">
	<div class="w-fit">
		<h1 class="text-4xl mb-4 text-center">
			sign <span class="text-accent">up</span>
		</h1>
		<AuthForm formType={"sign-up"}/>
	</div>
</main>

<style>
	.size {
		height: calc(100vh - 5rem);
	}
</style>
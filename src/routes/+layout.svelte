<script lang="ts">
	import { onMount, type Snippet } from "svelte";
	import { firebaseAuth } from "$lib/firebase";
	import auth from "$lib/state/auth.svelte";
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import "../app.css";
  	import NavBar from "$lib/components/NavBar.svelte";

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	const AUTHENTICATED_ROUTES = [
		"/gardens",
		"/new-garden",
	]

    const STARTS_WITH_ROUTES = [
		"/gardens",
	]

	onMount(() => {
		const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
			auth.value = user

			if (browser && AUTHENTICATED_ROUTES.some(route => window.location.pathname.split("?")[0] === (route)) && !auth.value) {
				await goto("/log-in");
			}

			if (browser && STARTS_WITH_ROUTES.some(route => window.location.pathname.split("?")[0].startsWith(route)) && !auth.value) {
				await goto("/log-in");
			}
		});
	
		return unsubscribe;
	})
</script>

<!-- landing page -->
<header class="w-full">
    <NavBar/>
</header>

{@render children?.()}
<script lang="ts">
	import { onMount, type Snippet } from "svelte";
	import { firebaseAuth } from "$lib/firebase";
	import authStore from "$lib/stores/authStore";
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import "../app.css";
  	import NavBar from "$lib/components/NavBar.svelte";

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

    // TODO: fix
	const AUTHENTICATED_ROUTES = [
		"/classes",
		"/new-class",
	]

	onMount(() => {
		const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
			authStore.set(user)


			if (browser && AUTHENTICATED_ROUTES.some(route => window.location.pathname.split("?")[0] === (route)) && !$authStore) {
				goto("/log-in");
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
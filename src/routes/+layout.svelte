<script lang="ts">
    import type { Snippet } from "svelte";
    import { firebaseAuth } from "$lib/firebase";
    import auth from "$lib/state/auth.svelte";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import "../app.css";
    import NavBar from "$lib/components/NavBar.svelte";
    import { page } from "$app/state";

    /**
     * @param children The content passed within the layout
     */
    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();

    let loaded = $state(false);

    const AUTHENTICATED_ROUTES = [
        "/gardens",
        "/garden/new",
        "/sell",
        "/buy",
        "/chats",
    ];

    const STARTS_WITH_ROUTES = ["/gardens", "/buy", "/chats"];

    // Redirects users if they are not logged in
    $effect(() => {
        const pathname = page.url.pathname.split("?")[0];

        if (!auth.value && loaded) {
            if (
                browser &&
                (AUTHENTICATED_ROUTES.some((route) => pathname === route) ||
                    STARTS_WITH_ROUTES.some((route) =>
                        pathname.startsWith(route),
                    ))
            ) {
                goto("/log-in");
            }
        }
    });

    // Attaches a listener to the firebase auth state change and
    // synchronizes the 'auth' state to it
    $effect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
            auth.value = user;
            loaded = true;
        });

        return unsubscribe;
    });
</script>

<!-- landing page -->
<header class="w-full">
    <NavBar />
</header>

{@render children?.()}

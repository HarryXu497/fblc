<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import { firebaseAuth } from "$lib/firebase";
    import auth from "$lib/state/auth.svelte";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import "../app.css";
    import NavBar from "$lib/components/NavBar.svelte";
    import { page } from "$app/state";

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

    const STARTS_WITH_ROUTES = ["/gardens", "/buy", "/chats",];

    $effect(() => {
        const pathname = page.url.pathname.split("?")[0];

        console.log(auth.value);

        if (!auth.value && loaded) {
            if (
                browser &&
                (
                    AUTHENTICATED_ROUTES.some((route) => pathname === route) ||
                    STARTS_WITH_ROUTES.some((route) => pathname.startsWith(route))
                )
            ) {
                console.log("root redirect")
                goto("/log-in");
            }
        }
    })

    $effect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
            console.log("loade")
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

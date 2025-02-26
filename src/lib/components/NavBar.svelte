<script lang="ts">
    /**
     * A component that displays the navigation bar at the top of the website
     */

    import { base } from "$app/paths";
    import auth from "$lib/state/auth.svelte";
    import { goto } from "$app/navigation";
</script>

<nav
    class="relative flex h-20 w-full flex-row items-center justify-between px-8"
>
    <!-- Logo -->
    <h1 class="text-2xl text-black">
        <a
            class="flex h-full w-full flex-row items-center font-bold"
            href="{base}/"
        >
            <img
                src="/icons/carrot.svg"
                alt=""
                class="mr-1 inline-block aspect-square w-10"
            />
            farmers<span class="text-accent">market</span>
        </a>
    </h1>
    {#if auth.value !== null && auth.value.displayName != null}
        <div
            class="absolute inset-0 -z-10 flex flex-row items-center justify-center"
        >
            <p class="text-xl text-black lowercase">
                welcome, <span class="text-accent"
                    >{auth.value.displayName}!</span
                >
            </p>
        </div>
    {/if}
    <div class="text-md flex justify-between gap-4">
        {#if auth.value === null}
            <a
                class="rounded-xl bg-accent px-3 py-2 text-white drop-shadow-xl transition-transform hover:-translate-y-1 hover:cursor-pointer"
                href="{base}/sign-up"
            >
                sign up
            </a>
            <a
                class="flex flex-row items-center justify-center rounded-xl text-black transition-transform hover:-translate-y-1 hover:cursor-pointer"
                href="{base}/log-in"
            >
                log in
            </a>
        {:else}
            <a
                class="rounded-xl bg-accent px-3 py-2 text-white drop-shadow-xl transition-transform hover:-translate-y-1"
                href="{base}/gardens"
            >
                view gardens
            </a>
            <a
                class="rounded-xl bg-accent px-3 py-2 text-white drop-shadow-xl transition-transform hover:-translate-y-1"
                href="{base}/buy"
            >
                buy crops
            </a>
            <a
                class="rounded-xl bg-accent px-3 py-2 text-white drop-shadow-xl transition-transform hover:-translate-y-1"
                href="{base}/chats"
            >
                view chats
            </a>
            <button
                class="rounded-xl text-black transition-transform hover:-translate-y-1"
                onclick={async () => {
                    // sign out the user and send them to the home page
                    await auth.logOut();
                    await goto("/");
                }}
            >
                sign out
            </button>
        {/if}
    </div>
</nav>

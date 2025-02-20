<script lang="ts">
    import { base } from "$app/paths";
    import auth from "$lib/state/auth.svelte";
    import { firebaseAuth } from "$lib/firebase";
    import FallbackIcon from "./FallbackIcon.svelte";
</script>

<nav class="w-full flex flex-row h-20 justify-between px-8 items-center relative">
  <!-- Logo -->
  <h1 class="text-2xl text-black">
    <a class="flex items-center w-full h-full" href="{base}/">
      <FallbackIcon icon="ri:sparkling-fill" preload={["ri:sparkling-fill"]} class="inline-block mr-1" />
      farmers<span class="text-accent">market</span>
    </a>
  </h1>
  {#if auth.value !== null}
    <div class="absolute inset-0 flex flex-row items-center justify-center -z-10">
        <p class="text-black text-xl">
            Welcome, <span class="text-accent">{auth.value.displayName}!</span>
        </p>
    </div>
  {/if}
  <div class="flex justify-between gap-4 text-md">
    {#if auth.value === null}
      <a
        class="rounded-xl bg-accent hover:-translate-y-1 hover:cursor-pointer transition-transform text-white px-3 py-2 drop-shadow-xl"
        href="{base}/sign-up"
      >
        sign up
      </a>
      <a
        class="rounded-xl text-black hover:-translate-y-1 hover:cursor-pointer transition-transform flex flex-row justify-center items-center"
        href="{base}/log-in"
      >
        log in
      </a>
    {:else}
      <a
        class="rounded-xl bg-accent hover:-translate-y-1 transition-transform text-white px-3 py-2 drop-shadow-xl"
        href="{base}/gardens"
      >
        view gardens
      </a>
      <a
        class="rounded-xl bg-accent hover:-translate-y-1 transition-transform text-white px-3 py-2 drop-shadow-xl"
        href="{base}/sell"
      >
        sell crops
      </a>
      <button
        class="rounded-xl text-black hover:-translate-y-1 transition-transform"
        onclick={() => firebaseAuth.signOut()}
      >
        sign out
      </button>
    {/if}
  </div>
</nav>

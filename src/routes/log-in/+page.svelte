<script lang="ts">
    /**
     * A page that shows a form to log in a user
    */

    import AuthForm from "$lib/components/AuthForm.svelte";
    import Metadata from "$lib/components/Metadata.svelte";
</script>

<Metadata title="log in | farmer's market" />

<div class="size flex w-screen flex-col items-center justify-center">
    <div class="w-fit">
        <h1 class="mb-4 text-center text-4xl">
            log <span class="text-accent">in</span>
        </h1>
        <AuthForm formType={"log-in"} />
    </div>
</div>

<style>
    .size {
        height: calc(100vh - 5rem);
    }
</style>

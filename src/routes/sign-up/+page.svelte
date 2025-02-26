<script lang="ts">
    /**
     * A page that shows a form to sign up a user
    */

    import AuthForm from "$lib/components/AuthForm.svelte";
    import Metadata from "$lib/components/Metadata.svelte";
</script>

<Metadata title="sign up | farmer's market" />
<main class="size flex w-screen flex-col items-center justify-center">
    <div class="w-fit">
        <h1 class="mb-4 text-center text-4xl">
            sign <span class="text-accent">up</span>
        </h1>
        <AuthForm formType={"sign-up"} />
    </div>
</main>

<style>
    .size {
        height: calc(100vh - 5rem);
    }
</style>

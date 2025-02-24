<script lang="ts">
    import { page } from "$app/state";
</script>

<main
    class="flex h-[calc(100%_-_6rem)] w-full flex-row items-center justify-center"
>
    <h1 class="text-5xl">
        <span class="text-accent">{page.status}</span>: {page.error?.message ||
            "Something went wrong"}
    </h1>
</main>

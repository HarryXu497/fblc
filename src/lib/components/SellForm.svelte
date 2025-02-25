<script lang="ts">
    import type { Crop } from "$lib/models/Crop.model";
    import crops from "$lib/state/crops.svelte";
    import type { Snippet } from "svelte";

    interface Props {
        onSubmit: (e: SubmitEvent) => void;
        crop: Crop | null;
        description: string | null;
        price: number | null;
        quantity: number | null;
        images: FileList | null;
        error: string | null;
        requireImages?: boolean;
        header?: Snippet;
        buttonContent?: Snippet;
    }

    let {
        onSubmit,
        crop = $bindable(),
        description = $bindable(),
        price = $bindable(),
        quantity = $bindable(),
        images = $bindable(),
        error = $bindable(),
        requireImages = true,
        header,
        buttonContent,
    }: Props = $props();
</script>

<main class="size flex w-screen flex-col items-center justify-center">
    <div class="w-fit">
        <h1 class="mb-4 text-center text-4xl">
            {#if header}
                {@render header?.()}
            {:else}
                sell your <span class="text-accent">crops</span>
            {/if}
        </h1>
        <form class="auth-form w-full items-center" onsubmit={onSubmit}>
            <div class="form-control">
                <label for="crop">crop</label>
                <select required name="crop" id="crop" bind:value={crop}>
                    <option value={null}>none</option>
                    {#if crops.value !== null}
                        {#each crops.value as crop}
                            <option value={crop}>{crop.name}</option>
                        {/each}
                    {/if}
                </select>
            </div>
            <div class="form-control">
                <label for="description">description</label>
                <textarea
                    required
                    class="h-48"
                    name="description"
                    id="description"
                    placeholder="description"
                    bind:value={description}
                ></textarea>
            </div>
            <div class="name-control flex w-full justify-between gap-[10%]">
                <div class="form-control w-1/2">
                    <label for="price" class="font-bold">price</label>
                    <input
                        bind:value={price}
                        required
                        min="0"
                        step="0.01"
                        type="number"
                        name="price"
                        id="price"
                        placeholder="price"
                    />
                </div>
                <div class="form-control w-1/2">
                    <label for="quantity">quantity</label>
                    <input
                        bind:value={quantity}
                        required
                        min="0"
                        step="1"
                        type="number"
                        name="quantity"
                        id="quantity"
                        placeholder="quantity"
                    />
                </div>
            </div>
            <div class="form-control">
                <label for="images">images</label>
                <label
                    class="image-selector block w-full text-center text-gray-500"
                    for="images">select your images</label
                >
                <input
                    required={requireImages}
                    multiple
                    accept="image/*"
                    class="hidden"
                    type="file"
                    name="images"
                    id="images"
                    bind:files={images}
                />
            </div>
            {#if images !== null}
                <div class="flex flex-col overflow-ellipsis">
                    {#each images as image}
                        <span>{image.name}</span>
                    {/each}
                </div>
            {/if}
            {#if error}
                <p class="text-[#b64040]">{error}</p>
            {/if}
            <button
                class="mt-2 w-full rounded-lg bg-accent py-2 text-white transition-transform hover:-translate-y-1 hover:cursor-pointer"
                type="submit"
            >
            {#if buttonContent}
                {@render buttonContent?.()}
            {:else}
                submit
            {/if}
            </button>
        </form>
    </div>
</main>

<style lang="postcss">
    @reference "tailwindcss";

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    label:not(.image-selector) {
        @apply mb-[2px] block w-full font-bold text-black;
    }

    .form-control > input,
    .form-control > select,
    .form-control > textarea,
    .form-control > .image-selector {
        @apply w-full rounded-md p-2 outline-none;
        background-color: var(--color-light-accent);

        &::placeholder {
            @apply text-gray-500;
        }
    }

    .image-selector {
        @apply text-gray-500;
    }

    .form-control > input:focus,
    .form-control > select:focus,
    .form-control > textarea:focus,
    .form-control > .image-selector {
        @apply shadow-inner;
    }

    .form-control,
    .name-control {
        width: min(60vw, 30rem);
    }

    .size {
        height: calc(100vh - 5rem);
    }
</style>

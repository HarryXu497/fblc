<script lang="ts">
    import type { Crop } from "$lib/models/Crop.model";
    import crops from "$lib/utils/crops.svelte";
  
    let error = $state<string | null>(null);
    let crop = $state<Crop | null>(null);
    let price = $state<number | null>(null);
    let quantity = $state<number | null>(null);
    let location = $state<number | null>(null);
  
    async function onSubmit(e: SubmitEvent) {
        e.preventDefault();
    }
</script>
  
<main class="w-screen size flex flex-col items-center justify-center">
	<div class="w-fit">
		<h1 class="text-4xl mb-4 text-center">
			sell your <span class="text-accent">crops</span>
		</h1>
    <form
        class="auth-form items-center w-full"
        onsubmit={onSubmit}
    >
        <div class="form-control">
            <label for="crop">crop</label>
            <select
                required
                name="crop"
                id="crop"
                bind:value={crop}
            >
            <option value={null}>none</option>
            {#if crops.value !== null}
                {#each crops.value as crop}
                    <option value={crop}>{crop.name}</option>
                {/each}
            {/if}
            </select>
        </div>
        <div class="name-control flex justify-between gap-[10%] w-full">
            <div class="form-control w-1/2">
            <label for="price" class="font-bold">price</label>
            <input
                bind:value={price}
                required
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
                type="number"
                name="quantity"
                id="quantity"
                placeholder="quantity"
            />
            </div>
        </div>
        {#if error}
        <p class="text-[#b64040]">{error}</p>
        {/if}
        <button
        class="w-full bg-accent rounded-lg py-2 mt-2 text-white hover:-translate-y-1 transition-transform"
        type="submit">Submit</button
        >
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
  
    label {
      @apply font-bold block text-black w-full mb-[2px];
    }
    .form-control > input, .form-control > select {
      @apply rounded-md outline-none p-2 w-full placeholder-black;
      background-color: var(--color-light-accent);
    }
  
    .form-control > input:focus, .form-control > select:focus {
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
  
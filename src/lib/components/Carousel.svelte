<script lang="ts">
    /**
     * A component that displays an image carousel
     */

    import { register } from "swiper/element/bundle";
    // Register WebComponents
    register();

    /**
     * @param imageURLs a list of image URLs displayed by the carousel
     * @param initialSlide the index of the first slide displayed by the carouel
     */
    interface Props {
        imageURLs: string[];
        initialSlide?: number;
    }

    let { imageURLs, initialSlide = 0 }: Props = $props();

    // TODO: switch to tailwind
</script>

<div
    class="gallery align-center flex flex-row justify-center rounded-sm shadow-xl"
>
    <swiper-container
        class="relative flex w-full flex-row rounded-sm border-8 border-black bg-white"
        slides-per-view={1}
        space-between={4}
        speed={300}
        initial-slide={initialSlide}
        loop={true}
        grab-cursor={true}
        autoplay={{
            delay: 3000,
        }}
        navigation={true}
    >
        {#if imageURLs.length === 0}
            <div class="gallery__placeholder">
                <h3 class="gallery__placeholder__text">No Images Yet</h3>
            </div>
        {/if}
        {#each imageURLs as src}
            <swiper-slide class="carousel__image">
                <div class="swiper-zoom-container">
                    <img {src} alt="" />
                </div>
            </swiper-slide>
        {/each}
        <!-- </div> -->
    </swiper-container>
</div>

<style>
    .gallery {
        --swiper-navigation-sides-offset: 1.5rem;
        --swiper-navigation-color: white;
    }

    .carousel__image,
    .gallery__placeholder {
        position: relative;

        overflow: hidden;

        display: flex;
        flex-direction: row;

        flex-grow: 1;
        width: 100%;
        height: 100%;
        aspect-ratio: 16 / 9;

        background-color: var(--color-lighter-1);
    }

    .gallery__placeholder__text {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
</style>

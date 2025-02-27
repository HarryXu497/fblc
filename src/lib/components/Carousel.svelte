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
</script>

<div
    class="gallery align-center flex flex-row justify-center rounded-sm shadow-xl"
>
    <swiper-container
        class="relative flex w-full flex-row rounded-sm border-8 border-b-gray-800 bg-white"
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
            <div
                class="relative flex aspect-video h-full w-full grow flex-row overflow-hidden bg-gray-50"
            >
                <h3
                    class="flex h-full w-full flex-row items-center justify-center"
                >
                    No Images Yet
                </h3>
            </div>
        {/if}
        {#each imageURLs as src}
            <swiper-slide
                class="relative flex aspect-video h-full w-full grow flex-row overflow-hidden bg-gray-50"
            >
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
</style>

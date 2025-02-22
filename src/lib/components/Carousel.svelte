<script lang="ts">
	/** The gallery iamge carousel */
  	import { register } from 'swiper/element/bundle';

	register();

	interface Props {
		imageURLs: string[];
		initialSlide?: number;
	}

	let { imageURLs, initialSlide = 0 }: Props = $props();
</script>

<div class="gallery shadow-xl rounded-sm">	
	<swiper-container
		class="carousel border-8 border-black rounded-sm"
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
					<img src={src} alt=""/>
				</div>
			</swiper-slide>
		{/each}
		<!-- </div> -->
	
	</swiper-container>

</div>

<style lang="scss">

	.gallery {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		--swiper-navigation-sides-offset: 1.5rem;
		--swiper-navigation-color: white;
	}
	
	.carousel {
		display: flex;
		flex-direction: row;
		position: relative;
		width: 100%;
		background-color: var(--color-light);
	}

	.carousel__image, .gallery__placeholder {
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
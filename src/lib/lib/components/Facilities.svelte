<script lang="ts">
	import { SectionTitle } from '$lib'
	import type { SubTitleProps } from '$lib/components/SectionTitle/SectionTitle.svelte'
	import emblaCarouselSvelte, { type EmblaCarouselType } from 'embla-carousel-svelte'
	import Autoplay from 'embla-carousel-autoplay'

	const subTitles: SubTitleProps[] = [
		{
			content:
				'Tuổi thơ chính là giai đoạn quan trọng nhất trong quá trình phát triển của một con người. Hiểu được điều đó, ILO đã tập trung xây dựng một môi trường học trong lành và thân thiện dành cho con để mỗi ngày tới trường đều là một ngày tràn đầy niềm vui và hạnh phúc. '
		}
	]
	const images: { src: string; alt: string; caption: string }[] = [
		{
			src: 'https://ilo.edu.vn/themes/ilo/assets/landingpage/05aug/imgs/imagecompressor/csvc01.webp',
			alt: '',
			caption: 'Sân chơi chính'
		},
		{
			src: 'https://ilo.edu.vn/themes/ilo/assets/landingpage/05aug/imgs/imagecompressor/csvc02.webp',
			alt: '',
			caption: 'Sân chơi thể thao'
		},
		{
			src: 'https://ilo.edu.vn/themes/ilo/assets/landingpage/05aug/imgs/imagecompressor/csvc03.webp',
			alt: '',
			caption: 'Khu vực học tập'
		},
		{
			src: 'https://ilo.edu.vn/themes/ilo/assets/landingpage/05aug/imgs/imagecompressor/csvc04.webp',
			alt: '',
			caption: 'Khu vườn ILO'
		},
		{
			src: 'https://ilo.edu.vn/themes/ilo/assets/landingpage/05aug/imgs/imagecompressor/csvc05.webp',
			alt: '',
			caption: 'Khu vườn ILO'
		},
		{
			src: 'https://ilo.edu.vn/themes/ilo/assets/landingpage/05aug/imgs/imagecompressor/csvc06.webp',
			alt: '',
			caption: 'Phòng tưởng tượng'
		}
	]
	let emblaApi: any
	let options = { loop: true }
	let plugins = [Autoplay({ delay: 2000, stopOnInteraction: false })]
	let scrollSnaps: number[] = []
	let selectedIndex = 0

	function onInit(e: any) {
		emblaApi = e.detail
		emblaApi.on('select', onSelect)
		scrollSnaps = emblaApi.scrollSnapList()
	}

	function scrollTo(index: number) {
		emblaApi?.scrollTo(index)
	}

	function onSelect(e: EmblaCarouselType) {
		selectedIndex = e.selectedScrollSnap()
	}
</script>

<section class="sectionContainer">
	<div class="container">
		<SectionTitle title="CƠ SỞ VẬT CHẤT ILO" {subTitles} />
		<div class="sliderWrapper" use:emblaCarouselSvelte={{ options, plugins }} on:emblaInit={onInit}>
			<div class="slider">
				{#each images as { src, alt, caption }}
					<figure class="imageContainer">
						<img {src} {alt} />
						<figcaption class="captionWrapper">
							<p class="caption">
								{caption}
							</p>
						</figcaption>
					</figure>
				{/each}
			</div>
			<ul class="scrollSnapContainer">
				{#each scrollSnaps as _, i}
					{@const active = i === selectedIndex}
					<li class="scrollSnap">
						<button class="scrollSnapButton" class:active on:click={() => scrollTo(i)} />
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style lang="postcss">
	.sectionContainer {
		padding-top: 3rem;
		padding-bottom: 3rem;
	}
	.container {
		display: flex;
		padding-left: 1rem;
		padding-right: 1rem;
		margin-left: auto;
		margin-right: auto;
		flex-direction: column;
		max-width: 1536px;
		gap: 1.25rem;
	}
	.sliderWrapper {
		overflow: hidden;
	}
	.slider {
		display: flex;
		align-items: center;
	}
	.imageContainer {
		position: relative;
		min-width: 0;
		flex: 0 0 100%;
	}
	.captionWrapper {
		position: absolute;
		right: 0;
		bottom: 1.25rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		padding-left: 2.25rem;
		padding-right: 2.25rem;
		border-top-left-radius: 1.5rem;
		border-bottom-left-radius: 1.5rem;
		background: rgba(6, 7, 77, 0.7);
	}
	.caption {
		color: #ffffff;
		font-size: 0.875rem;
		line-height: 1.25rem;
	}
	.scrollSnapContainer {
		display: flex;
		margin-top: 0.5rem;
		justify-content: center;
		align-items: center;
		gap: 0.625rem;
	}
	.scrollSnap {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
	}
	.scrollSnapButton::before {
		content: '';
		display: block;
		height: 0.625rem;
		width: 0.625rem;
		border-radius: 100%;
		background-color: rgb(209, 213, 219);
		padding: 0.25rem;
	}
	.active::before {
		background-color: rgba(6, 7, 77, 0.7);
	}
</style>

<script lang="ts">
	import { slide } from 'svelte/transition'
	import { Burger, Button } from '$lib'

	export let logoSrc =
		'https://ilo.edu.vn/themes/ilo/assets/landingpage/05aug/imgs/imagecompressor//logo-header.webp'
	export let logoDescription = 'Logo'
	export let buttonText = 'Đăng ký tư vấn'
	export let headerNavs: { label: string; href: string }[] = [
		{ label: 'Nền Tảng Giáo Dục', href: '#foundation' },
		{ label: 'Một ngày tuyệt vời tại ILO', href: '#aDayAtOurSchool' },
		{ label: 'Vì sao chọn ILO', href: '#why' }
	]

	function handleToggleNav() {
		opened = !opened
	}

	let opened = false
	let innerWidth = 0
	$: isDesktop = innerWidth > 1023
	$: {
		if (isDesktop) {
			opened = true
		}
	}
</script>

<svelte:window bind:innerWidth />
<header>
	<div class="header">
		<div>
			<img class="logo" src={logoSrc} alt={logoDescription} />
		</div>
		<div class="burgerWrapper">
			<Burger {opened} onClick={handleToggleNav} />
		</div>
		<div class="navigationContainer">
			{#if opened}
				<ul class="navigations" transition:slide>
					{#each headerNavs as { label: content, href } (content)}
						<li class="navigation">
							<a {href}>
								{content}
							</a>
						</li>
					{/each}
					<li class="buttonWrapper">
						<Button fullWidth>
							<span class="headerButton">
								{buttonText}
							</span>
						</Button>
					</li>
				</ul>
			{/if}
		</div>
	</div>
</header>

<style>
	.header {
		display: grid;
		padding-top: 0.625rem;
		padding-bottom: 0.625rem;
		padding-left: 1rem;
		padding-right: 1rem;
		align-items: center;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.875rem;
	}
	.logo {
		max-height: 100px;
	}
	.burgerWrapper {
		display: flex;
		justify-content: flex-end;
	}
	.navigationContainer {
		grid-column: 1/-1;
	}
	.navigations {
		display: flex;
		color: #000000;
		flex-direction: column;
		align-items: center;
	}
	.navigation {
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		text-align: center;
		width: 100%;
	}
	.navigation:hover {
		color: #4aadb5;
	}
	.buttonWrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	.headerButton {
		color: #ffffff;
		font-weight: 700;
	}
	@media (min-width: 1024px) {
		.header {
			margin-left: auto;
			margin-right: auto;
			max-width: 1536px;
			grid-template-columns: repeat(7, minmax(0, 1fr));
		}
		.logo {
			max-height: none;
		}
		.burgerWrapper {
			display: none;
		}
		.navigationContainer {
			grid-column: span 6 / span 6;
		}
		.navigations {
			flex-direction: row;
			justify-content: flex-end;
		}
		.navigation {
			padding-left: 1.75rem;
			padding-right: 1.75rem;
			width: auto;
		}
		.buttonWrapper {
			width: auto;
		}
	}
</style>

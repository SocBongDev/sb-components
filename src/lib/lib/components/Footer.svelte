<script lang="ts">
	import LocationIcon from '~icons/fa6-solid/location-dot'
	import PhoneIcon from '~icons/ph/phone-fill'
	import EmailIcon from '~icons/grommet-icons/mail'
	import FacebookIcon from '~icons/circum/facebook'
	import YoutubeIcon from '~icons/circum/youtube'
	import InstagramIcon from '~icons/circum/instagram'

	type Location = { location: string; address: string }
	const locations: Location[] = [
		{ address: '52 Đặng Dung, phường Tân Định, quận 1, TP.HCM', location: 'ILO ACADEMY qUẬN 1' },
		{
			address: '380 Nguyễn Văn Lượng, phường 16, quận Gò Vấp, TP.HCM',
			location: 'ILO ACADEMY Gò Vấp'
		},
		{
			address: '22A - 24 Thoại Ngọc Hầu, phường Hòa Thạnh, quận Tân Phú, Tp.HCM',
			location: 'ILO ACADEMY Tân pHÚ'
		},
		{
			address:
				'Block A, tầng trệt & tầng 1, chung cư Saigon South Residences, Nguyễn Hữu Thọ, Nhà Bè, TP.HCM',
			location: 'ILO ACADEMY Nam Sài Gòn'
		},
		{
			address:
				'BlockSố 65/3 đường Hoàng Hoa Thám, Khu 8, phường Hiệp Thành, Thành phố Thủ Dầu Một, tỉnh Bình Dương',
			location: 'ILO Bình Dương '
		}
	]
	const contacts = [
		{ icon: PhoneIcon, contactContent: '090 695 4388', contactType: 'Hotline' },
		{ icon: EmailIcon, contactContent: 'info@ilo.edu.vn', contactType: 'Email' }
	]
	const mediaChannels = [
		{ href: 'https://www.facebook.com/iloacademy', icon: FacebookIcon },
		{ href: 'https://www.youtube.com/channel/UCWizKyF_gKVu7CNh2YPKPfQ', icon: YoutubeIcon },
		{ href: 'https://www.instagram.com/iloacademy/', icon: InstagramIcon }
	]
</script>

<footer class="flex flex-col bg-[#efefef] py-12 text-sm">
	<section class="mx-auto w-full max-w-screen-2xl px-4">
		<div class="flex flex-col justify-center lg:flex-row lg:gap-[150px]">
			<div class="grid place-items-center lg:place-items-start">
				<a href="/">
					<img
						class="w-20 lg:w-auto"
						width="212"
						height="237"
						src="https://ilo.edu.vn/themes/ilo/assets/landingpage/05aug/imgs/imagecompressor/logo-footer.webp"
						alt="footer logo"
					/>
				</a>
			</div>
			<div class="flex flex-1 flex-col">
				<div class="flex flex-col gap-8 pb-5">
					<h2 class="text-center text-2xl font-semibold uppercase text-indigo-950 lg:text-left">
						HỆ THỐNG MẦM NON ilo academy
					</h2>
					<div class="flex flex-col gap-4">
						{#each locations as { address, location }}
							<div class="flex gap-5">
								<LocationIcon
									class="flex-shrink-0 flex-grow-0 text-[#06074d]"
									width="35"
									height="35"
								/>
								<div class="flex flex-col gap-1 text-left text-neutral-700">
									<p class="font-semibold uppercase">
										{location}
									</p>
									<p class="font-light">
										{address}
									</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
				<div
					class="flex flex-col gap-5 border-t border-[#afb2b4] pt-5 lg:flex-row lg:justify-between"
				>
					<div class="flex flex-col gap-1 md:flex-row md:gap-5">
						{#each contacts as { contactContent, contactType, icon }}
							{@const protocol = contactType === 'Hotline' ? 'tel' : 'mailto'}
							{@const href = `${protocol}:${contactContent}`}
							<div class="flex items-center gap-5 font-light text-neutral-800 lg:items-end">
								<svelte:component this={icon} class="text-[#06074d]" width="32" height="32" />
								<p>
									{contactType}:
									<a class="font-normal" {href}>
										{contactContent}
									</a>
								</p>
							</div>
						{/each}
					</div>
					<div class="flex flex-col gap-2">
						<div class="flex items-center gap-1 lg:justify-end">
							{#each mediaChannels as { href, icon }}
								<a {href}>
									<svelte:component this={icon} class="text-[#06074d]" width="28" height="28" />
								</a>
							{/each}
						</div>
						<p class=" font-light text-neutral-800">Copyright © 2020 ILO Vietnam</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</footer>

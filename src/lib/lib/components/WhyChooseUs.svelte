<script lang="ts">
	import { Reason } from '$lib'

	type ReasonProps = { src: string; alt?: string; title: string; content: string }
	const reasons: ReasonProps[] = [
		{
			src: 'https://ilo.edu.vn/themes/ilo/assets/landingpage/05aug/imgs/imagecompressor/why01.webp',
			alt: '',
			title: 'Môi trường trong lành và thân thiện:',
			content:
				'Nước sạch, không khí sạch, trường được thiết kế theo lối tối giản chi tiết, tối đa ánh sáng để kích thích sự sáng tạo và tình yêu thiên nhiên của học sinh. Khuôn viên trường được thiết kế theo tiêu chuẩn quốc tế, đảm bảo đầy đủ hoạt động trong nhà và ngoài trời cho trẻ.'
		},
		{
			src: 'https://ilo.edu.vn/themes/ilo/assets/landingpage/05aug/imgs/imagecompressor/why02.webp',
			alt: '',
			title: 'Đội ngũ giáo viên tận tâm, chuyên nghiệp:',
			content:
				'Toàn bộ giáo viên được tuyển chọn gắt gao và sau đó được đào tạo bài bản và chuyên nghiệp với Đại học Hamk tại Phần Lan để đảm bảo hiểu và truyền tải trọn vẹn tinh hoa của nền giáo dục nhân văn này. Giáo viên cũng là những người yêu trẻ như con mình.'
		},
		{
			src: 'https://ilo.edu.vn/themes/ilo/assets/landingpage/05aug/imgs/imagecompressor/why03.webp',
			alt: '',
			title: 'Phương pháp giáo dục hiện đại và nhân văn:',
			content:
				'ILO áp dụng phương pháp Play-based learning (Chơi qua học, học mà chơi) giúp khơi gợi niềm đam mê khám phá cùng khả năng quan sát, tư duy logic, nhận thức bản thân trong mối quan hệ xã hội, các nền văn hoá và phát triển tính cách cho từng em. '
		},
		{
			src: 'https://ilo.edu.vn/themes/ilo/assets/landingpage/05aug/imgs/imagecompressor/why04.webp',
			alt: '',
			title: 'Chế độ dinh dưỡng và sự chăm sóc toàn diện:',
			content:
				'Sử dụng nguồn thực phẩm từ nhà cung cấp uy tín tại TP. HCM, ILO thiết kế thực đơn dựa trên thông tin sức khỏe của học sinh, sẵn sàng điều chỉnh để hỗ trợ nhu cầu dinh dưỡng của bé. '
		}
	]
</script>

<section class="sectionContainer" id="why">
	<div class="container">
		<h2 class="title">VÌ SAO CHỌN ILO</h2>
		<div class="reasonContainer">
			{#each reasons as { content, title, alt, src }}
				<Reason {content} {title} {alt} {src} />
			{/each}
		</div>
	</div>
</section>

<style>
	.sectionContainer {
		padding-top: 3rem;
		padding-bottom: 3rem;
		background: #efefef;
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
	.title {
		color: rgb(30, 27, 75);
		font-size: 1rem;
		line-height: 1.5rem;
		font-weight: 800;
		text-align: center;
	}
	.reasonContainer {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: 0.75rem;
	}
	@media (min-width: 768px) {
		.reasonContainer {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 2rem;
		}
	}
	@media (min-width: 1024px) {
		.title {
			color: 42px;
			line-height: 40px;
		}
		.reasonContainer {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>

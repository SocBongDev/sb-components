<script lang="ts">
	import QuestionAndAnswer from '$lib/components/QuestionAndAnswer/QuestionAndAnswer.svelte'
	import { slide } from 'svelte/transition'
	import CaretDownIcon from '~icons/ion/caret-down-circle-outline'
	import SvelteMarkdown from 'svelte-markdown'

	type FAQContent = { answers: string[]; question: string }

	const FAQs: FAQContent[] = [
		{
			answers: [
				'Điều đặc biệt của Giáo Dục Phần Lan là trẻ em không phải chịu nhiều áp lực học tập, thi cử và bài tập về nhà. Thay vào đó, các con được thoải mái học tập, vui chơi và tham gia nhiều hoạt động đa dạng nhằm phát triển toàn diện các kỹ năng, kiến thức. Vì thế, Giáo Dục Phần Lan còn được biết đến với tên gọi “Giáo Dục Hạnh Phúc”.'
			],
			question: 'Giáo dục Phần Lan có lợi ích gì đối với bé?'
		},
		{
			answers: [
				'ILO Academy là sự kết hợp tinh hoa của giáo dục Phần Lan và chương trình giáo dục mầm non Việt Nam cùng theo đó là tài nguyên hoạt động vui chơi từ ILA sau nhiều năm nghiên cứu với đối tượng trẻ em Việt Nam. Ở đây, chúng tôi nhấn mạnh vào việc nuôi dưỡng tính cách và tâm hồn của con với mong muốn khơi dậy niềm đam mê học tập suốt đời ở trẻ.',
				'Sau quá trình học tập tại ILO Academy, cha mẹ có thể quan sát thấy sự phát triển của con trong 6 lĩnh vực cũng như khả năng vận dụng các kỹ năng mềm thiết yếu trong thế kỷ 21 (Nguyên tắc về 4 chữ C được đề ra bởi Diễn Đàn Kinh Tế Thế Giới:\n\n **Critical thinking** - Tư duy phản biện,\n\n **Creative** - Sáng tạo,\n\n **Communication** - Giao tiếp và **Collaboration** - Hợp tác)'
			],
			question: 'Chương trình mầm non tại ILO Academy có gì đặc biệt?'
		},
		{
			answers: [
				'ILO nhận các bé từ 18 tháng đến 6 tuổi, đây là độ tuổi vàng để các bé phát triển tư duy ngôn ngữ và hoàn thiện các kỹ năng mềm. ',
				'Chương trình học tiêu chuẩn quốc tế cùng các hoạt động ngoại khoá được thiết kế giúp trẻ trang bị những kỹ năng mềm quan trọng và phát triển các chỉ số thông minh một cách toàn diện ngay từ những năm đầu đời, để trẻ tự tin bước vào môi trường K12 quốc tế và nổi trội hơn bạn bè cùng tuổi khi vào lớp 1. '
			],
			question: 'ILO Academy nhận các bé từ mấy tuổi?'
		},
		{
			answers: [
				'Anh/chị có thể điền thông tin liên hệ của mình vào form bên dưới, phía ILO Academy sẽ liên hệ và đặt lịch hẹn với mình sớm nhất'
			],
			question: 'Tôi muốn đăng ký tham quan trường ILO, tôi phải làm như thế nào? '
		}
	]
</script>

<section class="sectionWrapper">
	<div class="container">
		<div class="faq">
			<h2 class="faqTitle">Câu hỏi thường gặp</h2>
			<div class="faqQuestion">
				{#each FAQs as { answers, question }}
					<QuestionAndAnswer let:click={handleQuestionClick}>
						<button class="buttonWrapper" on:click={handleQuestionClick}>
							<i class="caretIcon">
								<CaretDownIcon width="28" height="28" />
							</i>
							<span class="question">
								{question}
							</span>
						</button>

						<div class="answerContainer" slot="answer" transition:slide>
							{#each answers as answer}
								<div class="answer">
									<SvelteMarkdown source={answer} />
								</div>
							{/each}
						</div>
					</QuestionAndAnswer>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.sectionWrapper {
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
		gap: 2rem;
	}
	.faq {
		display: flex;
		padding: 2.5rem;
		background-color: #dbeafe;
		flex-direction: column;
		flex: 1 1 0%;
		gap: 2.5rem;
	}
	.faqTitle {
		color: rgb(30, 27, 75);
		font-size: 1.5rem;
		line-height: 2rem;
		font-weight: 800;
		text-align: center;
		text-transform: uppercase;
	}
	.faqQuestion {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	.buttonWrapper {
		display: flex;
		margin-bottom: 0.5rem;
		gap: 1.25rem;
	}
	.caretIcon {
		flex-grow: 0;
		flex-shrink: 0;
	}
	.question {
		color: rgb(64, 64, 64);
		font-size: 1rem;
		line-height: 1.5rem;
		font-weight: 600;
		text-align: left;
	}
	.answerContainer {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.answer {
		color: rgb(38, 38, 38);
		padding-left: 3rem;
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 400;
	}
	@media (min-width: 1024px) {
		.container {
			flex-direction: row;
		}
		.question {
			font-size: 1.25rem;
			line-height: 1.75rem;
		}
	}
</style>

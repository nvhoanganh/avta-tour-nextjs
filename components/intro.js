import Link from 'next/link';
import CompetitionPreview from './competition-preview';

export default function Intro({ upcomingCompetition }) {
	const {
		title,
		slug,
		type,
		club,
		excerpt,
		date,
		maxPoint,
		heroImage,
		teamsCollection,
	} = upcomingCompetition;

	return (
		<>
			<div className='relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-45 '>
				<div
					className='absolute top-0 w-full h-full bg-center bg-cover'
					style={{
						backgroundImage:
							"url('https://images.unsplash.com/photo-1601646761285-65bfa67cd7a3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80')",
					}}
				>
					<span
						id='blackOverlay'
						className='w-full h-full absolute opacity-40 bg-black'
					></span>
				</div>
				<div className='container relative mx-auto'>
					<div className='items-center flex flex-wrap'>
						<div className='w-full lg:w-6/12 px-4 ml-auto mr-auto text-center'>
							<div className='md:pr-12'>
								<h1 className='text-white font-semibold text-5xl'>
									Hội Tennis người Việt tại Úc
								</h1>
								<p className='mt-4 text-lg text-gray-200'>
									AVTA, Australia Vietnamese Tennis
									Association, sân chơi tennis phong trào lớn
									mạnh nhất ở Melbourne/Australia
								</p>
							</div>
						</div>
					</div>
				</div>
				<div
					className='top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px'
					style={{ transform: 'translateZ(0)' }}
				>
					<svg
						className='absolute bottom-0 overflow-hidden'
						xmlns='http://www.w3.org/2000/svg'
						preserveAspectRatio='none'
						version='1.1'
						viewBox='0 0 2560 100'
						x='0'
						y='0'
					>
						<polygon
							className=' text-white fill-current'
							points='2560 0 2560 100 0 100'
						></polygon>
					</svg>
				</div>
			</div>

			<section className='pb-48 -mt-24'>
				<div className='container mx-auto px-4'>
					<div className='flex flex-wrap'>
						<div className='lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center'>
							<div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg'>
								<div className='px-4 py-5 flex-auto'>
									<div className='text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400'>
										<i className='fas fa-seedling'></i>
									</div>
									<h6 className='text-xl font-semibold'>
										Phát triển
									</h6>
									<p className='mt-2 mb-4 text-gray-500'>
										Phát triển và đẩy mạnh phong trào tennis
										trong cộng đồng
									</p>
								</div>
							</div>
						</div>

						<div className='w-full md:w-4/12 px-4 text-center'>
							<div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg'>
								<div className='px-4 py-5 flex-auto'>
									<div className='text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400'>
										<i className='fas fa-tasks'></i>
									</div>
									<h6 className='text-xl font-semibold'>
										Chuyên nghiệp
									</h6>
									<p className='mt-2 mb-4 text-gray-500'>
										Tạo cơ sân chơi lớn và chuyên nghiệp cho
										các thành viên cọ sát
									</p>
								</div>
							</div>
						</div>

						<div className='pt-6 w-full md:w-4/12 px-4 text-center'>
							<div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg'>
								<div className='px-4 py-5 flex-auto'>
									<div className='text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400'>
										<i className='fas fa-users'></i>
									</div>
									<h6 className='text-xl font-semibold'>
										Kết nối
									</h6>
									<p className='mt-2 mb-4 text-gray-500'>
										Kết nối đam mê tennis và mở rộng quan hệ
										xã hội
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* upcomingCompetition */}
					{upcomingCompetition && (
						<CompetitionPreview {...upcomingCompetition} />
					)}
				</div>
			</section>
		</>
	);
}

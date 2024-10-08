import Link from 'next/link';

export default function Intro2({ children, bgImg, title, subtitle }) {
	const img =
		bgImg ||
		'/assets/img/backgroundsplash.jpeg';

	return (
		<>
			<div className='relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-25 '>
				<div
					className='absolute top-0 w-full h-full bg-center bg-cover'
					style={{
						backgroundImage: "url('" + img + "')",
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
									{title}
								</h1>
								{subtitle ? (
									<p className='mt-4 text-lg text-gray-200'>
										{subtitle}
									</p>
								) : null}
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
				<div>{children}</div>
			</section>
		</>
	);
}

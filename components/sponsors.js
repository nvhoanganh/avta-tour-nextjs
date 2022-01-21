import ContentfulImage from './contentful-image';
import Link from 'next/link';

export default function Sponsors({ sponsors }) {
	return (
		<div className='container mx-auto px-4'>
			<div className='flex flex-wrap justify-center text-center mb-24'>
				<div className='w-full lg:w-6/12 px-4'>
					<h2 className='text-4xl font-semibold'>
						Proundly Sponsored by
					</h2>
				</div>
			</div>
			<div className='flex flex-wrap justify-center'>
				<div className='grid grid-cols-2 md:grid-cols-5 md:gap-x-10 lg:gap-x-16 gap-y-20 mb-32'>
					{sponsors.slice(0, 10).map((x) => (
						<div key={x.name} className='px-6 text-center'>
							<Link href={x.website}>
								<a className='mx-auto max-w-120-px' target='_blank'>
									<ContentfulImage
										width={120}
										height={120}
										className='rounded-full mx-auto max-w-120-px'
										src={x.logo.url}
									/>
								</a>
							</Link>

							<div className='pt-6 text-center'>
								<h5 className='text-xl font-bold'>
									<Link href={x.website}>
										<a className='hover:underline' target='_blank'>
											{x.name}
										</a>
									</Link>
								</h5>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className='flex flex-wrap justify-center'>
				<Link
					href={`mailto:tonytuan.phan@gmail.com`}
				>
					<a className='get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'>
						Contact Tony for Advertising opportunities
					</a>
				</Link>
			</div>
		</div>
	);
}

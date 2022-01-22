import ContentfulImage from './contentful-image';
import Link from 'next/link';

export default function Top10Players({ allPlayers }) {
	return (
		<div className='container mx-auto px-4'>
			<div className='flex flex-wrap justify-center text-center mb-24'>
				<div className='w-full lg:w-6/12 px-4'>
					<h2 className='text-4xl font-semibold'>
						Top Players
					</h2>
				</div>
			</div>
			<div className='flex flex-wrap justify-center'>
				<div className='grid grid-cols-2 md:grid-cols-5 md:gap-x-10 lg:gap-x-16 gap-y-20 mb-32'>
					{allPlayers.slice(0, 10).map((x) => (
						<div key={x.sys.id} className='px-6 text-center'>
							<Link href={`/players/${x.sys.id}`}>
								<div className='mx-auto max-w-120-px'>
									<ContentfulImage
										width={120}
										height={120}
										className='rounded-full mx-auto max-w-120-px'
										src={x.photoURL || x.coverImage?.url || 'https://via.placeholder.com/120'}
									/>
								</div>
							</Link>

							<div className='pt-6 text-center'>
								<h5 className='text-xl font-bold'>
									<Link href={`/players/${x.sys.id}`}>
										<a className='hover:underline'>
											{x.fullName}
										</a>
									</Link>
								</h5>
								<p className='mt-1 text-blue-900 text-sm'>
									({x.nickName})
								</p>
								<p className='mt-1 text-xl text-blue-900 uppercase font-semibold'>
									{x.avtaPoint}
								</p>
								<p className='mt-1 text-sm text-gray-400 uppercase font-semibold'>
									{x.homeClub || 'Unknown Club'}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className='flex flex-wrap justify-center'>
				<Link
					href={`/players`}
				>
					<a className='get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'>
						See All Players
					</a>
				</Link>
			</div>
		</div>
	);
}

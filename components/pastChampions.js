import PlayerWithIcon from './PlayerWithIcon';
import ContentfulImage from './contentful-image';
import Link from 'next/link';

export default function pastChampions({ champions }) {
	return (
		<div className='container mx-auto px-4'>
			<div className='flex flex-wrap justify-center text-center mb-24'>
				<div className='w-full lg:w-6/12 px-4'>
					<h2 className='text-4xl font-semibold'>
						Out Past Champions
					</h2>
				</div>
			</div>
			<div className='flex flex-wrap justify-center'>
				<div className='grid grid-cols-2 md:grid-cols-5 md:gap-x-10 lg:gap-x-16 gap-y-20 mb-32'>
					{champions.map((player) => (
						<div key={player.sys.id}>
							<PlayerWithIcon player={player} size="lg" />
							<div className="flex justify-center pt-2 space-x-1" >
								{
									player.won.map(tour =>
									(<Link href={`/competitions/${tour.slug}`}>
										<a className='rounded-full shadow-xl text-green-900 bg-gray-100 h-auto align-middle border border-gray-300 text-sm p-2 text-center hover:bg-gray-200' title={tour.title}>
											<i className='fas fa-trophy text-lg text-yellow-400'></i>
											{
												tour.maxPoint
											}
										</a>
									</Link>))
								}
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
		</div >
	);
}

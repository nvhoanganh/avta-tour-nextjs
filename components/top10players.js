import PlayerWithIcon from './PlayerWithIcon';
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
					{allPlayers.slice(0, 10).map((player) => (
						<PlayerWithIcon key={player.id} player={player} size="lg"/>
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

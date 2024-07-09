import ContentfulImage from './contentful-image';
import PlayerWithIcon from './PlayerWithIcon';
import Link from 'next/link';

export default function Sponsors({ sponsors, playerSponsors }) {
	return (
		<div className='container mx-auto px-4'>
			<div className='flex flex-wrap justify-center text-center mb-24'>
				<div className='w-full lg:w-6/12 px-4'>
					<h2 className='text-4xl font-semibold'>
						Major Sponsors
					</h2>
				</div>
			</div>
			<div className='flex flex-wrap justify-center'>
				<div className='grid grid-cols-2 md:grid-cols-5 md:gap-x-10 lg:gap-x-16 gap-y-20 mb-32'>
					{sponsors.map((x) => (
						<div key={x.name} className='px-6 text-center'>
							<Link href={x.website} target='_blank'>
								<img src={x.logo.url} className='w-48 hover:cursor-pointer' />
							</Link>

							<div className='pt-3 text-center'>
								<h5 className='text-sm text-gray-400'>
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
			{/* <div className='flex flex-wrap justify-center text-center mb-24'>
				<div className='w-full lg:w-6/12 px-4'>
					<h2 className='text-4xl font-semibold'>
						Individual Sponsors
					</h2>
				</div>
			</div>
			<div className='flex flex-wrap justify-center'>
				<div className='grid grid-cols-2 md:grid-cols-5 md:gap-x-10 lg:gap-x-16 gap-y-20 mb-32'>
					{playerSponsors.map((player) => (
						<div key={player.sys.id}>
							<PlayerWithIcon player={player} size="lg" hideNickname hidePoint />
							<div className="flex justify-center pt-2 space-x-1" >
								{
									player.competitionsSponsored.map(comp =>
									(<a key={comp} className='rounded-full shadow-xl text-green-900 bg-yellow-400 align-middle border border-gray-300 text-xs px-1 text-center hover:bg-gray-200' title={comp}>
										{comp}
									</a>))
								}
							</div>
						</div>
					))}
				</div>
			</div> */}
			<div className='flex flex-wrap justify-center'>
				<Link
					href={`mailto:enquiry@avtatour.com`}
				>
					<a className='get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'>
						Contact for Advertising opportunities
					</a>
				</Link>
			</div>
		</div>
	);
}

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';
import DropDown from '../dropdown';
import { getPlayers } from '../../lib/browserapi';

export default function PlayersCard({ allPlayers }) {
	const [sortBy, setSortBy] = useState('Point');
	const [filter, setFilter] = useState(null);

	return (
		<>
			<div className='sticky py-3 rounded-lg shadow-lg opacity-95 bg-gray-300 flex space-x-1 justify-center items-center'>
				<input type="text" className="border px-3 py-2 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-60 ease-linear transition-all duration-150" placeholder="Search Name, Club or Point"
					value={filter} onChange={(e) => { setFilter(e.target.value) }}
				/>
				<DropDown buttonText={
					<span><i class="fas fa-sort-amount-down-alt mr-1"></i>{sortBy}</span>
				}
					items={[
						<a onClick={() => setSortBy('Point')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Sort by Point</a>,

						<a onClick={() => setSortBy('Name')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Sort by Name</a>,

						<a onClick={() => setSortBy('Club')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Sort by Club</a>,
					]}
				>
				</DropDown>
			</div>

			<section className='pt-32 pb-48'>
				<div className='container mx-auto px-4'>
					<div className='flex flex-wrap justify-center'>
						<div className='grid grid-cols-2 md:grid-cols-5 md:gap-x-10 lg:gap-x-16 gap-y-20 mb-32'>
							{getPlayers(allPlayers, sortBy, filter).map(x => <div key={x.nickName} className='px-6 text-center'>
								<Link href={`/players/${x.sys.id}`}>
									<div className='mx-auto max-w-120-px cursor-pointer'>
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
									{x.fullName !== x.nickName &&
										<p className='mt-1 text-blue-900 text-sm'>
											({x.nickName})
										</p>
									}
									<p
										className={cn('mt-1 text-xl  uppercase font-semibold', {
											'text-green-600': !x.unofficialPoint,
											'text-red-600': x.unofficialPoint,
										})}
									>
										{x.avtaPoint} {x.unofficialPoint ? '[Unoffical]' : ''}
									</p>
									<p className='mt-1 text-sm text-gray-400 uppercase font-semibold'>
										{x.homeClub || 'Unknown Club'}
									</p>
								</div>
							</div>)}
						</div>
					</div>
				</div>
			</section>
		</>);
}
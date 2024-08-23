import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import FirebaseImage from '../fb-image';
import DropDown from '../dropdown';
import PlayerTypeFilter from '../../components/Cards/PlayerTypeFilter';
import useFilterPlayers from '../../lib/useFilterhook';
import { getPlayers, getSortLabel } from '../../lib/browserapi';


export default function PlayersCard({ allPlayers, hideSearch, user, refreshData }) {
	const {
		sortBy, setSortBy, filter, setFilter,
		avgPoint, filteredPlayers, filerPlayerStyle, setFilerPlayerStyle
	} = useFilterPlayers(allPlayers);

	useEffect(async () => {
		const query = new URLSearchParams(window.location.search);
		if (query.get('q')) {
			setFilter(query.get('q'));
		}
	}, []);

	return (
		<>
			{
				!hideSearch
				&& <div className='sticky py-3 rounded-lg shadow-lg opacity-95 bg-gray-300 flex flex-col space-y-1 justify-center items-center'>
					<div className='flex space-x-1 justify-center items-center'>
						<input type="text" className="border px-3 py-2 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-60 ease-linear transition-all duration-150" placeholder="Search Name, Club or Point"
							value={filter} onChange={(e) => { setFilter(e.target.value) }}
						/>

						<DropDown buttonText={
							<span><i className="fas fa-sort-amount-down-alt mr-1"></i>{getSortLabel(sortBy)}</span>
						}
							items={[
								<a onClick={() => setSortBy('Point')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">By Point</a>,

								<a onClick={() => setSortBy('Name')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">By Name</a>,

								<a onClick={() => setSortBy('Club')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">By Club</a>,
								<a onClick={() => setSortBy('compsPlayed')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">By # Comp Played</a>,
								<a onClick={() => setSortBy('monthsSinceLastComp')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">By Months since Last Comp</a>,
							]}
						>
						</DropDown>
					</div>
					<div className="italic text-gray-500 text-xs">Found {filteredPlayers.length} Players, Avg Point: {avgPoint}
						{
							user &&
							<a className='underline ml-2 hover:cursor-pointer' onClick={refreshData}>
								Refresh data
							</a>
						}
					</div>
					<PlayerTypeFilter selected={filerPlayerStyle} setState={(val) => setFilerPlayerStyle(val)}></PlayerTypeFilter>
					<div>
						<Link href={`/players/map`}>
							<a className='hover:underline'>
								<i className="fas fa-map-marked-alt text-blue-700"></i>
								{' '}Map View
							</a>
						</Link>
					</div>
				</div>

			}


			<section className='pt-10 pb-48'>
				<div className='container mx-auto px-4'>
					<div className='flex flex-wrap justify-center'>

						<div className='grid grid-cols-2 md:grid-cols-5 md:gap-x-10 lg:gap-x-16 gap-y-20 mb-32'>
							{getPlayers(allPlayers, sortBy, filter, null, filerPlayerStyle).map(x => <div key={x.sys.id} className='px-6 text-center'>
								<Link href={`/players/${x.sys.id}`}>
									<div className='mx-auto max-w-120-px cursor-pointer'>
										{
											x.photoURL || x.coverImage?.url
												? <FirebaseImage
													width={120}
													height={120}
													className='rounded-full mx-auto max-w-120-px'
													src={x.photoURL || x.coverImage?.url}
												/>
												: <span className="inline-flex items-center justify-center h-28 w-28 rounded-full bg-gray-400">
													<span className="text-xl font-medium leading-none text-white">{x.fullName.split(" ").map((n) => n[0]).join("")}</span>
												</span>
										}
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
											'text-red-600': x.unofficialPoint || x?.notInContentful,
											'text-blue-600': x.hasLadderPoint,
										})}
									>
										{!x?.avtaPoint ? 'N/A' : x?.avtaPoint}
									</p>

									{
										x?.compsPlayed
											? <div>
												<Link
													className="underline"
													href={`/competitions/${x?.lastComp?.slug}`}
												>
													<a title={x?.lastComp?.slug} className="text-blue-700 hover:underline hover:cursor-pointer"><span
														className='mt-1 text-sm text-blue-600'
													>
														{!x?.compsPlayed ? '-' : x?.compsPlayed} <i className='fas fa-trophy text-gray-400'></i>
													</span>
														,
														<span
															className='mt-1 text-sm text-blue-600 ml-1'
														>
															{!x?.monthsSinceLastComp ? '-' : x?.monthsSinceLastComp} month ago
														</span>


													</a>
												</Link>

											</div>
											: null
									}

									{
										x.canMarkScore
											? <p className='text-blue-500 text-sm'><i className="fas fa-user-edit text-blue-600  hover:text-blue-700"></i> Score Official</p>
											: null
									}
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
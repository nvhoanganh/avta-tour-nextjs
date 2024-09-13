import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import FirebaseImage from '../fb-image';
import useFilterPlayers from '../../lib/useFilterhook';
import PlayerProfileStatus from '../../components/playerprofilestatus';
import PlayerTypeFilter from '../../components/Cards/PlayerTypeFilter';
import { getPlayerInitial } from '../../lib/browserapi';
import { getPlayers } from '../../lib/browserapi';
import { format } from 'date-fns';

export default function PlayersTable({ color, players, user, refreshData }) {
	console.log("🚀 ~ PlayersTable ~ players:", players)
	const [showAdvanced, setShowAdvanced] = useState(false);

	const {
		sortBy, setSortBy, filter, setFilter,
		avgPoint, filteredPlayers, filerPlayerStyle, setFilerPlayerStyle
	} = useFilterPlayers(players);

	useEffect(async () => {
		const query = new URLSearchParams(window.location.search);
		if (query.get('q')) {
			setFilter(query.get('q'));
		}
	}, []);

	return (
		<>
			<div
				className={
					'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg ' +
					(color === 'light'
						? 'bg-white'
						: 'bg-lightBlue-900 text-white')
				}
			>
				<div className='block w-full overflow-x-auto'>

					{/* Projects table */}
					<table className='items-center w-full bg-transparent border-collapse'>
						<thead>
							<tr>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
								>
									{/* Name (Nickname)
									{sortBy === 'Name' && <i className="fas fa-sort text-blue-600 ml-1"></i>} */}
									<div className='text-left'>
										<div className="italic text-gray-500 text-xs font-normal">Found {filteredPlayers.length} Players, Avg Point: {avgPoint}
											{
												user &&
												<a className='underline ml-2 hover:cursor-pointer' onClick={refreshData}>
													Refresh data
												</a>
											}
										</div>
										<input type="text" className="border px-3 py-2 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-56 ease-linear transition-all duration-150 mb-2"
											placeholder="Search Name, Club or Point"
											value={filter} onChange={(e) => { setFilter(e.target.value) }}
										/>
										<a onClick={() => setShowAdvanced(!showAdvanced)} className='text-sm italic pl-1 underline cursor-pointer font-normal'><i className="fas fa-angle-double-down"></i></a>
										{
											showAdvanced
											&& <div className="font-normal flex justify-start items-center">
												<PlayerTypeFilter selected={filerPlayerStyle} setState={(val) => setFilerPlayerStyle(val)}></PlayerTypeFilter>
											</div>
										}
									</div>
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center hover:underline hover:cursor-pointer ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
									onClick={() => setSortBy('compsPlayed')}
								>
									Played
									{sortBy === 'compsPlayed' && <i className="fas fa-sort text-blue-600 ml-1"></i>}
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center hover:underline hover:cursor-pointer ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
									onClick={() => setSortBy('monthsSinceLastComp')}
								>
									Last Comp
									{sortBy === 'monthsSinceLastComp' && <i className="fas fa-sort text-blue-600 ml-1"></i>}
									<div className="text-xs font-normal">(Months ago)</div>
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center hover:underline hover:cursor-pointer ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
									onClick={() => setSortBy('Point')}
								>
									Point
									{sortBy === 'Point' && <i className="fas fa-sort text-blue-600 ml-1"></i>}
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left  truncate max-w-[180px]' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
									onClick={() => setSortBy('Club')}
								>
									<span className="hover:underline hover:cursor-pointer ">Club</span>
									
									{sortBy === 'Club' && <i className="fas fa-sort text-blue-600 ml-1"></i>}
									<div className="float-right">
										<Link href={`/players/map`}>
											<a className='hover:underline'>
												<i className="fas fa-map-marked-alt text-blue-700"></i>
												{' '} Map
											</a>
										</Link>
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{getPlayers(players, sortBy, filter, null, filerPlayerStyle).map((player) => (
								<tr key={player?.sys?.id}>
									<td className='border-t-0 px-6 align-middle border-l-0 whitespace-nowrap p-4 text-left flex items-center truncate max-w-[400px]'>
										<div
											className='h-12 w-12 bg-white rounded-full border min-w-12 min-h-12'
											alt='...'
										>
											<Link
												href={`/players/${player?.sys?.id}`}
											>
												{
													player.photoURL || player.coverImage?.url
														? <FirebaseImage width={120} height={120} className='hover:cursor-pointer rounded-full mx-auto max-w-120-px' src={player.photoURL || player.coverImage?.url} />
														: <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-400">
															<span className="text-xl font-medium leading-none text-white">{getPlayerInitial(player)}</span>
														</span>
												}
											</Link>
										</div>
										<div className='flex flex-col'>
											<div
												className={
													'ml-3 truncate max-w-[270px]' + (color === 'light'
														? ' text-blueGray-600'
														: ' text-white')
												}
											>
												<Link
													href={`/players/${player?.sys?.id}`}
												>
													{player.fullName !== player.nickName ?
														<a className="hover:underline hover:cursor-pointer">{player.fullName} ({player.nickName})</a>
														:
														<a className="hover:underline hover:cursor-pointer">{player.fullName}</a>
													}
												</Link>
												<PlayerProfileStatus player={player}></PlayerProfileStatus>
												{
													player.canMarkScore
														? <p className='text-blue-500 text-sm font-normal'><i className="fas fa-user-edit text-blue-600  hover:text-blue-700"></i> Score Official</p>
														: null
												}
											</div>
											<div className='ml-3 text-sm text-gray-600'>
												{player.club}
											</div>
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-center'>
										{player?.compsPlayed || ''}
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-center'>
									
										{
											player?.lastComp?.slug
												? <Link
													className='underline'
													href={`/competitions/${player?.lastComp?.slug}`}
												>
													<a title={player?.lastComp?.slug}
														className={cn('hover:cursor-pointer p-1 px-2 hover:bg-gray-500 hover:text-white rounded-lg shadow-sm', {
															'bg-yellow-600 text-white': player?.monthsSinceLastComp < 0,
															'bg-gray-200 text-blue': player?.monthsSinceLastComp > 0,
														})}
														>{player?.monthsSinceLastComp < 0 ? `${player?.lastComp?.maxPoint}` : player?.monthsSinceLastComp} </a>
												</Link>
												: null
										}
									</td>
									<td
										className={cn('border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-center', {
											'text-green-600': !player?.unofficialPoint,
											'text-red-600': player?.unofficialPoint || player?.notInContentful,
										})}
									>
										{!player?.avtaPoint ? 'N/A' : player?.avtaPoint}
										{/* {!player?.minPoint ? '' : <span className='text-sm text-gray-700 pl-1'>(min.{player?.minPoint})</span>} */}
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4  truncate max-w-[180px]'>
										{player?.homeClub || 'Unknown Club'}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}

PlayersTable.defaultProps = {
	color: 'light',
	players: [],
};

PlayersTable.propTypes = {
	color: PropTypes.oneOf(['light', 'dark']),
};

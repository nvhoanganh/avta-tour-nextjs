import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import FirebaseImage from '../fb-image';
import useFilterPlayers from '../../lib/useFilterhook';
import PlayerProfileStatus from '../../components/playerprofilestatus';
import PlayerTypeFilter from '../../components/Cards/PlayerTypeFilter';
import { getPlayerInitial } from '../../lib/browserapi';

export default function PlayersTable({ color, players, user, refreshData }) {
	const {
		sortBy, setSortBy, filter, setFilter,
		avgPoint, filteredPlayers, filerPlayerStyle, setFilerPlayerStyle
	} = useFilterPlayers(players);

	const [showAdvanced, setShowAdvanced] = useState(false);

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
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left hover:cursor-pointer hover:underline ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
									onClick={() => setSortBy('Name')}
								>
									Name (Nickname)
									{sortBy === 'Name' && <i className="fas fa-sort text-blue-600 ml-1"></i>}
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left hover:underline hover:cursor-pointer ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
									onClick={() => setSortBy('Point')}
								>
									AVTA Point
									{sortBy === 'Point' && <i className="fas fa-sort text-blue-600 ml-1"></i>}
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left hover:underline hover:cursor-pointer ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
									onClick={() => setSortBy('Club')}
								>
									Club
									{sortBy === 'Club' && <i className="fas fa-sort text-blue-600 ml-1"></i>}
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3  border-l-0 border-r-0 whitespace-nowrap text-left ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
								>
									<div className='text-right'>
										<div className="italic text-gray-500 text-xs font-normal">Found {filteredPlayers.length} Players, Avg Point: {avgPoint}
											{
												user &&
												<a className='underline ml-2 hover:cursor-pointer' onClick={refreshData}>
													Refresh data
												</a>
											}
										</div>
										<Link href={`/players/map`}>
											<a className='hover:underline'>
												<i className="fas fa-map-marked-alt text-blue-700"></i>
												{' '} Map View
											</a>
										</Link>
										{' '}|{' '}
										Search
										<input type="text" className="ml-2 border px-3 py-2 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-56 ease-linear transition-all duration-150 mb-2"
											placeholder="Search Name, Club or Point"
											value={filter} onChange={(e) => { setFilter(e.target.value) }}
										/>
										<a onClick={() => setShowAdvanced(!showAdvanced)} className='text-sm italic pl-1 underline cursor-pointer font-normal'><i className="fas fa-angle-double-down"></i></a>
										{
											showAdvanced
											&& <div className="font-normal flex justify-end items-center">
												<PlayerTypeFilter selected={filerPlayerStyle} setState={(val) => setFilerPlayerStyle(val)}></PlayerTypeFilter>
											</div>
										}
									</div>

								</th>
							</tr>
						</thead>
						<tbody>
							{filteredPlayers.map((player) => (
								<tr key={player?.sys?.id}>
									<th className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										<div
											className='h-12 w-12 bg-white rounded-full border'
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
													'ml-3 font-bold ' +
													+(color === 'light'
														? 'text-blueGray-600'
														: 'text-white')
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
											</div>
											<div className='ml-3 text-sm text-gray-600'>
												{player.club}
											</div>
										</div>
									</th>
									<td
										className={cn('border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4', {
											'text-green-600': !player?.unofficialPoint,
											'text-red-600': player?.unofficialPoint || player?.notInContentful,
										})}
									>
										{player?.notInContentful ? 'N/A' : player?.avtaPoint}
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										{player?.homeClub || 'Unknown Club'}
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-right'>
										<Link
											href={`/players/${player?.sys?.id}`}
										>
											<a className='get-started text-white font-bold px-6 py-2 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'>
												View
											</a>
										</Link>
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

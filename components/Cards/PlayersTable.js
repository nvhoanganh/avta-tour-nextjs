import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';
import { getPlayers } from '../../lib/browserapi';

export default function PlayersTable({ color, players }) {
	const [sortBy, setSortBy] = useState('Point');
	const [filter, setFilter] = useState(null);

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
									{sortBy === 'Name' && <i class="fas fa-sort text-blue-600 ml-1"></i>}
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
									{sortBy === 'Point' && <i class="fas fa-sort text-blue-600 ml-1"></i>}
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
									{sortBy === 'Club' && <i class="fas fa-sort text-blue-600 ml-1"></i>}
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
										Search
										<input type="text" className="ml-2 border px-3 py-2 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-56 ease-linear transition-all duration-150"
											placeholder="Search Name, Club or Point"
											value={filter} onChange={(e) => { setFilter(e.target.value) }}
										/>
									</div>

								</th>
							</tr>
						</thead>
						<tbody>
							{getPlayers(players, sortBy, filter).map((player) => (
								<tr key={player.nickName}>
									<th className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										<div
											className='h-12 w-12 bg-white rounded-full border'
											alt='...'
										>
											<Link
												href={`/players/${player.sys.id}`}
											>
												<ContentfulImage width={120} height={120} className='hover:cursor-pointer rounded-full mx-auto max-w-120-px' src={player.photoURL || player.coverImage?.url || 'https://via.placeholder.com/120'} />
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
													href={`/players/${player.sys.id}`}
												>
													{player.fullName !== player.nickName ?
														<a className="hover:underline hover:cursor-pointer">{player.fullName} ({player.nickName})</a>
														:
														<a className="hover:underline hover:cursor-pointer">{player.fullName}</a>
													}
												</Link>
											</div>
											<div className='ml-3 text-sm text-gray-600'>
												{player.club}
											</div>
										</div>
									</th>
									<td
										className={cn('border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4', {
											'text-green-600': !player.unofficialPoint,
											'text-red-600': player.unofficialPoint,
										})}
									>
										{player.avtaPoint} pt. {player.unofficialPoint ? '[Unofficial]' : ''}
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										{player.homeClub || 'Unknown Club'}
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-right'>
										<Link
											href={`/players/${player.sys.id}`}
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

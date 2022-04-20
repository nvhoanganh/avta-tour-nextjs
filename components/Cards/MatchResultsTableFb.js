import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';
import DateWithTimeComponent from '../dateWithTime';
import PlayerPoint from '../PlayerPoint';
import Avatar from '../avatar';

export default function MatchResultsTable({ color, results, is_superuser, deleteMatch }) {
	return (
		<>
			<div
				className={
					'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg ' +
					(color === 'light'
						? 'bg-white'
						: 'bg-blue-900 text-white')
				}
			>
				<div className='block w-full overflow-x-auto'>
					{/* Projects table */}
					<table className='items-center w-full bg-transparent border-collapse'>
						<thead>
							<tr>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-gray-50 text-gray-500 border-gray-100'
											: 'bg-blue-800 text-blue-300 border-blue-700')
									}
								>
									Winning Team
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold' +
										(color === 'light'
											? 'bg-gray-50 text-gray-500 border-gray-100'
											: 'bg-blue-800 text-blue-300 border-blue-700')
									}
								>
									Score
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-gray-50 text-gray-500 border-gray-100'
											: 'bg-blue-800 text-blue-300 border-blue-700')
									}
								>
									Losing Team
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-gray-50 text-gray-500 border-gray-100'
											: 'bg-blue-800 text-blue-300 border-blue-700')
									}
								>
									Time
								</th>
							</tr>
						</thead>
						<tbody>
							{results.map((result) => {
								const w1 = result.winners.player1 || result.winners.players[0];
								const w2 = result.winners.player2 || result.winners.players[1];

								const l1 = result.losers.player1 || result.losers.players[0];
								const l2 = result.losers.player2 || result.losers.players[1];

								return <tr key={result.timestamp}>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										<div className='flex'>
											<img
												src={w1?.coverImage?.url || 'https://via.placeholder.com/64'}
												alt='...'
												className='w-10 h-10 rounded-full border-2 border-gray-50 shadow'
											></img>
											<img
												src={w2?.coverImage?.url || 'https://via.placeholder.com/64'}
												alt='...'
												className='w-10 h-10 rounded-full border-2 border-gray-50 shadow -ml-2'
											></img>
										</div>

										<div className='flex flex-col'>
											<div
												className={
													'ml-3 font-bold flex space-x-2' +
													+(color === 'light'
														? 'text-gray-600'
														: 'text-white')
												}
											>

												<Link href={`/players/${w1?.sys?.id}`}>
													<a className="hover:underline">{w1?.fullName}</a>
												</Link>


												<PlayerPoint player={w1} className="ml-1 mb-2" />

												<span className="mx-3">&amp;</span>

												<Link href={`/players/${w2?.sys?.id}`}>
													<a className="hover:underline">{w2?.fullName}</a>
												</Link>

												<PlayerPoint player={w2} className="ml-1 mb-2" />

												<span className='font-normal text-xs mb-2 ml-1 text-green-600'>[{w1?.avtaPoint + w2?.avtaPoint}]</span>


											</div>
											<div className='ml-3 text-sm text-gray-600 mr-3'>
												{w1?.homeClub}
											</div>
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										<div className="flex flex-col items-center justify-center">
											<div className='italic text-gray-600 text-sm'>def.</div>
											<div>6-{result.gameWonByLoser}</div>
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										<div className='flex'>
											<img
												src={l1?.coverImage?.url || 'https://via.placeholder.com/64'}
												alt='...'
												className='w-10 h-10 rounded-full border-2 border-gray-50 shadow'
											></img>
											<img
												src={l2?.coverImage?.url || 'https://via.placeholder.com/64'}
												alt='...'
												className='w-10 h-10 rounded-full border-2 border-gray-50 shadow -ml-2'
											></img>
										</div>
										<div className='flex flex-col'>
											<div
												className={
													'ml-3 font-bold flex space-x-2' +
													+(color === 'light'
														? 'text-gray-600'
														: 'text-white')
												}
											>

												<Link href={`/players/${l1?.sys?.id}`}>
													<a className="hover:underline">{l1?.fullName}</a>
												</Link>


												<PlayerPoint player={l1} className="ml-1 mb-2" />

												<span className="mx-3">&amp;</span>

												<Link href={`/players/${l2?.sys?.id}`}>
													<a className="hover:underline">{l2?.fullName}</a>
												</Link>

												<PlayerPoint player={l2} className="ml-1 mb-2" />
												<span className='font-normal text-xs mb-2 ml-1 text-green-600'>[{l1?.avtaPoint + l2?.avtaPoint}]</span>
											</div>
											<div className='ml-3 text-sm text-gray-600 mr-3'>
												{l1?.homeClub}
											</div>
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										<DateWithTimeComponent dateString={result.timestamp} />
										{is_superuser &&
											<span onClick={() => deleteMatch && deleteMatch(result)}
												className="ml-3 text-red-500 cursor-pointer p-3 rounded border hover:bg-gray-200">
												Delete
											</span>
										}
										<div className=' text-gray-600 mr-3'>
											{result.stage === 'Group Stage' ? 'Group ' + result.group + ' Round Robin' : result.knockoutRound}
										</div>
									</td>
								</tr>
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}

MatchResultsTable.defaultProps = {
	color: 'light',
	results: [],
};

MatchResultsTable.propTypes = {
	color: PropTypes.oneOf(['light', 'dark']),
};

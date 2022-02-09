import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';
import DateWithTimeComponent from '../dateWithTime';
import Avatar from '../avatar';

export default function TeamRankingTable({ groups, color }) {

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
					{Object.keys(groups).sort().map((group, index) => (
						<>
							<div className='uppercase font-bold text-gray-500 py-3 px-3'>Group {group}:</div>
							<table className='items-center w-full bg-transparent border-collapse'>
								<thead>
									<tr>
										<th
											className={
												'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold' +
												(color === 'light'
													? 'bg-gray-50 text-gray-500 border-gray-100'
													: 'bg-blue-800 text-blue-300 border-blue-700')
											}
										>
											#
										</th>
										<th
											className={
												'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
												(color === 'light'
													? 'bg-gray-50 text-gray-500 border-gray-100'
													: 'bg-blue-800 text-blue-300 border-blue-700')
											}
										>
											Team
										</th>
										<th
											className={
												'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center ' +
												(color === 'light'
													? 'bg-gray-50 text-gray-500 border-gray-100'
													: 'bg-blue-800 text-blue-300 border-blue-700')
											}
										>
											Set Won / Lost
										</th>
										<th
											className={
												'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center ' +
												(color === 'light'
													? 'bg-gray-50 text-gray-500 border-gray-100'
													: 'bg-blue-800 text-blue-300 border-blue-700')
											}
										>
											Game Difference
										</th>
									</tr>
								</thead>
								<tbody>
									{groups[group].map((team, index) => (
										<tr key={team.name}>
											<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
												<div className="flex flex-col items-center justify-center">
													{index + 1}
												</div>
											</td>
											<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
												<div className='flex'>
													<img
														src={team.players[0].coverImage?.url || 'https://via.placeholder.com/64'}
														alt='...'
														className='w-10 h-10 rounded-full border-2 border-gray-50 shadow'
													></img>
													<img
														src={team.players[1].coverImage?.url || 'https://via.placeholder.com/64'}
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

														<Link href={`/players/${team.players[0].sys?.id}`}>
															<a className="hover:underline">{team.players[0].fullName}</a>
														</Link>


														<span className='font-normal text-xs mb-2 ml-1 text-green-600'>{team.players[0].avtaPoint}</span>

														<span className="mx-3">&amp;</span>

														<Link href={`/players/${team.players[1].sys?.id}`}>
															<a className="hover:underline">{team.players[1].fullName}</a>
														</Link>

														<span className='font-normal text-xs mb-2 ml-1 text-green-600'>{team.players[1].avtaPoint}</span>
													</div>
													<div className='ml-3 text-sm text-gray-600'>
														{team.players[0].homeClub} - {team.players[0].avtaPoint + team.players[1].avtaPoint} pt.
													</div>
												</div>
											</td>
											<td className='border-t-0 px-6 align-middle text-center border-l-0 border-r-0 whitespace-nowrap p-4'>
												<span className='text-green-600'>{team.win}</span>
												&nbsp;/&nbsp;<span className='text-red-600'>{team.lost}</span>
											</td>
											<td className='border-t-0 px-6 align-middle text-center border-l-0 border-r-0 whitespace-nowrap p-4'>
												<span
													className={cn({
														'text-gray-600': Number(team.diff) === 0,
														'text-green-600': Number(team.diff) > 0,
														'text-red-600': Number(team.diff) < 0,
													})}
												>{Number(team.diff) > 0 ? "+" : ""}{team.diff}</span>

											</td>
										</tr>
									))}
								</tbody>
							</table>
						</>
					))}

				</div>
			</div>
		</>
	);
}

TeamRankingTable.defaultProps = {
	color: 'light',
	groups: [],
};

TeamRankingTable.propTypes = {
	color: PropTypes.oneOf(['light', 'dark']),
};

import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';
import DateWithTimeComponent from '../dateWithTime';
import Avatar from '../avatar';

export default function TeamRankingTable({ groups, color }) {
	const sortTeams = (teams) => {
		return teams.sort((a, b) => {
			if (Number(a.SetWon) === Number(b.SetWon)) {
				return Number(b.Difference) - Number(a.Difference);
			}
			return Number(b.SetWon) > Number(a.SetWon) ? 1 : -1;
		})
	};

	const getRows = (groups) => {
		const rows = Object.keys(groups || {}).reduce((pre, group) => {
			const list = sortTeams(groups[group]).map((x, index) => ({ ...x, rank: index + 1 }));
			return pre.concat(list);
		}, []);
		return rows;
	};

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
									Group
								</th>
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
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-gray-50 text-gray-500 border-gray-100'
											: 'bg-blue-800 text-blue-300 border-blue-700')
									}
								>
									Set Won / Lost
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
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
							{getRows(groups).map((row, index) => (
								<tr key={row.Team}>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										<div className="flex flex-col items-center justify-center">
											{row.Group}
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										<div className="flex flex-col items-center justify-center">
											{row.rank}
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										<div className='flex'>
											<img
												src={row.player1.coverImage?.url || 'https://via.placeholder.com/64'}
												alt='...'
												className='w-10 h-10 rounded-full border-2 border-gray-50 shadow'
											></img>
											<img
												src={row.player2.coverImage?.url || 'https://via.placeholder.com/64'}
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

												<Link href={`/players/${row.player1.nickName}`}>
													<a className="hover:underline">{row.player1.fullName}</a>
												</Link>


												<span className='font-normal text-xs mb-2 ml-1 text-green-600'>{row.player1.avtaPoint}</span>

												<span className="mx-3">&amp;</span>

												<Link href={`/players/${row.player2.nickName}`}>
													<a className="hover:underline">{row.player2.fullName}</a>
												</Link>

												<span className='font-normal text-xs mb-2 ml-1 text-green-600'>{row.player2.avtaPoint}</span>
											</div>
											<div className='ml-3 text-sm text-gray-600'>
												Team Point {row.player1.avtaPoint + row.player2.avtaPoint}
											</div>
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										<span className='text-green-600'>{row.SetWon}</span>
										&nbsp;/&nbsp;<span className='text-red-600'>{row.SetLost}</span>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										<span
											className={cn({
												'text-gray-600': Number(row.Difference) === 0,
												'text-green-600': Number(row.Difference) > 0,
												'text-red-600': Number(row.Difference) < 0,
											})}
										>{Number(row.Difference) > 0 ? "+" : ""}{row.Difference}</span>

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

TeamRankingTable.defaultProps = {
	color: 'light',
	groups: [],
};

TeamRankingTable.propTypes = {
	color: PropTypes.oneOf(['light', 'dark']),
};

import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';

export default function PlayersTable({ color, players }) {
	console.log(players);
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
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
								>
									Name (Nickname)
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
								>
									AVTA Point
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
								>
									Club
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
								></th>
							</tr>
						</thead>
						<tbody>
							{players.map((player) => (
								<tr key={player.nickName}>
									<th className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										<div
											className='h-12 w-12 bg-white rounded-full border'
											alt='...'
										>
											<Link
												href={`/players/${player.sys.id}`}
											>
												<ContentfulImage width={120} height={120} className='hover:cursor-pointer rounded-full mx-auto max-w-120-px' src={player.coverImage?.url || 'https://via.placeholder.com/120'} />
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
													<a className="hover:underline hover:cursor-pointer">{player.fullName} ({player.nickName})</a>
												</Link>
											</div>
											<div className='ml-3 text-sm text-gray-600'>
												{player.club}
											</div>
										</div>
									</th>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										{player.avtaPoint} pt.
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

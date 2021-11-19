import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';
import DateWithTimeComponent from '../dateWithTime';
import Avatar from '../avatar';

export default function MatchResultsTable({ color, results }) {
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
									&nbsp;
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
									&nbsp;
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
							{results.map((result) => (
								<tr key={result.datetime}>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										<div className='flex'>
											<img
												src={result.winners.player1.coverImage?.url || 'https://via.placeholder.com/64'}
												alt='...'
												className='w-10 h-10 rounded-full border-2 border-gray-50 shadow'
											></img>
											<img
												src={result.winners.player2.coverImage?.url || 'https://via.placeholder.com/64'}
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

												<Link href={`/players/${result.winners.player1.nickName}`}>
													<a className="hover:underline">{result.winners.player1.fullName}</a>
												</Link>


												<span className='font-normal text-xs mb-2 ml-1 text-green-600'>{result.winners.player1.avtaPoint}</span>

												<span className="mx-3">&amp;</span>

												<Link href={`/players/${result.winners.player1.nickName}`}>
													<a className="hover:underline">{result.winners.player2.fullName}</a>
												</Link>

												<span className='font-normal text-xs mb-2 ml-1 text-green-600'>{result.winners.player2.avtaPoint}</span>
											</div>
											<div className='ml-3 text-sm text-gray-600'>
												GROUP {result.winners.groupName} - Team Point {result.winners.player1.avtaPoint + result.winners.player2.avtaPoint}
											</div>
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										<div className="flex flex-col items-center justify-center">
											<div className='italic text-gray-600 text-sm'>def.</div>
											<div>6-{result.score}</div>
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										<div className='flex'>
											<img
												src={result.losers.player1.coverImage?.url || 'https://via.placeholder.com/64'}
												alt='...'
												className='w-10 h-10 rounded-full border-2 border-gray-50 shadow'
											></img>
											<img
												src={result.losers.player2.coverImage?.url || 'https://via.placeholder.com/64'}
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

												<Link href={`/players/${result.losers.player1.nickName}`}>
													<a className="hover:underline">{result.losers.player1.fullName}</a>
												</Link>


												<span className='font-normal text-xs mb-2 ml-1 text-green-600'>{result.losers.player1.avtaPoint}</span>

												<span className="mx-3">&amp;</span>

												<Link href={`/players/${result.losers.player1.nickName}`}>
													<a className="hover:underline">{result.losers.player2.fullName}</a>
												</Link>

												<span className='font-normal text-xs mb-2 ml-1 text-green-600'>{result.losers.player2.avtaPoint}</span>
											</div>
											<div className='ml-3 text-sm text-gray-600'>
												GROUP {result.losers.groupName} - Team Point {result.losers.player1.avtaPoint + result.losers.player2.avtaPoint}
											</div>
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										<DateWithTimeComponent dateString={result.datetime} />
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

MatchResultsTable.defaultProps = {
	color: 'light',
	results: [],
};

MatchResultsTable.propTypes = {
	color: PropTypes.oneOf(['light', 'dark']),
};

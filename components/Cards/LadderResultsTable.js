import PropTypes from 'prop-types';
import Link from 'next/link';
import DateWithTimeComponent from '../dateWithTime';
import PlayerPoint from '../PlayerPoint';
import PlayerAvatar from '../Cards/PlayerAvatar';

export default function MatchResultsTable({ color, results, is_superuser, deleteResult, is_owner, is_member }) {
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
							{results.map((result) => (
								<tr key={result.timestamp}>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										{/* <div className='flex'>
											<PlayerAvatar player={result.winnerUser1} />
											<PlayerAvatar player={result.winnerUser2} className='-ml-2' />
										</div> */}

										<div className='flex flex-col'>
											<div
												className={
													'font-bold flex space-x-2' +
													+(color === 'light'
														? 'text-gray-600'
														: 'text-white')
												}
											>
												<Link href={`/players/${result.winnerUser1.playerId}`}>
													<div className='mx-auto cursor-pointer hover:underline highlightable'>
														{result.winnerUser1?.displayName || result.winnerUser1?.fullName}
													</div>
												</Link>

												<PlayerPoint player={result.winnerUser1} className="ml-1 mb-2" />

												<span className="mx-3">&amp;</span>

												<Link href={`/players/${result.winnerUser2.playerId}`}>
													<div className='mx-auto cursor-pointer hover:underline highlightable'>
														{result.winnerUser2?.displayName || result.winnerUser2?.fullName}
													</div>
												</Link>

												<PlayerPoint player={result.winnerUser2} className="ml-1 mb-2" />

												<span className='font-normal text-xs mb-2 ml-1 text-green-600'>[{result.winnerUser1?.avtaPoint + result.winnerUser2?.avtaPoint}]</span>
											</div>
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										<div className="flex flex-col items-center justify-center">
											<div className='italic text-gray-600 text-sm'>def.</div>
											<div>{result.gameWonByWinners}-{result.gameWonByLosers}</div>
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										{/* <div className='flex'>
											<PlayerAvatar player={result.loserUser1} />
											<PlayerAvatar player={result.loserUser2} className='-ml-2' />
										</div> */}
										<div className='flex flex-col'>
											<div
												className={
													'font-bold flex space-x-2' +
													+(color === 'light'
														? 'text-gray-600'
														: 'text-white')
												}
											>

												<Link href={`/players/${result.loserUser1.playerId}`}>
													<div className='mx-auto cursor-pointer hover:underline highlightable'>
														{result.loserUser1?.displayName || result.loserUser1?.fullName}
													</div>
												</Link>

												<PlayerPoint player={result.loserUser1} className="ml-1 mb-2" />

												<span className="mx-3">&amp;</span>

												<Link href={`/players/${result.loserUser2.playerId}`}>
													<div className='mx-auto cursor-pointer hover:underline highlightable'>
														{result.loserUser2?.displayName || result.loserUser2?.fullName}
													</div>
												</Link>

												<PlayerPoint player={result.loserUser2} className="ml-1 mb-2" />

												<span className='font-normal text-xs mb-2 ml-1 text-green-600'>[{result.loserUser1?.avtaPoint + result.loserUser2?.avtaPoint}]</span>
											</div>
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										<DateWithTimeComponent dateString={result.timestamp} />
										{is_member &&
											<span onClick={() => deleteResult && deleteResult(result)}
												className="ml-3 bg-red-500 text-white cursor-pointer p-2 rounded border hover:bg-red-600">
												Delete
											</span>
										}
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

import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import PlayerPoint from '../PlayerPoint';
import PlayerAvatar from './PlayerAvatar';

export default function LadderRankingTable({ ranking, color, players }) {
	const isRegistered = (player) => players?.find(p => p.playerId === player.player.uid);

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
									Player
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center ' +
										(color === 'light'
											? 'bg-gray-50 text-gray-500 border-gray-100'
											: 'bg-blue-800 text-blue-300 border-blue-700')
									}
								>
									Match Won / Lost
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center ' +
										(color === 'light'
											? 'bg-gray-50 text-gray-500 border-gray-100'
											: 'bg-blue-800 text-blue-300 border-blue-700')
									}
								>
									Games Won / Lost
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center ' +
										(color === 'light'
											? 'bg-gray-50 text-gray-500 border-gray-100'
											: 'bg-blue-800 text-blue-300 border-blue-700')
									}
								>
									Game Win %
								</th>
							</tr>
						</thead>
						<tbody>
							{ranking.map((player, index) => (
								<tr key={player.player.playerId}>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										<div className="flex flex-col items-center justify-center">
											{index + 1}
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										<div className='flex'>
											<PlayerAvatar player={player.player} />
										</div>

										<div className='flex flex-col ml-1'>
											<div
												className={
													'font-bold flex space-x-2' +
													+(color === 'light'
														? 'text-gray-600'
														: 'text-white')
												}
											>
												<Link href={`/players/${player.player.playerId}`}>
													<div className='mx-auto cursor-pointer hover:underline'>
														{player.player.displayName || player.player.fullName}
													</div>
												</Link>

												<PlayerPoint player={player.player} className="ml-1" />
												{isRegistered(player) &&
													<i className="fas fa-money-bill ml-1 text-green-600" title={`Paid on ${isRegistered(player).paidOn}`}></i>
												}
											</div>
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle text-center border-l-0 border-r-0 whitespace-nowrap p-4'>
										{player.win + player.lost > 0 ?
											<>
												{player.win + player.lost} (
												<span className='text-green-600'>{player.win}</span>
												&nbsp;/&nbsp;<span className='text-red-600'>{player.lost}</span>)
											</> : '-'
										}
									</td>
									<td className='border-t-0 px-6 align-middle text-center border-l-0 border-r-0 whitespace-nowrap p-4'>
										{player.gameWin + player.gameLost > 0 ?
											<>
												<span className='text-green-600'>{player.gameWin}</span>
												&nbsp;/&nbsp;<span className='text-red-600'>{player.gameLost}</span>
											</> : '-'
										}
									</td>
									<td className='border-t-0 px-6 align-middle text-center border-l-0 border-r-0 whitespace-nowrap p-4'>
										{player.winPercentage > 0 &&
											<span
												className={cn({
													'text-gray-600': Number(player.winPercentage) === 100,
													'text-green-600': Number(player.winPercentage) > 100,
													'text-red-600': Number(player.winPercentage) < 100,
												})}
											>{player.winPercentage}%</span>
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

LadderRankingTable.defaultProps = {
	color: 'light',
	ranking: [],
};

LadderRankingTable.propTypes = {
	color: PropTypes.oneOf(['light', 'dark']),
};

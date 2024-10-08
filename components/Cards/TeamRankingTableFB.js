import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';
import PlayerPoint from '../PlayerPoint';
import DateWithTimeComponent from '../dateWithTime';
import Avatar from '../avatar';
import PlayerAvatar from './PlayerAvatar';
import { getPriceId } from '../../lib/browserapi'

export default function TeamRankingTable({ groups, color, is_superuser, editTeam, previewMode, competition }) {

	const getPlayers = (team) => team.players ? team.players : [team.player1, team.player2];

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
						<div key={group}>
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
										{
											!previewMode
												? <><th
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
													</th></>
												: null
										}
									</tr>
								</thead>
								<tbody>
									{groups[group].map((team, index) => (
										<tr key={index}>
											<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
												<div className="flex flex-col items-center justify-center">
													{index + 1}
												</div>
											</td>
											<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
												<div className='flex'>
													<PlayerAvatar player={getPlayers(team)[0]} />
													<PlayerAvatar player={getPlayers(team)[1]} className="-ml-2" />
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

														<Link href={`/players/${getPlayers(team)[0].sys?.id}`}>
															<a className="hover:underline">{getPlayers(team)[0].fullName}</a>
														</Link>

														<PlayerPoint player={getPlayers(team)[0]} className="ml-1" />

														<span className="mx-3">&amp;</span>

														<Link href={`/players/${getPlayers(team)[1].sys?.id}`}>
															<a className="hover:underline">{getPlayers(team)[1].fullName}</a>
														</Link>

														<PlayerPoint player={getPlayers(team)[1]} className="ml-1" />

														{team.paidOn &&
															<i className={team.payment_intent ? 'fab fa-cc-stripe text-purple-600' : 'fas fa-money-bill text-green-600'} title={`Paid on ${team.paidOn} ${team.payment_intent || ' - Cash'}`}></i>}
													</div>
													<div className='ml-3 text-sm text-gray-600'>
														{getPlayers(team)[0].homeClub} -{' '}
														<span className={team.isOverLimit ? 'text-yellow-600' : 'text-green-600'}>{getPlayers(team)[0].avtaPoint + getPlayers(team)[1].avtaPoint} pt.</span>

														{!team.paidOn && competition?.costPerTeam > 0 && (<form
															action={`/api/checkout_sessions?applicationId=${team.id}&competition=${team.slug}&priceId=${getPriceId(competition, team)}`} method="POST"
															className="inline-block ml-2"
														>
															<button type="submit" className='text-sm text-red-600 flex space-x-2 hover:underline hover:cursor-pointer font-bold'>
																Pay Now
															</button>
														</form>)
														}

														{is_superuser &&
															<span onClick={() => editTeam && editTeam(team)}
																className="ml-2 underline cursor-pointer hover:text-blue-600">
																Edit
															</span>
														}

													</div>
												</div>
											</td>
											{
												!previewMode
													? <><td className='border-t-0 px-6 align-middle text-center border-l-0 border-r-0 whitespace-nowrap p-4'>
														{team.win + team.lost > 0 ?
															<>
																<span className='text-green-600'>{team.win}</span>
																&nbsp;/&nbsp;<span className='text-red-600'>{team.lost}</span>
															</> : '-'
														}
													</td>
														<td className='border-t-0 px-6 align-middle text-center border-l-0 border-r-0 whitespace-nowrap p-4'>
															{team.diff > -1000 &&
																<span
																	className={cn({
																		'text-gray-600': Number(team.diff) === 0,
																		'text-green-600': Number(team.diff) > 0,
																		'text-red-600': Number(team.diff) < 0,
																	})}
																>{Number(team.diff) > 0 ? "+" : ""}{team.diff}</span>
															}


														</td></>
													: null
											}
										</tr>
									))}
								</tbody>
							</table>
						</div>
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

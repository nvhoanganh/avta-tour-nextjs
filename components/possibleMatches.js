import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment } from 'react'
import LadderMatchResultsCard from './Cards/LadderMatchResultsCard';
import { format } from 'date-fns'

const _isInFilter = (filter, match) => {
	return (
		!!filter.find(u =>
			u === match.team1.player1.trim() ||
			u === match.team1.player2.trim() ||
			u === match.team2.player1.trim() ||
			u === match.team2.player2.trim()
		)
	)
}

const _isPlayerInFilter = (filter, player) => {
	return (
		!!filter.find(u => u === player.trim())
	)
}




export default function PossibleMatches({ matches, filter, }) {
	const [showHead2head, setShowHead2Head] = useState(false);
	const [head2head, setHead2Head] = useState([]);
	const [title, setTitle] = useState('');
	const [subTitle, setSubTitle] = useState('');

	const showHead2HeadResults = (match) => {
		setTitle('Head 2 Head');
		setSubTitle(`'${match.team1.player1} + ${match.team1.player2}' won ${match.team1Won.length} and lost ${match.team1Lost.length} against '${match.team2.player1} + ${match.team2.player2}'`);
		setHead2Head([
			...match.team1Won,
			...match.team1Lost,
		]);
		setShowHead2Head(true);
	}

	const showPairing = (team) => {
		setTitle('Match Stats');
		setSubTitle(`'${team.player1} + ${team.player2}' won ${team.winTogether.length} and lost ${team.lostTogether.length} when playing together`);
		setHead2Head([
			...team.winTogether,
			...team.lostTogether,
		]);
		setShowHead2Head(true);
	}

	const TogetherStats = ({ team }) =>
		<button type="submit" role="link" className="bg-gray-100 text-white active:bg-blue-600 px-2 ml-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150
    disabled:cursor-wait whitespace-nowrap
             disabled:bg-gray-200"
			onClick={() => showPairing(team)}
		>
			{
				team.winTogether?.length > 0
					? <span className='text-green-400 mr-2'>{team.winTogether?.length}W</span>
					: null
			}
			{
				team.lostTogether?.length > 0
					? <span className='text-red-700'>{team.lostTogether?.length}L</span>
					: null
			}
		</button>;

	return (<>
		<Transition appear show={showHead2head} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={() => setShowHead2Head(false)}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="text-3xl font-medium leading-6 text-gray-900 px-4 pt-5 text-center mb-14"
								>
									{title}
									{
										!!subTitle
											? <div className="text-center text-base mt-6">
												{subTitle}
											</div>
											: null
									}
								</Dialog.Title>


								<div className="py-2 my-2 px-2">
									{head2head.map((result) => (
										<div key={result.timestamp} className="relative flex flex-col min-w-0 break-words  bg-white rounded mb-6 xl:mb-0 shadow-lg">
											<div className="flex flex-row items-center justify-between w-full p-4">
												<div>
													<div className="flex flex-wrap">
														<div className="relative w-full pr-4 max-w-full flex-grow flex-1">
															<div
																className=
																'font-bold  text-gray-600'
															>
																{result.winnerUser1?.displayName || result.winnerUser1?.fullName} + {result.winnerUser2?.displayName || result.winnerUser2?.fullName}

																<span className='font-normal mb-2 ml-1 text-green-600'>[{result.winnerUser1?.avtaPoint + result.winnerUser2?.avtaPoint}]</span>
															</div>
															<div className='text-sm text-gray-600'>
																{format(new Date(result.timestamp), 'd/M h:mm a')}
															</div>
														</div>
													</div>
													<div className="flex flex-wrap mt-2">
														<div className="relative w-full pr-4 max-w-full flex-grow flex-1">
															<div
																className=
																'font-bold  text-gray-600 '
															>
																{result.loserUser1?.displayName || result.loserUser1?.fullName} + {result.loserUser2?.displayName || result.loserUser2?.fullName}
																<span className='font-normal mb-2 ml-1 text-green-600'>[{result.loserUser1?.avtaPoint + result.loserUser2?.avtaPoint}]</span>
															</div>
															<div className='text-sm text-gray-600 italic'>
																Submitted by: {result.submittedByFullName}
															</div>
														</div>
													</div>
												</div>

												<div className="">
													<div className=' text-gray-600 text-lg align-center '
													>
														{result.gameWonByWinners}-{result.gameWonByLosers}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>

		{matches.map((match, index) => (
			<div
				className={cn(' border text-left px-2 py-1 my-2 rounded flex items-center space-x-2', {
					'  bg-green-50': _isInFilter(filter, match),
				})}
				key={index}>
				{
					match.team1.point !== match.team2.point && parseInt(match.team1.point) > parseInt(match.team2.point)
						?
						<div className='flex flex-row items-center justify-between w-full'>
							<div className='grow'>
								<div className='py-2'>
									<span className={_isPlayerInFilter(filter, match.team1.player1) ? 'font-bold text-blue-800' : ''}>{match.team1.player1.trim()}</span> -&nbsp;
									<span className={_isPlayerInFilter(filter, match.team1.player2) ? 'font-bold text-blue-800' : ''}>{match.team1.player2.trim()}</span>&nbsp;
									[<span>{match.team1.point}</span>]

									<TogetherStats team={match.team1}></TogetherStats>
								</div>
								<div>
									<span className={_isPlayerInFilter(filter, match.team2.player1) ? 'font-bold text-blue-800' : ''}>{match.team2.player1.trim()}</span> -&nbsp;
									<span className={_isPlayerInFilter(filter, match.team2.player2) ? 'font-bold text-blue-800' : ''}>{match.team2.player2.trim()}</span>&nbsp;
									[<span>{match.team2.point}</span>]

									<TogetherStats team={match.team2}></TogetherStats>
								</div>
							</div>
							{
								match.team1Won?.length > 0 || match.team1Lost?.length > 0
									? <div className='grow-0 text-right font-semibold'>
										<button type="submit" role="link" className="bg-blue-500 text-white active:bg-blue-600 font-bold px-3 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150
    disabled:cursor-wait whitespace-nowrap
             disabled:bg-gray-200"
											onClick={() => showHead2HeadResults(match)}
										>
											{match.team1Won?.length}-{match.team1Lost?.length}
										</button>
									</div>
									: null
							}
						</div>
						: <div className='flex flex-row items-center justify-between w-full'>
							<div className='grow'>
								<div className='py-2'>
									<span className={_isPlayerInFilter(filter, match.team2.player1) ? 'font-bold text-blue-800' : ''}>{match.team2.player1.trim()}</span> -&nbsp;
									<span className={_isPlayerInFilter(filter, match.team2.player2) ? 'font-bold text-blue-800' : ''}>{match.team2.player2.trim()}</span>&nbsp;
									[<span>{match.team2.point}</span>]

									<TogetherStats team={match.team2}></TogetherStats>
								</div>
								<div>
									<span className={_isPlayerInFilter(filter, match.team1.player1) ? 'font-bold text-blue-800' : ''}>{match.team1.player1.trim()}</span> -&nbsp;
									<span className={_isPlayerInFilter(filter, match.team1.player2) ? 'font-bold text-blue-800' : ''}>{match.team1.player2.trim()}</span>&nbsp;
									[<span>{match.team1.point}</span>]
									<TogetherStats team={match.team1}></TogetherStats>
								</div>
							</div>
							{
								match.team1Lost?.length > 0 || match.team1Won?.length > 0
									? <div className='grow-0 text-right font-semibold'>
										<span>
											<button type="submit" role="link" className="bg-blue-500 text-white active:bg-blue-600 font-bold px-3 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150
    disabled:cursor-wait whitespace-nowrap
             disabled:bg-gray-200"
												onClick={() => showHead2HeadResults(match)}
											>
												{match.team1Lost?.length}-{match.team1Won?.length}
											</button>
										</span></div>
									: null
							}
						</div>
				}
			</div>
		))
		}
	</>
	);
}

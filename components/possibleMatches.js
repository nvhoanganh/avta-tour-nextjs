import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';

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

export default function PossibleMatches({ matches, filter }) {
	return (<>
		{matches.map((match, index) => (
			<div
				className={cn(' border text-left px-2 py-1 my-2 rounded flex items-center space-x-2', {
					'  bg-green-50': _isInFilter(filter, match),
				})}
				key={index}>
				{/* <div className="  text-green-600"
					className={cn('text-normal', {
						'  text-green-600': match.pointDiff <= 20,
						'  text-pink-400': match.pointDiff > 20 && match.pointDiff <= 30,
						'  text-red-600': match.pointDiff > 30,
					})}
				>{match.pointDiff <= 20 ? '00-20' :
					match.pointDiff > 20 && match.pointDiff <= 30 ? '20-30' : '30-40'}</div> */}
				{
					match.team1.point !== match.team2.point && parseInt(match.team1.point) > parseInt(match.team2.point)
						?
						<div className='flex flex-row items-center justify-between w-full'>
							<div className='grow'>
								<div>
									<span className={_isPlayerInFilter(filter, match.team1.player1) ? 'font-bold text-blue-800' : ''}>{match.team1.player1.trim()}</span> -&nbsp;
									<span className={_isPlayerInFilter(filter, match.team1.player2) ? 'font-bold text-blue-800' : ''}>{match.team1.player2.trim()}</span>&nbsp;
									[<span>{match.team1.point}</span>]
									<span className='bg-green-400 px-1 rounded mx-1 text-white'>{match.team1.winTogether?.length}</span>
									<span className='bg-red-400 px-1 rounded mx-1 text-white'>{match.team1.lostTogether?.length}</span>
								</div>
								<div>
									<span className={_isPlayerInFilter(filter, match.team2.player1) ? 'font-bold text-blue-800' : ''}>{match.team2.player1.trim()}</span> -&nbsp;
									<span className={_isPlayerInFilter(filter, match.team2.player2) ? 'font-bold text-blue-800' : ''}>{match.team2.player2.trim()}</span>&nbsp;
									[<span>{match.team2.point}</span>]
									<span className='bg-green-400 px-1 rounded mx-1 text-white'>{match.team2.winTogether?.length}</span>
									<span className='bg-red-400 px-1 rounded mx-1 text-white'>{match.team2.lostTogether?.length}</span>
								</div>
							</div>
							{
								match.team1Won?.length > 0 || match.team1Lost?.length > 0
									? <div className='grow-0 text-right font-semibold'>
										<span>{match.team1Won?.length}-{match.team1Lost?.length}</span>
									</div>
									: null
							}
						</div>
						: <div className='flex flex-row items-center justify-between w-full'>
							<div className='grow'>
								<div>
									<span className={_isPlayerInFilter(filter, match.team2.player1) ? 'font-bold text-blue-800' : ''}>{match.team2.player1.trim()}</span> -&nbsp;
									<span className={_isPlayerInFilter(filter, match.team2.player2) ? 'font-bold text-blue-800' : ''}>{match.team2.player2.trim()}</span>&nbsp;
									[<span>{match.team2.point}</span>]
									<span className='bg-green-400 px-1 rounded mx-1 text-white'>{match.team2.winTogether?.length}</span>
									<span className='bg-red-400 px-1 rounded mx-1 text-white'>{match.team2.lostTogether?.length}</span>
								</div>
								<div>
									<span className={_isPlayerInFilter(filter, match.team1.player1) ? 'font-bold text-blue-800' : ''}>{match.team1.player1.trim()}</span> -&nbsp;
									<span className={_isPlayerInFilter(filter, match.team1.player2) ? 'font-bold text-blue-800' : ''}>{match.team1.player2.trim()}</span>&nbsp;
									[<span>{match.team1.point}</span>]
									<span className='bg-green-400 px-1 rounded mx-1 text-white'>{match.team1.winTogether?.length}</span>
									<span className='bg-red-400 px-1 rounded mx-1 text-white'>{match.team1.lostTogether?.length}</span>
								</div>
							</div>
							{
								match.team1Lost?.length > 0 || match.team1Won?.length > 0
									? <div className='grow-0 text-right font-semibold'><span>{match.team1Lost?.length}-{match.team1Won?.length}</span></div>
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

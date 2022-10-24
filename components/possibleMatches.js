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

export default function PossibleMatches({ matches, filter }) {
	return (<>
		{matches.map((match, index) => (
			<div
				className={cn(' border-b text-left px-2 py-1 my-2 rounded flex items-center space-x-2', {
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
						? <div>
							<div>{match.team1.player1} &amp; {match.team1.player2} [<span>{match.team1.point}</span>] <strong>vs.</strong></div>
							<div>{match.team2.player1} &amp; {match.team2.player2} [<span>{match.team2.point}</span>]</div>
						</div>
						: <div>
							<div>{match.team2.player1} &amp; {match.team2.player2} [<span>{match.team2.point}</span>] <strong>vs.</strong></div>
							<div>{match.team1.player1} &amp; {match.team1.player2} [<span>{match.team1.point}</span>]</div>
						</div>
				}
			</div>
		))}
	</>
	);
}

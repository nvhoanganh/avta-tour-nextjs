import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';

export default function PossibleMatches({ matches }) {
	return (<>
		{matches.map((match, index) => (
			<div className=" border-b text-left py-1 flex items-center space-x-2" key={index}>
				{/* <div className="  text-green-600"
					className={cn('text-normal', {
						'  text-green-600': match.pointDiff <= 20,
						'  text-pink-400': match.pointDiff > 20 && match.pointDiff <= 30,
						'  text-red-600': match.pointDiff > 30,
					})}
				>{match.pointDiff <= 20 ? '00-20' :
					match.pointDiff > 20 && match.pointDiff <= 30 ? '20-30' : '30-40'}</div> */}
				<div>
					<div>{match.team1.player1} &amp; {match.team1.player2} [{match.team1.point}] <strong>vs.</strong></div>
					<div>{match.team2.player1} &amp; {match.team2.player2} [{match.team2.point}]</div>
				</div>
			</div>
		))}
	</>
	);
}

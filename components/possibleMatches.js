import Link from 'next/link';
import Image from 'next/image';

export default function PossibleMatches({ matches }) {
	return (<>
		{matches.map((match, index) => (
			<>
				<div className=" border-b-2 text-left py-1 shadow flex items-center space-x-2" key={index}>
					<div className=" text-2xl text-green-600">{match.pointDiff}</div>
					<div>
						<div>{match.team1.player1} &amp; {match.team1.player2} [{match.team1.point}] <strong>vs.</strong></div>
						<div>{match.team2.player1} &amp; {match.team2.player2} [{match.team2.point}]</div>
					</div>
				</div>

			</>
		))}
	</>
	);
}

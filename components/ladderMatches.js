import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import SummaryPossibleMatches from './summaryPossibleMatches';
import PossibleMatches from './possibleMatches'

export default function LadderMatches({ matchUps }) {
	const from20To30 = matchUps.filter(x => x.pointDiff > 20 && x.pointDiff <= 30);
	const over30 = matchUps.filter(x => x.pointDiff > 30 && x.pointDiff <= 40);
	return <>
		<div className="py-6">
			<div className="   text-green-600 text-xl py-3 pb-8 font-bold">0 <i className="fas fa-less-than text-sm"></i> point <i className="fas fa-less-than-equal text-sm"></i> 20</div>
			<SummaryPossibleMatches matches={matchUps.filter(x => x.pointDiff <= 20)}></SummaryPossibleMatches>
			<PossibleMatches matches={matchUps.filter(x => x.pointDiff <= 20)}></PossibleMatches>
		</div >

		{
			from20To30.length > 0
				? <div className="py-6">
					<div className="   text-pink-400 text-xl py-3 pb-8 font-bold">20 <i className="fas fa-less-than text-sm"></i> point <i className="fas fa-less-than-equal text-sm"></i> 30</div>
					<SummaryPossibleMatches matches={from20To30}></SummaryPossibleMatches>
					<PossibleMatches matches={from20To30}></PossibleMatches>
				</div>
				: null
		}
		{
			over30.length > 0
				? <div className="py-6">
					<div className="   text-red-600 text-xl py-3 pb-8 font-bold">30 <i className="fas fa-less-than text-sm"></i> point <i className="fas fa-less-than-equal text-sm"></i> 40</div>
					<SummaryPossibleMatches matches={over30}></SummaryPossibleMatches>
					<PossibleMatches matches={over30}></PossibleMatches>
				</div>
				: null
		}
	</>
}

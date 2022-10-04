import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import SummaryPossibleMatches from './summaryPossibleMatches';
import PossibleMatches from './possibleMatches'

export default function LadderMatches({ matchUps }) {
	const less20 = matchUps.filter(x => x.pointDiff <= 20);
	const from20To30 = matchUps.filter(x => x.pointDiff > 20 && x.pointDiff <= 30);
	const over30 = matchUps.filter(x => x.pointDiff > 30 && x.pointDiff <= 40);
	return <>

		<div className="text-2xl py-3 uppercase font-bold">Play Order</div>
		{!less20.length && !from20To30.length && !over30.length ? <div className="py-6">No possible matches found with points difference less than 40 😢</div> : <></>}
		{
			less20.length > 0
				? <div className="py-6">
					<div className="text-xl py-3 pb-8 font-bold">0 <i className="fas fa-less-than text-sm"></i> point <i className="fas fa-less-than-equal text-sm"></i> 20</div>
					<SummaryPossibleMatches matches={less20}></SummaryPossibleMatches>
					<PossibleMatches matches={less20}></PossibleMatches>
				</div >
				: null
		}

		{
			from20To30.length > 0
				? <div className="py-6">
					<div className="text-xl py-3 pb-8 font-bold">20 <i className="fas fa-less-than text-sm"></i> point <i className="fas fa-less-than-equal text-sm"></i> 30</div>
					<SummaryPossibleMatches matches={from20To30}></SummaryPossibleMatches>
					<PossibleMatches matches={from20To30}></PossibleMatches>
				</div>
				: null
		}
		{
			over30.length > 0
				? <div className="py-6">
					<div className="text-xl py-3 pb-8 font-bold">30 <i className="fas fa-less-than text-sm"></i> point <i className="fas fa-less-than-equal text-sm"></i> 40</div>
					<SummaryPossibleMatches matches={over30}></SummaryPossibleMatches>
					<PossibleMatches matches={over30}></PossibleMatches>
				</div>
				: null
		}
	</>
}

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import SummaryPossibleMatches from './summaryPossibleMatches';
import PossibleMatches from './possibleMatches'

const _inFilter = (filter, match) => {
	return (
		!!filter.find(u => u === match.team1.player1.trim()) &&
		!!filter.find(u => u === match.team1.player2.trim()) &&
		!!filter.find(u => u === match.team2.player1.trim()) &&
		!!filter.find(u => u === match.team2.player2.trim())
	)
}
export default function LadderMatches({ matchUps }) {
	const [filter, setFilter] = useState([]);
	const onSelectedFilterChanged = (players) => {
		setFilter(players);
	}

	const [less20, setLessThan20Pt] = useState(matchUps.filter(x => x.pointDiff <= 20));
	const [from20To30, setFrom20To30Pt] = useState(matchUps.filter(x => x.pointDiff > 20 && x.pointDiff <= 30));
	const [over30, setOver30Pt] = useState(matchUps.filter(x => x.pointDiff > 30 && x.pointDiff <= 40));

	useEffect(() => {
		if (filter.length >= 4) {
			const _less20 = matchUps.filter(x => x.pointDiff <= 20 && _inFilter(filter, x)
			);
			setLessThan20Pt(_less20)

			const _from20To30 = matchUps.filter(x => x.pointDiff > 20 && x.pointDiff <= 30 && _inFilter(filter, x)
			);
			setFrom20To30Pt(_from20To30)

			const _more30 = matchUps.filter(x => x.pointDiff > 30 && x.pointDiff <= 40 && _inFilter(filter, x)
			);
			setOver30Pt(_more30)
		} else {
			setLessThan20Pt(matchUps.filter(x => x.pointDiff <= 20))
			setFrom20To30Pt(matchUps.filter(x => x.pointDiff > 20 && x.pointDiff <= 30))
			setOver30Pt(matchUps.filter(x => x.pointDiff > 30 && x.pointDiff <= 40))
		}
	}, [filter]);

	return <>
		<div className="text-2xl py-3 uppercase font-bold">Play Order</div>
		<SummaryPossibleMatches onSelectedChange={onSelectedFilterChanged} matches={matchUps}></SummaryPossibleMatches>
		<div className="italic text-xs text-gray-400 text-center">Hint: Click on 4 or more players to show possible matches</div>
		{!less20.length && !from20To30.length && !over30.length ? <div className="py-6">No possible matches found with points difference less than 40 😢</div> : <></>}
		{
			less20.length > 0
				? <div className="py-6">
					<div className="text-xl py-3">No Handicap
						<div className="text-sm text-gray-500">0 <i className="fas fa-less-than text-sm"></i> point <i className="fas fa-less-than-equal text-sm"></i> 20 ({less20.length})</div>
					</div>
					<PossibleMatches matches={less20}></PossibleMatches>
				</div >
				: null
		}

		{
			from20To30.length > 0
				? <div className="py-6">
					<div className="text-xl py-3">1-0 Handicap
						<div className="text-sm text-gray-500">20 <i className="fas fa-less-than text-sm"></i> point <i className="fas fa-less-than-equal text-sm"></i> 30 ({from20To30.length})</div>
					</div>
					<PossibleMatches matches={from20To30}></PossibleMatches>
				</div>
				: null
		}
		{
			over30.length > 0
				? <div className="py-6">
					<div className="text-xl py-3">2-0 Handicap to 7
						<div className="text-sm text-gray-500">30 <i className="fas fa-less-than text-sm"></i> point <i className="fas fa-less-than-equal text-sm"></i> 40 ({over30.length})</div>
					</div>
					<PossibleMatches matches={over30}></PossibleMatches>
				</div>
				: null
		}
	</>
}

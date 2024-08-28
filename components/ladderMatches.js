import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import SummaryPossibleMatches from './summaryPossibleMatches';
import PossibleMatches from './possibleMatches'
import { intersection, without } from "ramda";

const _inFilter = (filter, match) => {
	if (filter.length === 1) {
		// 1 player selected -> show all where that player is there
		return (
			!!filter.find(u => u === match.team1.player1.trim()) ||
			!!filter.find(u => u === match.team1.player2.trim()) ||
			!!filter.find(u => u === match.team2.player1.trim()) ||
			!!filter.find(u => u === match.team2.player2.trim())
		)
	}

	if (filter.length >= 2 && filter.length <= 4) {
		// 2 players selected -> both players must be in the one match, no point showing 
		const playersInMatch = [
			match.team1.player1.trim(),
			match.team1.player2.trim(),
			match.team2.player1.trim(),
			match.team2.player2.trim(),
		];
		const intersec = intersection(filter, playersInMatch);
		return intersec.length === filter.length;
	}

	// more than 4 then must appears in all
	return (
		!!filter.find(u => u === match.team1.player1.trim()) &&
		!!filter.find(u => u === match.team1.player2.trim()) &&
		!!filter.find(u => u === match.team2.player1.trim()) &&
		!!filter.find(u => u === match.team2.player2.trim())
	)
}

const _sortBySelection = (matches, filter) => {
	if (filter.length === 2) {
		return matches.sort((a, b) => {
			const inSameTeamMatchA =
				(
					!!filter.find(u => u === a.team1.player1.trim()) &&
					!!filter.find(u => u === a.team1.player2.trim())
				) ||
				(
					!!filter.find(u => u === a.team2.player1.trim()) &&
					!!filter.find(u => u === a.team2.player2.trim())
				);

			const inSameTeamMatchB =
				(
					!!filter.find(u => u === b.team1.player1.trim()) &&
					!!filter.find(u => u === b.team1.player2.trim())
				) ||
				(
					!!filter.find(u => u === b.team2.player1.trim()) &&
					!!filter.find(u => u === b.team2.player2.trim())
				);

			if (inSameTeamMatchA && !inSameTeamMatchB) return -1
			if (inSameTeamMatchB && !inSameTeamMatchA) return 1;
			return 0;
		})

	}

	return matches;
}

export default function LadderMatches({ matchUps }) {
	const [filter, setFilter] = useState([]);
	const [showPlayed, setShowPlayed] = useState('');
	const [played, setPlayed] = useState(null);

	const onSelectedFilterChanged = (players) => {
		setFilter(players);
	}

	const [less20, setLessThan20Pt] = useState(matchUps.filter(x => x.pointDiff <= 20));
	const [from20To30, setFrom20To30Pt] = useState(matchUps.filter(x => x.pointDiff > 20 && x.pointDiff <= 30));

	// const [over30, setOver30Pt] = useState(matchUps.filter(x => x.pointDiff > 30 && x.pointDiff <= 40));

	useEffect(() => {
		const showPlayed = filter.indexOf(':Played') >= 0;
		const showNotPlayed = filter.indexOf(':Not Played') >= 0;

		const _filter = without([':Played', ':Not Played'], filter)

		let _matches = matchUps;
		if (showPlayed != showNotPlayed) {
			if (showPlayed) {
				_matches = matchUps.filter(m => m.team1Won?.length > 0 || m.team1Lost?.length > 0);
			}
			if (showNotPlayed) {
				_matches = matchUps.filter(m => m.team1Won?.length === 0 && m.team1Lost?.length === 0);
			}
		}

		if (_filter.length >= 1) {
			const _less20 = _sortBySelection(_matches.filter(x => x.pointDiff <= 20 && _inFilter(_filter, x)), _filter);
			setLessThan20Pt(_less20)

			const _from20To30 = _sortBySelection(_matches.filter(x => x.pointDiff > 20 && x.pointDiff <= 30 && _inFilter(_filter, x)), _filter);
			setFrom20To30Pt(_from20To30)

			// const _more30 = matchUps.filter(x => x.pointDiff > 30 && x.pointDiff <= 40 && _inFilter(filter, x));
			// setOver30Pt(_more30)
		} else {
			setLessThan20Pt(_matches.filter(x => x.pointDiff <= 20))
			setFrom20To30Pt(_matches.filter(x => x.pointDiff > 20 && x.pointDiff <= 30))
			// setOver30Pt(matchUps.filter(x => x.pointDiff > 30 && x.pointDiff <= 40))
		}
	}, [filter]);

	return <>
		<div className="text-2xl py-3 uppercase font-bold">Play Order</div>
		<SummaryPossibleMatches onSelectedChange={onSelectedFilterChanged} matches={matchUps}></SummaryPossibleMatches>
		<div className="italic text-xs text-gray-400 text-center">Hint: Click on player name to show possible matches</div>
		{
			less20.length > 0
				? <div className="py-6">
					<div className="text-xl py-3">No Handicap
						<div className="text-sm text-gray-500">0 <i className="fas fa-less-than text-sm"></i> point <i className="fas fa-less-than-equal text-sm"></i> 20 ({less20.length})</div>
					</div>
					<PossibleMatches matches={less20} filter={filter}></PossibleMatches>
				</div >
				: null
		}

		{
			from20To30.length > 0
				? <div className="py-6">
					<div className="text-xl py-3">1-0 Handicap
						<div className="text-sm text-gray-500">20 <i className="fas fa-less-than text-sm"></i> point <i className="fas fa-less-than-equal text-sm"></i> 30 ({from20To30.length})</div>
					</div>
					<PossibleMatches matches={from20To30} filter={filter}></PossibleMatches>
				</div>
				: null
		}
		{/* {
			over30.length > 0
				? <div className="py-6">
					<div className="text-xl py-3">2-0 Handicap to 7
						<div className="text-sm text-gray-500">30 <i className="fas fa-less-than text-sm"></i> point <i className="fas fa-less-than-equal text-sm"></i> 40 ({over30.length})</div>
					</div>
					<PossibleMatches matches={over30} filter={filter}></PossibleMatches>
				</div>
				: null
		} */}
	</>
}

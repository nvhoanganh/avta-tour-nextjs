import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';
import PlayerAvatar from '../Cards/PlayerAvatar';
import { format } from 'date-fns'
import PlayerPoint from '../PlayerPoint';
import PageVisit from './CardPageVisits';
import CardMatchWin from './CardMatchWin';

// components

import TableDropdown from '../Dropdowns/TableDropdown.js';
import CardStats from '../Cards/CardStats.js';

export default function TournamentSummaryResultCard({ compResults, player }) {
	console.log("🚀 ~ file: TournamentSummaryResultCard.js:18 ~ TournamentSummaryResultCard ~ compResults:", compResults)
	return (
		<>
			<CardMatchWin compResults={compResults} player={player} ></CardMatchWin>
			{/* <div className='flex flex-wrap'>
				<div className='grid grid-cols-1 w-full md:grid-cols-2 md:gap-x-10 lg:gap-x-16 gap-y-4'>

				</div>
			</div> */}
		</>
	);
}
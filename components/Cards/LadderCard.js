import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';
import { format } from 'date-fns'

// components

import TableDropdown from '../Dropdowns/TableDropdown.js';
import CardStats from '../Cards/CardStats.js';

export default function LadderCard({ color, ladders }) {
	return (
		<>
			<div className='flex flex-wrap'>
				<div className='w-full lg:w-6/12 xl:w-3/12 px-4'>
					{ladders.map((ladder) => (
						<CardStats
							key={ladder.id}
							link={`/ladders/${ladder.id}`}
							statSubtitle={ladder.homeClub}
							statTitle={ladder.name}
							statArrow=''
							statPercent=''
							statPercentColor='text-emerald-500'
							statDescripiron={
								`Fee: $${ladder.joiningFee}, ${format(new Date(ladder.startDate), 'LLLL	d, yyyy')} - ${format(new Date(ladder.endDate), 'LLLL	d, yyyy')}`
							}
							statIconName={
								new Date() >= new Date(ladder.startDate) && new Date() <= new Date(ladder.endDate)
									? 'fas fa-lock-open'
									: 'far fa-lock'
							}
							statIconColor={
								new Date() >= new Date(ladder.startDate) && new Date() <= new Date(ladder.endDate) ? 'bg-green-500' : 'bg-red-500'
							}
						/>
					))}
				</div>
			</div>
		</>
	);
}

LadderCard.defaultProps = {
	color: 'light',
	competitions: [],
};

LadderCard.propTypes = {
	color: PropTypes.oneOf(['light', 'dark']),
};

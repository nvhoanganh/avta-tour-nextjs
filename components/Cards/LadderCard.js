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
							statSubtitle={ladder.name}
							statTitle={ladder.homeClub}
							statArrow=''
							statPercent=''
							statPercentColor='text-emerald-500'
							statDescripiron={
								`${format(new Date(ladder.startDate), 'LLLL	d, yyyy')} - ${format(new Date(ladder.endDate), 'LLLL	d, yyyy')}`
							}
							statIconName={
								ladder.active
									? 'fas fa-lock-open'
									: 'far fa-chart-bar'
							}
							statIconColor={
								'bg-green-500'
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

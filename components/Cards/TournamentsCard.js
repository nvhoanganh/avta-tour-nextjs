import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';

// components

import TableDropdown from '../Dropdowns/TableDropdown.js';
import CardStats from '../Cards/CardStats.js';

export default function TournamentsCard({ color, competitions }) {
	return (
		<>
			<div className='flex flex-wrap'>
				<div className='w-full lg:w-6/12 xl:w-3/12 px-4'>
					{competitions.map((comp) => (
						<CardStats
							key={comp.slug}
							link={`/competitions/${comp.slug}`}
							statSubtitle={comp.club}
							statTitle={comp.title}
							statArrow=''
							statPercent={comp.maxPoint + ' pt.'}
							statPercentColor='text-emerald-500'
							statDescripiron={
								comp.teamsCollection?.items.length + ' Teams'
							}
							statIconName={
								comp.active
									? 'fas fa-lock-open'
									: 'far fa-chart-bar'
							}
							statIconColor={
								comp.active ? 'bg-green-500' : 'bg-red-500'
							}
						/>
					))}
				</div>
			</div>
		</>
	);
}

TournamentsCard.defaultProps = {
	color: 'light',
	competitions: [],
};

TournamentsCard.propTypes = {
	color: PropTypes.oneOf(['light', 'dark']),
};

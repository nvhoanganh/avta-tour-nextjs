import TeamCard from './TeamCard';
import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';
import TeamAvatar from '../TeamAvatar';

// components

import TableDropdown from '../Dropdowns/TableDropdown.js';
import CardStats from '../Cards/CardStats.js';

export default function TeamsCard({ color, teams, is_superuser }) {
	return (
		<>
			<div className='grid grid-cols-1 md:grid-cols-3 md:gap-x-10 lg:gap-x-16 gap-y-5 mb-32'>
				{teams.map((t) =>
					(<TeamCard key={t.id} team={t} is_superuser={is_superuser}/>)
				)}
			</div>
		</>
	);
}

TeamsCard.defaultProps = {
	color: 'light',
	teams: [],
};

TeamsCard.propTypes = {
	color: PropTypes.oneOf(['light', 'dark']),
};

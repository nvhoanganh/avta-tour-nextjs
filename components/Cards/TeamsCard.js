import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';

// components

import TableDropdown from '../Dropdowns/TableDropdown.js';
import CardStats from '../Cards/CardStats.js';

export default function TeamsCard({ color, teams }) {
	return (
		<>
			<div className='grid grid-cols-1 md:grid-cols-2 md:gap-x-10 lg:gap-x-16 gap-y-5 mb-32'>
				{teams.map((team) => {
					let description =
						team.players[0].fullName +
						`(${team.players[0].avtaPoint})`;

					description +=
						' - ' +
						team.players[1].fullName +
						`(${team.players[1].avtaPoint})`;

					return (
						<CardStats
							key={team.name}
							link={`#`}
							statSubtitle={
								team.players[0].homeClub || 'Unknown Club'
							}
							statTitle={team.name}
							statArrow=''
							statPercent={
								team.players[0].avtaPoint +
								team.players[1].avtaPoint +
								' pt.'
							}
							statPercentColor='text-green-500'
							statDescripiron={description}
							statIconName='fas fa-user-check'
							statIconColor='bg-green-500'
						/>
					);
				})}
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

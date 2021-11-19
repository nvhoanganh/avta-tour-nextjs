import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';
import TeamAvatar from '../TeamAvatar';

// components

import TableDropdown from '../Dropdowns/TableDropdown.js';
import CardStats from '../Cards/CardStats.js';

export default function TeamsCard({ color, teams }) {
	return (
		<>
			<div className='grid grid-cols-1 md:grid-cols-3 md:gap-x-10 lg:gap-x-16 gap-y-5 mb-32'>
				{teams.map((t) => {
					const team = {
						player1: t.playersCollection.items[0],
						player2: t.playersCollection.items[1],
					};

					return (<div className="relative flex flex-col min-w-0 break-words  bg-white rounded mb-3 xl:mb-0 shadow-lg">
						<div className="flex-auto p-4">
							<div className="flex flex-wrap ">
								<div className="relative w-full pr-4 max-w-full flex-grow flex-1">
									<div
										className=
										'font-bold flex space-x-1 text-gray-600 '
									>
										<span>{t.name}</span>
									</div>
									<div
										className=
										'text-gray-600 '
									>
										{team.player1.homeClub || 'Unknown Club'}
									</div>
									<div className='text-sm text-gray-600 flex space-x-2'>
										<span className='text-green-600'>{team.player1.avtaPoint + team.player2.avtaPoint} pt.</span>
									</div>
								</div>
								<div className="relative w-auto pl-4 flex-initial flex">
									<TeamAvatar team={team} />
								</div>
							</div>
						</div>
					</div>)
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

import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';
import PlayerAvatar from '../Cards/PlayerAvatar';
import { format } from 'date-fns'
import PlayerPoint from '../PlayerPoint';
import { getDescription } from '../../lib/browserapi';

// components

import TableDropdown from '../Dropdowns/TableDropdown.js';
import CardStats from '../Cards/CardStats.js';

export default function TournamentResultCard({ competitions }) {
	return (
		<>
			<div className='flex flex-wrap'>
				<div className='grid grid-cols-1 w-full md:grid-cols-3 md:gap-x-10 lg:gap-x-16 gap-y-4'>
					{competitions.map((comp, index) => (
						<CardStats
							key={comp.slug}
							link={`/competitions/${comp.slug}`}
							statSubtitle={`${comp.title}`}
							statTitle={getDescription(comp)}
							statArrow=''
							statPercentColor='text-emerald-500'
							statPercent={<div className='flex items-center space-x-2 justify-between'>
								<div className='flex items-center space-x-2'>
									<PlayerAvatar player={comp.partner} />
									<span>
										with <span className='font-bold'>{comp.partner.fullName}</span>
										<PlayerPoint className='inline ml-1' player={comp.partner} />
									</span>
								</div>
								<div>AVTA Point: <span className="font-bold">{comp.avtaPoint}</span></div>
							</div>}
							statIconName={
								comp.reached === 'Final'
									? (comp.wonLastMatch ? 'fas fa-trophy text-white' : 'fas fa-medal text-gray-200')
									: (
										comp.reached === '3rdPlace' && comp.wonLastMatch ? 'fas fa-medal text-yellow-400' : 'far fa-calendar-check text-green-400'
									)
							}
							statIconColor={
								comp.reached === 'Final'
									? (comp.wonLastMatch ? 'bg-yellow-400' : 'bg-gray-400')
									: (
										comp.reached === '3rdPlace' && comp.wonLastMatch ? 'bg-yellow-700' : 'bg-gray-200'
									)
							}
						/>
					))}
				</div>
			</div>
		</>
	);
}
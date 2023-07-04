import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';
import PlayerAvatar from '../Cards/PlayerAvatar';
import { format } from 'date-fns'
import PlayerPoint from '../PlayerPoint';

// components

import TableDropdown from '../Dropdowns/TableDropdown.js';
import CardStats from '../Cards/CardStats.js';

export default function TournamentResultCard({ competitions }) {
	return (
		<>
			<div className='flex flex-wrap'>
				<div className='grid grid-cols-1 w-full md:grid-cols-3 md:gap-x-10 lg:gap-x-16 gap-y-4'>
					{competitions.map((comp) => (
						<CardStats
							key={comp.slug}
							link={`/competitions/${comp.slug}`}
							statSubtitle={comp.title}
							statTitle={comp.reached.length === 1 ? `Lost ${comp.losts} matches in Group ${comp.reached}` :
								`${comp.wonLastMatch ? 'Won' : 'Lost'} in the ${comp.reached}`}
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
									? 'fas fa-trophy text-white-400'
									: 'fas fa-check'
							}
							statIconColor={
								comp.reached === 'Final' ?
									(comp.wonLastMatch ? 'bg-yellow-500' : 'bg-gray-400') :
									'bg-green-500'
							}
						/>
					))}
				</div>
			</div>
		</>
	);
}
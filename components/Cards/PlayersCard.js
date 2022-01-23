import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';

export default function PlayersCard({ allPlayers }) {
	return (<section className='pt-32 pb-48'>
		<div className='container mx-auto px-4'>
			<div className='flex flex-wrap justify-center'>
				<div className='grid grid-cols-2 md:grid-cols-5 md:gap-x-10 lg:gap-x-16 gap-y-20 mb-32'>
					{allPlayers.map(x => <div key={x.nickName} className='px-6 text-center'>
						<Link href={`/players/${x.sys.id}`}>
							<div className='mx-auto max-w-120-px'>
								<ContentfulImage
									width={120}
									height={120}
									className='rounded-full mx-auto max-w-120-px'
									src={x.photoURL || x.coverImage?.url || 'https://via.placeholder.com/120'}
								/>
							</div>
						</Link>

						<div className='pt-6 text-center'>
							<h5 className='text-xl font-bold'>
								<Link href={`/players/${x.sys.id}`}>
									<a className='hover:underline'>
										{x.fullName}
									</a>
								</Link>
							</h5>
							{x.fullName !== x.nickName &&
								<p className='mt-1 text-blue-900 text-sm'>
									({x.nickName})
								</p>
							}
							<p className='mt-1 text-xl text-blue-900 uppercase font-semibold'>
								{x.avtaPoint}
							</p>
							<p className='mt-1 text-sm text-gray-400 uppercase font-semibold'>
								{x.homeClub || 'Unknown Club'}
							</p>
						</div>
					</div>)}
				</div>
			</div>
		</div>
	</section>);
}
import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';

// components

import TableDropdown from '../Dropdowns/TableDropdown.js';

export default function TournamentsTable({ color, competitions }) {
	const getPercentageRegistered = (comp) => (
		(comp.teamsCollection?.items.length || comp.appliedTeams?.length) /
		(comp.minimumNumberOfTeams || 16)) * 100;

	const getNumberOfRegistered = (comp) => (
		comp.teamsCollection?.items.length || comp.appliedTeams?.length);

	return (
		<>
			<div
				className={
					'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg ' +
					(color === 'light'
						? 'bg-white'
						: 'bg-lightBlue-900 text-white')
				}
			>
				<div className='block w-full overflow-x-auto'>
					{/* Projects table */}
					<table className='items-center w-full bg-transparent border-collapse'>
						<thead>
							<tr>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
								>
									Competition
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
								>
									Max Point
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
								>
									Status
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
								>
									Sign up process
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
								></th>
							</tr>
						</thead>
						<tbody>
							{competitions.map((comp) => (
								<tr key={comp.slug}>
									<th className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										<div
											className='h-12 w-12 bg-white rounded-full border'
											alt='...'
										>
											<ContentfulImage
												width={128}
												height={128}
												className='rounded-full'
												src={comp.heroImage?.url}
											/>
										</div>{' '}
										<div className='flex flex-col'>
											<div
												className={
													'ml-3 font-bold ' +
													+(color === 'light'
														? 'text-blueGray-600'
														: 'text-white')
												}
											>
												{comp.title}
											</div>
											<div className='ml-3 text-sm text-gray-600'>
												{comp.club}
											</div>
										</div>
									</th>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										{comp.maxPoint} pt.
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										<i
											className={cn(
												'fas fa-circle mr-2',
												{
													'text-green-600':
														comp.active,
													'text-red-600':
														!comp.active,
												}
											)}
										></i>{' '}
										{comp.active ? 'Open' : 'Completed'}
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										<div className='flex items-center'>
											<span className='mr-2'>
												{
													getNumberOfRegistered(comp)
												}{' '}
												Teams
											</span>
											<div className='relative w-full'>
												{comp.active ? (
													<div className='overflow-hidden h-2 flex rounded bg-red-200'>
														<div
															style={{
																width:
																	getPercentageRegistered(comp) +
																	'%',
															}}
															className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500'
														></div>
													</div>
												) : (
													<div className='overflow-hidden h-2 flex rounded'>
														<div
															style={{
																width: '100%',
															}}
															className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500'
														></div>
													</div>
												)}
											</div>
										</div>
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-right'>
										<Link
											href={`/competitions/${comp.slug}`}
										>
											<a className='get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'>
												View Event
											</a>
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}

TournamentsTable.defaultProps = {
	color: 'light',
	competitions: [],
};

TournamentsTable.propTypes = {
	color: PropTypes.oneOf(['light', 'dark']),
};

import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import DateComponent from '../date';
import PropTypes from 'prop-types';
import ContentfulImage from '../contentful-image';

import TableDropdown from '../Dropdowns/TableDropdown.js';

export default function GroupsTable({ color, ladders }) {
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
									Ladder
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
								>
									Home Club
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
										(color === 'light'
											? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
											: 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
									}
								>
									Date
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
							{ladders.map((ladder) => (
								<tr key={ladder.id}>
									<th className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										<div className='flex flex-col'>
											<div
												className={
													'ml-3 font-bold ' +
													+(color === 'light'
														? 'text-blueGray-600'
														: 'text-white')
												}
											>
												{ladder.name}
											</div>
										</div>
									</th>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										{ladder.homeClub}
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										<DateComponent dateString={ladder.startDate} /> - <DateComponent dateString={ladder.endDate} />
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-right'>
										<Link
											href={`/ladders/${ladder.id}`}
										>
											<a className='get-started text-white font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'>
												View
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

GroupsTable.defaultProps = {
	color: 'light',
	groups: [],
};

GroupsTable.propTypes = {
	color: PropTypes.oneOf(['light', 'dark']),
};

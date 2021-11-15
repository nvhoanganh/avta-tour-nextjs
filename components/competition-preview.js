import Link from 'next/link';
import Avatar from '../components/avatar';
import DateComponent from '../components/date';
import CoverImage from './cover-image';
import ContentfulImage from './contentful-image';
import cn from 'classnames';

export default function CompetitionPreview({
	title,
	slug,
	type,
	club,
	excerpt,
	date,
	maxPoint,
	heroImage,
	teamsCollection,
	active,
	applicationGForm,
}) {
	return (
		<>
			<div className='flex flex-wrap items-center mt-32 space-y-3'>
				<div className='w-full md:w-5/12 px-4 mr-auto ml-auto'>
					<div className='flex items-center space-x-3 mb-6'>
						<div className='text-yellow-400 p-3 text-center inline-flex items-center justify-center w-16 h-16 shadow-lg rounded-full bg-white'>
							<i className='fas fa-trophy text-xl'></i>
						</div>
						<div className='text-2xl text-gray-500 font-semibold leading-normal'>
							Upcoming Event
						</div>
					</div>
					<h3 className='text-3xl mb-2 font-semibold leading-normal'>
						{title}
					</h3>
					<p className='text-lg font-light leading-relaxed mt-4 mb-4 text-gray-600'>
						{excerpt}
					</p>

					<div className='sm:block flex flex-col mt-10'>
						<Link href={`/`}>
							<span className='get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'>
								View Event
							</span>
						</Link>

						{active && applicationGForm ? (
							<a href={applicationGForm} target='_blank'>
								<span className='github-star sm:ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-gray-700 active:bg-blueGray-600 uppercase text-sm shadow hover:shadow-lg'>
									<i className='far fa-hand-point-right mr-3'></i>
									<span>Apply Now</span>
								</span>
							</a>
						) : null}
					</div>

					<p className='text-lg font-light leading-relaxed mt-8 mb-4 text-gray-600'>
						<Link href={`/competitions`}>
							<a className='hover:underline hover:cursor-pointer'>
								All past events
							</a>
						</Link>
					</p>
				</div>

				<div className='w-full md:w-4/12 px-4 mr-auto ml-auto sm:pt-10'>
					<div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-blue-500'>
						<ContentfulImage
							width={1000}
							height={600}
							className='rounded-xl shadow-sm'
							src={heroImage?.url}
						/>
						<blockquote className='relative p-8 mb-4'>
							<svg
								preserveAspectRatio='none'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 583 95'
								className='absolute left-0 w-full block h-95-px -top-94-px'
							>
								<polygon
									points='-30,95 583,95 583,65'
									className='text-blue-500 fill-current'
								></polygon>
							</svg>
							<h4 className='text-xl font-bold text-white'>
								<DateComponent dateString={date} />
							</h4>
							<p className='text-md font-light mt-2 text-white'>
								<ul className='list-none mt-6'>
									<li className='py-2'>
										<div className='flex items-center'>
											<div>
												<span className='text-md font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-blueGray-50 mr-3'>
													<i className='fas fa-sort-numeric-down-alt'></i>
												</span>
											</div>
											<div>
												<h4 className='text-blueGray-500'>
													{maxPoint} pt.
												</h4>
											</div>
										</div>
									</li>
									<li className='py-2'>
										<div className='flex items-center'>
											<div>
												<span className='text-md font-semibold inline-block py-1 px-2 uppercase rounded-full  text-white bg-blueGray-50 mr-3'>
													<i className='fas fa-map-marked-alt'></i>
												</span>
											</div>
											<div>
												<h4 className='text-blueGray-500'>
													{club}
												</h4>
											</div>
										</div>
									</li>
									<li className='py-2'>
										<div className='flex items-center'>
											<div>
												<span className='text-md font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-blueGray-50 mr-3'>
													<i className='fas fa-font'></i>
												</span>
											</div>
											<div>
												<h4 className='text-blueGray-500'>
													{type}
												</h4>
											</div>
										</div>
									</li>
								</ul>
							</p>
						</blockquote>
					</div>
				</div>
			</div>
		</>
	);
}

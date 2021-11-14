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
}) {
	return (
		<div className='mx-auto pb-32 pt-24'>
			<div className='items-center flex flex-wrap'>
				<Link href={`/competitions/${slug}`}>
					<div className='w-full md:w-5/12 ml-auto px-12 md:px-4'>
						<div className='md:pr-12'>
							<h2 className='text-3xl font-semibold pb-3 text-gray-500'>
								Upcoming Event
							</h2>
							<h3 className='text-2xl font-semibold'>{title}</h3>
							<p className='mt-4 text-lg leading-relaxed text-blueGray-500'>
								{excerpt}
							</p>
							<ul className='list-none mt-6'>
								<li className='py-2'>
									<div className='flex items-center'>
										<div>
											<span className='text-md font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-900 bg-blueGray-50 mr-3'>
												<i className='fas fa-calendar-alt'></i>
											</span>
										</div>
										<div>
											<h4 className='text-blueGray-500'>
												<DateComponent
													dateString={date}
												/>
											</h4>
										</div>
									</div>
								</li>
								<li className='py-2'>
									<div className='flex items-center'>
										<div>
											<span className='text-md font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-900 bg-blueGray-50 mr-3'>
												<i className='fas fa-sort-numeric-down-alt'></i>
											</span>
										</div>
										<div>
											<h4 className='text-blueGray-500'>
												Max {maxPoint}pt.
											</h4>
										</div>
									</div>
								</li>
								<li className='py-2'>
									<div className='flex items-center'>
										<div>
											<span className='text-md font-semibold inline-block py-1 px-2 uppercase rounded-full  text-gray-900 bg-blueGray-50 mr-3'>
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
											<span className='text-md font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-900 bg-blueGray-50 mr-3'>
												<i className='far fa-text-height'></i>
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
						</div>
					</div>
				</Link>
				<div
					className='w-full md:w-6/12 mr-auto px-4 pt-24 md:pt-0'
					style={{
						transform:
							'scale(1) perspective(1040px) rotateY(-11deg) rotateX(2deg) rotate(2deg)',
					}}
				>
					<ContentfulImage
						width={1000}
						height={600}
						className={cn('rounded-xl shadow-sm')}
						src={heroImage?.url}
					/>
				</div>
			</div>
		</div>
	);
}

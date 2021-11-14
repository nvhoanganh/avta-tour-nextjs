import Link from 'next/link';
import Avatar from '../components/avatar';
import DateComponent from '../components/date';
import CoverImage from './cover-image';
import ContentfulImage from './contentful-image'
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
		<div>
			<div className='mb-5'>
				<ContentfulImage
					width={2000}
					height={1000}
					className={cn('rounded-xl shadow-sm')}
					src={heroImage?.url}
				/>
			</div>
			<h3 className='text-3xl mb-3 leading-snug'>
				<Link href={`/competitions/${slug}`}>
					<a className='hover:underline'>{title}</a>
				</Link>
			</h3>
			<div className='text-lg mb-4'>
				<DateComponent dateString={date} />
			</div>
			<div className='text-lg mb-4'>
				Max {maxPoint}pt. - Location {club} - {type}
			</div>
		</div>
	);
}

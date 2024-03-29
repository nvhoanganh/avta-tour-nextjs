import Link from 'next/link';
import Avatar from '../components/avatar';
import DateComponent from '../components/date';
import CoverImage from '../components/cover-image';
import ContentfulImage from '../components/contentful-image';

export default function HeroPost({
	title,
	coverImage,
	date,
	excerpt,
	author,
	slug,
}) {
	return (
		<Link href={`/posts/${slug}`}>
			<div className='relative flex flex-col min-w-0 break-words  w-full mb-6 shadow-xl border border-gray-100 rounded-lg bg-blue-500 hover:shadow-2xl hover:cursor-pointer'>
				<div className='aspect-w-5 aspect-h-3'>
					<ContentfulImage
						layout={'fill'}
						className='w-full align-middle rounded-t-lg object-cover'
						src={coverImage.url}
					/>
				</div>
				<div className='relative p-8 mb-6'>
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
						<a className='hover:underline'>{title}</a>
					</h4>
					<div className='text-md font-light mt-2 text-white'>
						{excerpt}
					</div>
					<div className='pt-7 text-white'>
						{author && (
							<Avatar
								name={author.name}
								picture={author.picture}
							/>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
}

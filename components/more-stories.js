import PostPreview from '../components/post-preview';

export default function MoreStories({ posts }) {
	return (
		<>
			<h2 className='mb-8 text-2xl md:text-3xl font-bold tracking-tighter leading-tight'>
				More Stories
			</h2>
			<div className='grid grid-cols-1 md:grid-cols-2 md:gap-x-10 lg:gap-x-16 gap-y-20 mb-32'>
				{posts.splice(0, 4).map((post) => (
					<PostPreview
						key={post.slug}
						title={post.title}
						coverImage={post.coverImage}
						date={post.date}
						author={post.author}
						slug={post.slug}
						excerpt={post.excerpt}
					/>
				))}
			</div>
		</>
	);
}

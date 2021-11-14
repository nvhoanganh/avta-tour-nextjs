import PostPreview from '../components/post-preview'

export default function UpcomingCompetitions({ competitions }) {
  return (
    <section>
      <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
        Upcoming Competitions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 lg:gap-x-16 gap-y-20 mb-32">
        {competitions.map((comp) => (
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
    </section>
  )
}

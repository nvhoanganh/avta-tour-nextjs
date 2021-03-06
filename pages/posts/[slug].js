import { useRouter } from 'next/router';
import Head from 'next/head';
import ErrorPage from 'next/error';
import Container from '../../components/container';
import PostBody from '../../components/post-body';
import MoreStories from '../../components/more-stories';
import Header from '../../components/header';
import PostHeader from '../../components/post-header';
import SectionSeparator from '../../components/section-separator';
import Layout from '../../components/layout';
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro';
import IndexNavbar from '../../components/Navbars/IndexNavbar.js';

export default function Post({ post, morePosts, preview }) {
	const router = useRouter();

	if (!router.isFallback && !post) {
		return <ErrorPage statusCode={404} />;
	}

	return (
		<Layout preview={preview}>
			<IndexNavbar />
			<Container>
				{router.isFallback ? (
					<PostTitle>Loading…</PostTitle>
				) : (
					<>
						<article>
							<Head>
								<title>{post.title} | AVTA.</title>
								<meta
									property='og:image'
									content={post.coverImage.url}
								/>
							</Head>
							<div className='max-w-5xl mx-auto'>
								<PostHeader
									title={post.title}
									coverImage={post.coverImage}
									date={post.date}
									author={post.author}
								/>
								<PostBody content={post.content} />
							</div>
						</article>

						<div className='max-w-5xl mx-auto'>
							<SectionSeparator />
						</div>

						{morePosts && morePosts.length > 0 && (
							<div className='max-w-5xl mx-auto'>
								<MoreStories posts={morePosts} />
							</div>
						)}
					</>
				)}
			</Container>
		</Layout>
	);
}

export async function getStaticProps({ params, preview = false }) {
	const data = await getPostAndMorePosts(params.slug, preview);
	return {
		props: {
			preview,
			post: data?.post ?? null,
			morePosts: data?.morePosts ?? null,
		},
		revalidate: 300
	};
}

export async function getStaticPaths() {
	const allPosts = await getAllPostsWithSlug();
	return {
		paths: allPosts?.map(({ slug }) => `/posts/${slug}`) ?? [],
		fallback: true,
	};
}

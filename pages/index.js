import Container from '../components/container';
import MoreStories from '../components/more-stories';
import HeroPost from '../components/hero-post';
import Intro from '../components/intro';
import Layout from '../components/layout';
import { getAllPostsForHome, getAllPlayers } from '../lib/api';
import Head from 'next/head';

export default function Index({ preview, allPosts, allPlayers }) {
	const heroPost = allPosts[0];
	const morePosts = allPosts.slice(1);

	console.log('players', allPlayers);
	console.log('posts', morePosts);

	return (
		<>
			<Layout preview={preview}>
				<Head>
					<title>
						AVTA - Australia Vietnamese Tennis Association
					</title>
				</Head>
				<Container>
					<Intro />
					{heroPost && (
						<HeroPost
							title={heroPost.title}
							coverImage={heroPost.coverImage}
							date={heroPost.date}
							author={heroPost.author}
							slug={heroPost.slug}
							excerpt={heroPost.excerpt}
						/>
					)}
					{morePosts.length > 0 && <MoreStories posts={morePosts} />}
				</Container>
			</Layout>
		</>
	);
}

export async function getStaticProps({ preview = false }) {
	const allPosts = (await getAllPostsForHome(preview)) ?? [];
	const allPlayers = (await getAllPlayers(preview)) ?? [];
	return {
		props: { preview, allPosts, allPlayers },
		revalidate: 60,
	};
}

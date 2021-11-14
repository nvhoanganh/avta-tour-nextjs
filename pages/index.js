import Container from '../components/container';
import MoreStories from '../components/more-stories';
import HeroPost from '../components/hero-post';
import CompetitionPreview from '../components/competition-preview';
import Intro from '../components/intro';
import Layout from '../components/layout';
import {
	getAllCompetitionsForHome,
	getAllPostsForHome,
	getAllPlayers,
	getTop10Players,
} from '../lib/api';
import Head from 'next/head';
import Navbar from '../components/Navbars/AuthNavbar.js';

export default function Index({
	preview,
	allPosts,
	allPlayers,
	competittions,
}) {
	const heroPost = allPosts[0];
	const upcomingCompetition = competittions[0];
	const morePosts = allPosts.slice(1);

	console.log('players', allPlayers);
	console.log('posts', morePosts);
	console.log('competittions', competittions);

	return (
		<>
			<Layout preview={preview}>
				<Head>
					<title>
						AVTA - Australia Vietnamese Tennis Association
					</title>
				</Head>

				<Navbar />
				<Intro />

				

				<Container>
					{upcomingCompetition && (
						<CompetitionPreview {...upcomingCompetition} />
					)}

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
	const allPlayers = (await getTop10Players(preview)) ?? [];
	const competittions = (await getAllCompetitionsForHome(preview)) ?? [];

	return {
		props: { preview, allPosts, allPlayers, competittions },
		revalidate: 60,
	};
}

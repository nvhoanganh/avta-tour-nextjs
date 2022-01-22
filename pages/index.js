import React, { useEffect } from 'react';
import Container from '../components/container';
import MoreStories from '../components/more-stories';
import ContentfulImage from '../components/contentful-image';
import HeroPost from '../components/hero-post';
import CompetitionPreview from '../components/competition-preview';
import PostPreview from '../components/post-preview';
import Top10Players from '../components/top10players';
import TopSponsors from '../components/sponsors';
import Intro from '../components/intro';
import Layout from '../components/layout';
import CoverImage from '../components/cover-image';
import {
	getAllCompetitionsForHome,
	getAllPostsForHome,
	getAllPlayers,
	getTop10Players,
	getAllSponsors,
} from '../lib/api';
import Head from 'next/head';
import Navbar from '../components/Navbars/AuthNavbar.js';
import Link from 'next/link';
import { useFirebaseAuth } from '../components/authhook';
import { mergeUsersAndPlayersData } from "../lib/backendapi";

export default function Index({
	preview,
	allPosts,
	allPlayers,
	allSponsors,
	competittions,
}) {
	const { user } = useFirebaseAuth();

	const heroPost = allPosts[0];
	const upcomingCompetition = competittions[0];
	const morePosts = allPosts.slice(1);

	return (
		<>
			<Layout preview={preview}>
				<Head>
					<title>
						AVTA - Australia Vietnamese Tennis Association
					</title>
					<script type="text/javascript" src="/newrelic.js">
					</script>
				</Head>
				<Navbar />
				<Intro upcomingCompetition={upcomingCompetition} />

				<section className='container mx-auto mt-12'>
					<div className='flex flex-wrap items-center'>
						<div className='w-10/12 md:w-6/12 lg:w-4/12 md:px-4 mr-auto ml-auto -mt-32'>
							<HeroPost {...heroPost} />
						</div>

						<div className='w-full md:w-6/12 px-4'>
							<MoreStories posts={morePosts} />
						</div>
					</div>
				</section>

				<section className='pt-20 pb-40'>
					<TopSponsors sponsors={allSponsors} />
				</section>

				<section className='pb-40'>
					<Top10Players allPlayers={allPlayers} />
				</section>

			</Layout>
		</>
	);
}

export async function getStaticProps({ preview = false }) {
	const allPosts = (await getAllPostsForHome(preview)) ?? [];
	let allPlayers = (await getTop10Players(preview)) ?? [];
	allPlayers = await mergeUsersAndPlayersData(allPlayers);
	const allSponsors = (await getAllSponsors(preview)) ?? [];
	const competittions = (await getAllCompetitionsForHome(preview)) ?? [];

	return {
		props: { preview, allPosts, allPlayers, competittions, allSponsors },
		revalidate: 60
	};
}

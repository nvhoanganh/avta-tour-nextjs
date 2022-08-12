import React, { useEffect } from 'react';
import Container from '../components/container';
import MoreStories from '../components/more-stories';
import ContentfulImage from '../components/contentful-image';
import HeroPost from '../components/hero-post';
import CompetitionPreview from '../components/competition-preview';
import PostPreview from '../components/post-preview';
import PastChampions from '../components/pastChampions';
import TopSponsors from '../components/sponsors';
import Intro from '../components/intro';
import Layout from '../components/layout';
import CoverImage from '../components/cover-image';
import {
	getAllCompetitionsForHome,
	getAllPostsForHome,
	getAllPlayers,
	getPastChampions,
	getAllSponsors,
	getSponsorPlayers
} from '../lib/api';
import Head from 'next/head';
import Navbar from '../components/Navbars/AuthNavbar.js';
import Link from 'next/link';
import { useFirebaseAuth } from '../components/authhook';
import { mergeUsersAndRegisteredPlayers, getLinkedUsers } from "../lib/backendapi";
import { getLastChampions } from "../lib/browserapi";

export default function Index({
	preview,
	allPosts,
	allSponsors,
	competittions,
	champions,
	playerSponsors
}) {
	const { user } = useFirebaseAuth();
	const heroPost = allPosts[0];
	const upcomingCompetition = competittions[competittions.length - 1];
	const morePosts = allPosts.slice(1);

	return (
		<>
			<Layout preview={preview}>
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
					<TopSponsors sponsors={allSponsors} playerSponsors={playerSponsors} />
				</section>

				<section className='pb-40'>
					<PastChampions champions={champions} />
				</section>

			</Layout>
		</>
	);
}

export async function getStaticProps({ preview = false }) {
	const allPosts = (await getAllPostsForHome(preview)) ?? [];
	const allSponsors = (await getAllSponsors(preview)) ?? [];
	let playerSponsors = (await getSponsorPlayers(preview)) ?? [];
	// merge
	playerSponsors = playerSponsors.map(player => ({
		...player.player,
		competitionsSponsored: player.competitionsSponsored
	}));

	const competittions = (await getAllCompetitionsForHome(preview)) ?? [];

	// get list of registered players
	const allRegisteredUsers = (await getLinkedUsers()) ?? [];

	const data = (await getPastChampions(preview)) ?? [];
	const champions = await mergeUsersAndRegisteredPlayers(getLastChampions(data), allRegisteredUsers);
	playerSponsors = await mergeUsersAndRegisteredPlayers(playerSponsors, allRegisteredUsers);

	return {
		props: { preview, allPosts, competittions, allSponsors, champions, playerSponsors },
		revalidate: 60
	};
}

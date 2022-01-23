import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import ErrorPage from 'next/error';
import ContentfulImage from '../../components/contentful-image';
import Container from '../../components/container';
import PlayersCard from '../../components/Cards/PlayersCard';
import PlayersTable from '../../components/Cards/PlayersTable';
import PostBody from '../../components/post-body';
import MoreStories from '../../components/more-stories';
import Header from '../../components/header';
import PostHeader from '../../components/post-header';
import Layout from '../../components/layout';
import { getAllPlayers } from '../../lib/api';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro2';
import IndexNavbar from '../../components/Navbars/IndexNavbar.js';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import TournamentsTable from '../../components/Cards/TournamentsTable.js';
import TournamentsCard from '../../components/Cards/TournamentsCard.js';
import { mergeUsersAndPlayersData } from "../../lib/backendapi";

export default function Players({ allPlayers, preview }) {
	const router = useRouter();

	return (
		<Layout preview={preview}>
			<Navbar transparent />

			{router.isFallback ? (
				<PostTitle>Loading…</PostTitle>
			) : (
				<>
					<article>
						<Head>
							<title>Players | AVTA.</title>
						</Head>
					</article>

					<main className='profile-page'>
						<Intro
							title='AVTA Players'
							bgImg='https://unsplash.com/photos/RNiK93wcz-U/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8dGVubmlzJTIwcGxheWVyc3x8MHx8fHwxNjQyMDUxNDk2&force=true&w=1920'
						>
							<div className='w-full mb-12'>
								<div className='hidden container mx-auto md:block px-4'>
									<PlayersTable
										players={allPlayers}
									/>
								</div>
								<div className='md:hidden px-2 mx-auto'>
									<PlayersCard allPlayers={allPlayers} />
								</div>
							</div>
						</Intro>
					</main>
				</>
			)}
		</Layout>
	);
}

export async function getServerSideProps({ params, preview = false }) {
	let allPlayers = (await getAllPlayers(preview)) ?? [];
	allPlayers = await mergeUsersAndPlayersData(allPlayers);

	return {
		props: {
			preview,
			allPlayers
		},
		// revalidate: 60
	};
}



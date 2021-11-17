import { useRouter } from 'next/router';
import Head from 'next/head';
import ErrorPage from 'next/error';
import ContentfulImage from '../../components/contentful-image';
import Container from '../../components/container';
import PostBody from '../../components/post-body';
import MoreStories from '../../components/more-stories';
import Header from '../../components/header';
import PostHeader from '../../components/post-header';
import Layout from '../../components/layout';
import { getAllCompetitionsForHome } from '../../lib/api';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro2';
import IndexNavbar from '../../components/Navbars/IndexNavbar.js';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import TournamentsTable from '../../components/Cards/TournamentsTable.js';
import TournamentsCard from '../../components/Cards/TournamentsCard.js';

export default function Competitions({ competitions, preview }) {
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
							<title>Competitions | AVTA.</title>
						</Head>
					</article>

					<main className='profile-page'>
						<Intro
							title='AVTA Tournaments'
							bgImg='https://unsplash.com/photos/HkN64BISuQA/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjM2OTU1MTkw&force=true&w=1920'
						>
							<div className='w-full mb-12'>
								<div className='hidden container mx-auto md:block px-4'>
									<TournamentsTable
										competitions={competitions}
									/>
								</div>
								<div className='md:hidden px-2 mx-auto'>
									<TournamentsCard
										competitions={competitions}
									/>
								</div>
							</div>
						</Intro>
					</main>
				</>
			)}
		</Layout>
	);
}

export async function getStaticProps({ params, preview = false }) {
	const data = await getAllCompetitionsForHome(preview);
	return {
		props: {
			preview,
			competitions: data,
		},
	};
}

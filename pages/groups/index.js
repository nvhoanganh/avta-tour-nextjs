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
import { getAllGroups } from '../../lib/backendapi';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro2';
import IndexNavbar from '../../components/Navbars/IndexNavbar.js';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import GroupsTable from '../../components/Cards/GroupsTable';
import TournamentsCard from '../../components/Cards/TournamentsCard.js';

export default function Groups({ groups, preview }) {
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
							<title>Groups | AVTA.</title>
						</Head>
					</article>

					<main className='profile-page'>
						<Intro
							title='AVTA Groups'
							bgImg='https://unsplash.com/photos/HkN64BISuQA/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjM2OTU1MTkw&force=true&w=1920'
						>
							<div className='w-full mb-12'>
								<div className='hidden container mx-auto md:block px-4'>
									<GroupsTable
										groups={groups}
									/>
								</div>
								<div className='md:hidden px-2 mx-auto'>
									{/* <TournamentsCard
										competitions={competitions}
									/> */}
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
	const data = await getAllGroups();
	console.log("🚀 ~ file: index.js ~ line 63 ~ getStaticProps ~ data", data);


	return {
		props: {
			preview,
			groups: data,
		},
		revalidate: 60
	};
}

import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/layout';
import { getAllLadders } from '../../lib/backendapi';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro2';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import LaddersTable from '../../components/Cards/LaddersTable';

export default function Groups({ ladders, preview }) {
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
							<title>Ladders | AVTA.</title>
						</Head>
					</article>

					<main className='profile-page'>
						<Intro
							title='AVTA Ladders'
							bgImg='https://unsplash.com/photos/HkN64BISuQA/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjM2OTU1MTkw&force=true&w=1920'
						>
							<div className='w-full mb-12'>
								<div className='hidden container mx-auto md:block px-4'>
									<LaddersTable
										ladders={ladders}
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
	const data = await getAllLadders();

	return {
		props: {
			preview,
			ladders: data,
		},
		revalidate: 60
	};
}

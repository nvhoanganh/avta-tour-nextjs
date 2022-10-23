import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/layout';
import { getAllLadders } from '../../lib/backendapi';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro2';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import LaddersTable from '../../components/Cards/LaddersTable';
import LaddersCard from '../../components/Cards/LadderCard';

export default function Groups({ ladders, inactiveLadders, preview }) {
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
							title='Ladders'
							bgImg='https://unsplash.com/photos/HkN64BISuQA/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjM2OTU1MTkw&force=true&w=1920'
						>
							<div className='w-full mb-12'>
								<div className='hidden container mx-auto md:block px-4'>
									<div className='pb-2'>
										<LaddersTable
											title='Active Ladders'
											ladders={ladders}
										/>
									</div>
									<div className='pb-20'>
										<a className='bg-gray-50 text-gray-600 font-bold uppercase text-xs px-3 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150
                            disabled:cursor-wait whitespace-nowrap cursor-pointer
                                     disabled:bg-gray-200'
											href={`/ladders/edit/newladder`}
										>
											<i className="fas fa-plus"></i> New Ladder
										</a>
									</div>
									<div className='pb-6'>
										<div className='uppercase text-xl py-5 text-center'>Upcoming & Completed Ladders</div>
										<LaddersTable
											title='Ladders'
											ladders={inactiveLadders}
										/>
									</div>
								</div>
								<div className='md:hidden px-2 mx-auto'>
									<LaddersCard
										ladders={ladders}
									/>
									<div className='text-right mr-4 pb-16'>
										<a className='bg-gray-50 text-gray-600 font-bold uppercase text-xs px-3 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150
                            disabled:cursor-wait whitespace-nowrap cursor-pointer
                                     disabled:bg-gray-200'
											href={`/ladders/edit/newladder`}
										>
											<i className="fas fa-plus"></i> New Ladder
										</a>
									</div>
									<div className='pb-6'>
										<div className='uppercase text-xl pt-10 pb-2 text-center'>Completed Ladders</div>
										<LaddersCard
											ladders={inactiveLadders}
										/>
									</div>
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
	const activeLadders = data.filter(x => new Date() >= new Date(x.startDate) && new Date() <= new Date(x.endDate))
	const inactiveLadders = data.filter(x => new Date() > new Date(x.endDate) || new Date() < new Date(x.startDate))

	return {
		props: {
			preview,
			ladders: activeLadders,
			inactiveLadders: inactiveLadders,
		},
		revalidate: 60
	};
}

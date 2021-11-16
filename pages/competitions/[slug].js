import { useRouter } from 'next/router';
import Head from 'next/head';
import ErrorPage from 'next/error';
import ContentfulImage from '../../components/contentful-image';
import DateComponent from '../../components/date';
import Container from '../../components/container';
import PostBody from '../../components/post-body';
import MoreStories from '../../components/more-stories';
import Header from '../../components/header';
import PostHeader from '../../components/post-header';
import SectionSeparator from '../../components/section-separator';
import Layout from '../../components/layout';
import { getAllCompetitionsForHome, getCompetitionBySlug } from '../../lib/api';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro';
import IndexNavbar from '../../components/Navbars/IndexNavbar.js';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import TeamsCard from '../../components/Cards/TeamsCard.js';

export default function Competition({ competition, preview }) {
	const router = useRouter();

	if (!router.isFallback && !competition) {
		return <ErrorPage statusCode={404} />;
	}

	const teamJoined = competition.teamsCollection?.items?.length || 0;

	const totalPoints = competition.teams.reduce((previousTotal, team) => {
		return (
			previousTotal +
			team.playersCollection.items[0].avtaPoint +
			team.playersCollection.items[1].avtaPoint
		);
	}, 0);

	return (
		<Layout preview={preview}>
			<Navbar transparent />

			{router.isFallback ? (
				<PostTitle>Loading…</PostTitle>
			) : (
				<>
					<article>
						<Head>
							<title>
								{competition.title} - Max {competition.maxPoint}{' '}
								Point | AVTA.
							</title>
							<meta
								name='description'
								content={`Australia Vietnamese Tennis Association - ${competition.title} - Max ${competition.maxPoint} - Date: ${competition.date} - ${competition.excerpt}`}
							/>
							<meta
								property='og:image'
								content={competition.heroImage?.url}
							/>
						</Head>
					</article>

					<main className='profile-page'>
						<main className='profile-page'>
							<section className='relative block h-500-px'>
								<div
									className='absolute top-0 w-full h-full bg-center bg-cover'
									style={{
										backgroundImage:
											"url('" +
											(competition.heroImage?.url ||
												'https://unsplash.com/photos/HkN64BISuQA/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjM2OTU1MTkw&force=true&w=1920') +
											"')",
									}}
								>
									<span
										id='blackOverlay'
										className='w-full h-full absolute opacity-50 bg-black'
									></span>
								</div>
								<div
									className='top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px'
									style={{ transform: 'translateZ(0)' }}
								>
									<svg
										className='absolute bottom-0 overflow-hidden'
										xmlns='http://www.w3.org/2000/svg'
										preserveAspectRatio='none'
										version='1.1'
										viewBox='0 0 2560 100'
										x='0'
										y='0'
									>
										<polygon
											className='text-gray-200 fill-current'
											points='2560 0 2560 100 0 100'
										></polygon>
									</svg>
								</div>
							</section>
							<section className='relative py-16 bg-gray-200'>
								<div className='container mx-auto px-4'>
									<div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64'>
										<div className='px-6'>
											<div className='flex flex-wrap justify-center'>
												<div className='w-full lg:w-3/12 px-4 lg:order-2 flex justify-center'>
													<div className='relative'>
														<div className='rounded-full shadow-xl text-green-900 bg-gray-100 h-auto align-middle border border-gray-300 absolute -m-20 -ml-20 lg:-ml-16 max-w-300-px text-4xl p-6 text-center'>
															<i className='fas fa-trophy text-6xl text-yellow-400'></i>
															{
																competition.maxPoint
															}
														</div>
													</div>
												</div>

												{competition.active ? (
													<div className='w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center'>
														<div className='py-6 px-3 mt-32 sm:mt-0'>
															<a
																href={
																	competition.applicationGForm
																}
																target='_blank'
																className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
															>
																Apply Now
															</a>
														</div>
													</div>
												) : null}

												<div className='w-full lg:w-4/12 px-4 lg:order-1'>
													<div className='flex justify-center py-4 lg:pt-4 pt-8'>
														<div className='mr-4 p-3 text-center'>
															<span className='text-xl font-bold block uppercase tracking-wide text-gray-600'>
																{teamJoined}
															</span>
															<span className='text-sm text-gray-400'>
																Teams
															</span>
														</div>
														<div className='mr-4 p-3 text-center'>
															<span className='text-xl font-bold block uppercase tracking-wide text-green-700'>
																{teamJoined > 0
																	? (
																			totalPoints /
																			teamJoined
																	  ).toFixed(
																			2
																	  )
																	: '-'}
															</span>
															<span className='text-sm text-gray-400'>
																Avg Point
															</span>
														</div>
														<div className='lg:mr-4 p-3 text-center'>
															<span className='text-xl font-bold block uppercase tracking-wide text-red-600'>
																{16 -
																	teamJoined}
															</span>
															<span className='text-sm text-gray-400'>
																Spots Remaining
															</span>
														</div>
													</div>
												</div>
											</div>

											<div className='text-center mt-10'>
												<h3 className='text-4xl font-semibold leading-normal mb-2 text-gray-700 mb-2'>
													{competition.title}
												</h3>
												<div className='text-sm leading-normal mt-0 mb-2 text-gray-400 font-bold uppercase'>
													<i className='fas fa-map-marker-alt mr-2 text-lg text-gray-400'></i>{' '}
													{competition.club},{' '}
													<DateComponent
														dateString={
															competition.date
														}
													/>
												</div>
											</div>

											<h2 className='mb-8 mt-10 text-2xl md:text-3xl font-bold tracking-tighter leading-tight mx-auto'>
												Registered Teams
											</h2>

											<div className='mx-auto mt-3'>
												<TeamsCard
													teams={competition.teams}
												/>
											</div>

											<div className='mt-10 py-10 border-t border-gray-200 text-center'>
												<div className='flex flex-wrap justify-center'>
													<div className='w-full lg:w-9/12 px-4'>
														<a
															href='#pablo'
															className='font-normal text-blue-500'
															onClick={(e) =>
																e.preventDefault()
															}
														>
															Show Results
														</a>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>
						</main>
					</main>
				</>
			)}
		</Layout>
	);
}

export async function getStaticProps({ params, preview = false }) {
	const data = await getCompetitionBySlug(params.slug, preview);
	return {
		props: {
			preview,
			competition: data,
		},
	};
}

export async function getStaticPaths() {
	const all = await getAllCompetitionsForHome();
	return {
		paths: all?.map(({ slug }) => `/competitions/${slug}`) ?? [],
		fallback: true,
	};
}

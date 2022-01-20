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
import {
	getAllPostsWithSlug,
	getAllPlayers,
	getPlayerByNickName,
	getPostAndMorePosts,
} from '../../lib/api';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro';
import IndexNavbar from '../../components/Navbars/IndexNavbar.js';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import SendOtp from '../../components/sendotp';
import { useFirebaseAuth } from '../../components/authhook';
import { useState } from 'react'

export default function Player({ player, preview }) {
	const router = useRouter();
	const [showOtp, setShowOtp] = useState(false);
	const { user } = useFirebaseAuth();

	const claimProfile = () => {
		if (!user) {
			router.push('/auth/login');
		} else {
			setShowOtp(true);
		}
	}

	if (!router.isFallback && !player) {
		return <ErrorPage statusCode={404} />;
	}

	return (
		<Layout preview={preview}>
			<Navbar transparent />

			{router.isFallback ? (
				<PostTitle>Loading…</PostTitle>
			) : (
				<>
					<article>
						<Head>
							<title>{player.fullName} | AVTA.</title>
							<meta
								property='og:image'
								content={player.coverImage?.url}
							/>
						</Head>
					</article>

					<main className='profile-page'>
						<section className='relative block h-500-px'>
							<div
								className='absolute top-0 w-full h-full bg-center bg-cover'
								style={{
									backgroundImage:
										"url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
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
													{player.coverImage?.url ? (
														<div className='rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px'>
															<ContentfulImage
																width={250}
																height={250}
																className='rounded-full'
																src={
																	player
																		.coverImage
																		.url
																}
															/>
														</div>
													) : (
														<img
															alt={player.fullName}
															src='https://via.placeholder.com/150'
															className='rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px'
														/>
													)}
												</div>
											</div>
											<div className='w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center'>
												<div className='py-6 px-3 mt-32 sm:mt-0'>
													{/* <button
														className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
														type='button'
													>
														Connect
													</button> */}
												</div>
											</div>
											<div className='w-full lg:w-4/12 px-4 lg:order-1'>
												<div className='flex justify-center py-4 lg:pt-4 pt-8'>
													<div className='mr-4 p-3 text-center'>
														<span className='text-xl font-bold block uppercase tracking-wide text-gray-600'>
															22
														</span>
														<span className='text-sm text-gray-400'>
															Matches
														</span>
													</div>
													<div className='mr-4 p-3 text-center'>
														<span className='text-xl font-bold block uppercase tracking-wide text-gray-600'>
															10
														</span>
														<span className='text-sm text-gray-400'>
															Win
														</span>
													</div>
													<div className='lg:mr-4 p-3 text-center'>
														<span className='text-xl font-bold block uppercase tracking-wide text-gray-600'>
															12
														</span>
														<span className='text-sm text-gray-400'>
															Loss
														</span>
													</div>
												</div>
											</div>
										</div>
										<div className='text-center mt-12'>
											<h3 className='text-4xl font-semibold leading-normal mb-2 text-gray-700 mb-2'>
												{player.fullName}
											</h3>
											<div className='text-sm leading-normal mt-0 mb-2 text-gray-400 font-bold uppercase'>
												<i className='fas fa-map-marker-alt mr-2 text-lg text-gray-400'></i>{' '}
												{player.homeClub ||
													'Unknown Club'}
											</div>
											<div className='mb-20 text-green-900 mt-10 text-6xl font-bold'>
												{player.avtaPoint}
											</div>
										</div>
										{
											player?.mobileNumber && !showOtp
											&& <div className='mt-10 py-10 border-t border-gray-200 text-center'>
												<div className='flex flex-wrap justify-center'>
													<div className='w-full lg:w-9/12 px-4'>
														<a className='get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'
															onClick={claimProfile}
														>
															Claim This Player Profile
														</a>
													</div>
												</div>
											</div>
										}

										{
											showOtp
											&& <SendOtp mobileNumber={player.mobileNumber}></SendOtp>
										}
									</div>
								</div>
							</div>
						</section>
					</main>
				</>
			)}
		</Layout>
	);
}

export async function getStaticProps({ params, preview = false }) {
	const data = await getPlayerByNickName(params.nickName, preview);
	return {
		props: {
			preview,
			player: data,
		},
		revalidate: 60
	};
}

export async function getStaticPaths() {
	const all = await getAllPlayers();
	return {
		paths: all?.map(({ nickName }) => `/players/${nickName}`) ?? [],
		fallback: true,
	};
}

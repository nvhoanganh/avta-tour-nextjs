import { useRouter } from 'next/router';
import cn from 'classnames';
import Link from 'next/link';
import Head from 'next/head';
import ErrorPage from 'next/error';
import FirebaseImage from '../../components/fb-image';
import Container from '../../components/container';
import PostBody from '../../components/post-body';
import Tabs from '../../components/tabs';
import MoreStories from '../../components/more-stories';
import Header from '../../components/header';
import PostHeader from '../../components/post-header';
import Layout from '../../components/layout';
import Spinner from '../../components/spinner';
import {
	getAllPostsWithSlug,
	getAllPlayers,
	getPlayerById,
	getPostAndMorePosts,
} from '../../lib/api';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro';
import IndexNavbar from '../../components/Navbars/IndexNavbar.js';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import SendOtp from '../../components/sendotp';
import { useFirebaseAuth } from '../../components/authhook';
import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase';
import { findLinkedUsers } from '../../lib/backendapi';
import { getEmbedUrl } from '../../lib/browserapi';
import { setDoc, query, collection, doc, getDocs, getDoc, where } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UNCLAIMED = 'UNCLAIMED';
const UNCLAIMED_BUT_USER_ALREADY_CLAIMED = 'UNCLAIMED_BUT_USER_ALREADY_CLAIMED';
const CLAIMED_BY_OTHER = 'CLAIMED_BY_OTHER';
const CLAIMED_BY_ME = 'CLAIMED_BY_ME';
const NOT_LOGGEDIN_UNCLAIMED = 'NOT_LOGGEDIN_UNCLAIMED';
const NOT_LOGGEDIN_CLAIMED = 'NOT_LOGGEDIN_CLAIMED';

export default function Player({ player, preview }) {
	const router = useRouter();
	const [showOtp, setShowOtp] = useState(false);
	const [showMobile, setShowMobile] = useState(false);
	const [playerStatus, setPlayerStatus] = useState(null);
	const [successfullyClaimed, setSuccessfullyClaimed] = useState(false);
	const { user, loadingAuth } = useFirebaseAuth();

	useEffect(async () => {
		if (loadingAuth) {
			return;
		}

		const q = query(collection(db, "users"), where("playerId", "==", player?.sys?.id));
		const querySnapshot = await getDocs(q);
		const claimedPlayer = querySnapshot.size > 0 ? querySnapshot.docs[0].data() : null;

		if (user) {
			if (!claimedPlayer) {
				const docRef = doc(db, "users", user.uid);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists() && docSnap.data().playerId) {
					setPlayerStatus(UNCLAIMED_BUT_USER_ALREADY_CLAIMED);
				} else {
					setPlayerStatus(UNCLAIMED);
				}
			} else {
				if (claimedPlayer.uid === user.uid) {
					setPlayerStatus(CLAIMED_BY_ME);
				} else {
					setPlayerStatus(CLAIMED_BY_OTHER);
				}
			}
		} else {
			if (!claimedPlayer) {
				setPlayerStatus(NOT_LOGGEDIN_UNCLAIMED);
			} else {
				setPlayerStatus(NOT_LOGGEDIN_CLAIMED);
			}
		}
	}, [user, loadingAuth]);

	const claimProfile = () => {
		if (!user) {
			localStorage.setItem('redirectAfterLogin', window.location.pathname);
			router.push('/auth/login?reason=claimprofile');
		} else {
			setShowOtp(true);
		}
	}

	const sendMessageToPlayer = () => {
		if (!user) {
			localStorage.setItem('redirectAfterLogin', window.location.pathname);
			router.push('/auth/login?reason=messagemember');
		} else {
			setShowMobile(true);
		}
	}

	const profileClaimed = async () => {
		const docRef = doc(db, "users", user.uid);
		const docSnap = await getDoc(docRef);
		const updated = docSnap.exists() ?
			{ ...docSnap.data(), uid: user.uid, playerId: player?.sys?.id } :
			{ uid: user.uid, playerId: player?.sys?.id };

		await setDoc(docRef, updated);

		setShowOtp(false);
		setPlayerStatus(CLAIMED_BY_ME);

		toast("Profile successfully linked");
	}

	if (!router.isFallback && !player) {
		return <ErrorPage statusCode={404} />;
	}

	return (
		<Layout preview={preview}>
			<ToastContainer />
			<Navbar transparent />

			{router.isFallback ? (
				<PostTitle>Loading???</PostTitle>
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
													<div className='rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px'>
														<FirebaseImage
															width={250}
															height={250}
															className='rounded-full'
															src={
																player.photoURL || player.coverImage?.url || 'https://via.placeholder.com/120'}
														/>
													</div>
												</div>
											</div>
											<div className='w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center'>
												<div className='py-6 px-3 mt-32 sm:mt-0'>
												</div>
											</div>
											<div className='w-full lg:w-4/12 px-4 lg:order-1'>
												{/* <div className='flex justify-center py-4 lg:pt-4 pt-8'>
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
												</div> */}
											</div>
										</div>
										<div className='text-center mt-12'>
											<h3 className='text-4xl font-semibold leading-normal mb-2 text-gray-700 mb-2'>
												{player.fullName}

												{
													playerStatus === CLAIMED_BY_OTHER
													&& <i title="Profile claimed" title="Profile is claimed" className="far text-blue-500 fa-id-badge text-sm pl-2"></i>
												}
											</h3>
											{
												player.fullName !== player.nickName
												&& <h3 className='text-xl leading-normal mb-2 text-gray-700 mb-2'>
													({player.nickName})
												</h3>
											}
											<div className='text-lg leading-normal mt-0 mb-2 text-gray-400'>
												{
													player.suburb
													&& <>
														Live in {player.suburb}.&nbsp;
													</>
												}

												{player.homeClub && <>
													Play at {player.homeClub}
												</>}

											</div>
											<div className='leading-normal text-sm mt-5 mb-2 text-gray-700'>
												{
													player.playStyle
													&& <>
														Play Style: {player.playStyle}.&nbsp;
													</>
												}

												{player.perfectPartner && <>
													Perfect Partner: {player.perfectPartner}.
												</>}

											</div>
											<div
												className={cn('mb-20 mt-10 text-6xl font-bold', {
													'text-green-600': !player?.unofficialPoint,
													'text-red-600': player?.unofficialPoint,
												})}
											>
												{player?.avtaPoint} pt.
												{
													player?.unofficialPoint && <div className='text-sm pt-3'>Unofficial</div>
												}
												{
													player?.pointChangeLog && <div className='text-sm italic pt-3  font-normal text-gray-500'><i className="fas fa-history"></i> {player?.pointChangeLog}</div>
												}
											</div>
										</div>

										{
											player.aboutMe
											&& <div className="mt-10 text-center">
												<div className="flex flex-wrap justify-center">
													<div className="w-full lg:w-9/12 px-4">
														<p className="mb-4 text-lg leading-relaxed text-gray-700 italic">
															"{player.aboutMe}"
														</p>
													</div>
												</div>
											</div>
										}

										<div className='mt-10 py-10 text-center'>
											<div className='flex flex-wrap justify-center'>
												<div className='w-full lg:w-9/12 px-4'>
													{
														playerStatus === null &&
														<div className='text-center'><Spinner color="blue"></Spinner> Loading...</div>
													}

													{
														successfullyClaimed
														&& <div className="text-center text-lg py-6 text-green-700">You have successfully claimed this player profile</div>
													}

													{
														player?.mobileNumber && (playerStatus === UNCLAIMED || playerStatus === NOT_LOGGEDIN_UNCLAIMED)
														&&
														<a className='get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'
															onClick={claimProfile}
														>
															Claim This Player Profile
														</a>
													}

													{
														!player?.mobileNumber && (playerStatus === UNCLAIMED || playerStatus === NOT_LOGGEDIN_UNCLAIMED) && user
														&&
														<a className='text-red-600'
														>
															This player has no mobile number configured. If you're trying to claim this player's profile, contact our administrators and get your mobile number added first.
														</a>
													}


													{
														playerStatus === CLAIMED_BY_ME
														&&
														<Link href='/editmyprofile'>
															<a className='get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'
															>
																Edit Profile
															</a>
														</Link>
													}

													{showMobile &&
														<div className="mt-10 py-10 text-center">
															<div className="flex flex-wrap justify-center">
																<div className="w-full lg:w-9/12 px-4">
																	<p className="mb-4 text-lg leading-relaxed text-gray-700">
																		Contact Me at:
																	</p>

																	{player.mobileNumber &&
																		<p className="mb-4 text-lg leading-relaxed text-gray-700">
																			<i className="fas fa-mobile-alt mx-2 text-green-600"></i> <a className="text-lg text-gray-800">{player.mobileNumber}</a>
																		</p>
																	}

																	{player.email &&
																		<p className="mb-4 text-lg leading-relaxed text-gray-700">
																			<i className="fas fa-envelope text-green-600"></i> <a className="text-lg text-gray-800">{player.email}</a>
																		</p>
																	}
																</div>
															</div>
														</div>}
													{
														player?.mobileNumber && (playerStatus === UNCLAIMED || playerStatus === CLAIMED_BY_OTHER || playerStatus === UNCLAIMED_BUT_USER_ALREADY_CLAIMED || playerStatus === NOT_LOGGEDIN_CLAIMED)
														&& player?.allowContact
														&& !showMobile
														&&
														<button className='get-started text-white font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'
															onClick={sendMessageToPlayer}
														>
															Show Contact Details
														</button>
													}
												</div>
											</div>
										</div>

										{
											showOtp
											&& <SendOtp mobileNumber={player.mobileNumber} playerId={player?.sys?.id} done={profileClaimed}></SendOtp>
										}

										<div className='flex flex-wrap justify-center mx-0 md:mx-10'>
											<Tabs
												titles="Skill,Results,Stats"
												contents={[
													<PlayerYoutubeVideo player={player} />,
													<PastResults player={player} />,
													<KeyStats player={player} />,
												]}
											>
											</Tabs>
										</div>
									</div>
								</div>
							</div>
						</section>
					</main>
				</>
			)
			}
		</Layout >
	);
}

function PastResults({ player }) {
	return <div>
		<div className="font-bold py-3">Tournament Results</div>
		<div className="italic">Coming soon..</div>
		<div className="font-bold py-3">Ladder Results</div>
		<div className="italic">Coming soon..</div>
	</div>
}

function KeyStats({ player }) {
	return <div>
		<div className="font-bold py-3">Match Won</div>
		<div className="italic">Coming soon..</div>
		<div className="font-bold py-3">Best Partners</div>
		<div className="italic">Coming soon..</div>
		<div className="font-bold py-3">Worst Partners</div>
		<div className="italic">Coming soon..</div>
	</div>
}

function PlayerYoutubeVideo({ player }) {
	const YoutubeEmbed = ({ url }) => (
		<iframe height="315" className="w-full" src={`https://www.youtube.com/embed/${getEmbedUrl(url)}`} title="YouTube video player" frameborder="0"
			allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
	)
	return <div className='grid grid-cols-1 md:grid-cols-2 md:gap-x-10 lg:gap-x-16 gap-y-20 mb-16'>
		{player?.forehandYoutubeVideo && <div className='font-bold py-2'>
			<div className='font-bold py-2 text-left uppercase'>Forehand</div>
			<YoutubeEmbed url={player?.forehandYoutubeVideo}></YoutubeEmbed>
		</div>}

		{player?.backhandYoutubeVideo && <div className='font-bold py-2'>
			<div className='font-bold py-2 text-left uppercase'>Backhand</div>
			<YoutubeEmbed url={player?.backhandYoutubeVideo}></YoutubeEmbed>
		</div>}

		{player?.serveYoutubeVideo && <div className='font-bold py-2'>
			<div className='font-bold py-2 text-left uppercase'>Serve</div>
			<YoutubeEmbed url={player?.serveYoutubeVideo}></YoutubeEmbed>
		</div>}

		{player?.volleyYoutubeVideo && <div className='font-bold py-2'>
			<div className='font-bold py-2 text-left uppercase'>Volley</div>
			<YoutubeEmbed url={player?.volleyYoutubeVideo}></YoutubeEmbed>
		</div>}
	</div>
}


export async function getStaticProps({ params, preview = false }) {
	let data = await getPlayerById(params.nickName, preview);
	const linkedUser = await findLinkedUsers(data.sys.id);

	if (linkedUser) {
		data = {
			...data,
			...linkedUser,
			fullName: linkedUser.displayName || data.fullName
		}
	}

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
		paths: all?.map(({ sys }) => `/players/${sys.id}`) ?? [],
		fallback: true,
	};
}

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
import { getUserProfile, createUserProfile } from '../../lib/browserapi';
import { notifyNewUserSignup, notifyWelcomeUser } from '../../lib/notificationservice';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro2';
import IndexNavbar from '../../components/Navbars/IndexNavbar.js';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import TournamentsTable from '../../components/Cards/TournamentsTable.js';
import Spinner from '../../components/spinner';
import {
	signOut,
	signInWithRedirect,
	GoogleAuthProvider,
	FacebookAuthProvider,
	signInWithPopup,
	getRedirectResult,
	getAuth,
	onAuthStateChanged,
	OAuthProvider,
} from 'firebase/auth';
import TournamentsCard from '../../components/Cards/TournamentsCard.js';
import FooterSmall from '../../components/Footers/FooterSmall.js';
import Image from 'next/image';
import Meta from '../../components/meta';
import { auth } from '../../lib/firebase';
import { useFirebaseAuth } from '../../components/authhook';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
	const { loadingAuth } = useFirebaseAuth();
	const router = useRouter();
	const { reason } = router.query;

	const [loginError, setLoginError] = useState(null);
	const [loading, setLoading] = useState(false);

	const login = async (provider) => {
		const getProvider = () => {
			switch (provider) {
				case 'google':
					return new GoogleAuthProvider();
				case 'yahoo':
					return new OAuthProvider('yahoo.com');
				case 'facebook':
					return new FacebookAuthProvider();
				case 'apple':
					return new OAuthProvider('apple.com');
				default:
					return new GoogleAuthProvider();
			}
		};

		localStorage.setItem('provider', provider);

		// Sign in using a redirect.
		const p = getProvider();

		if (provider != 'facebook') {
			// Start a sign in process for an unauthenticated user.
			if (provider == 'apple') {
				p.addScope('email');
				p.addScope('name');
			} else {
				p.addScope('profile');
				p.addScope('email');
			}
		}

		// return await signInWithRedirect(auth, p);
		setLoading(true);
		signInWithPopup(auth, p).then(async (result) => {
			const user = result.user;
			if (user) {
				const userP = await getUserProfile(user);
				if (userP) {
					setLoading(false);
					const redirectUrl = localStorage.getItem('redirectAfterLogin');
					if (redirectUrl) {
						localStorage.removeItem('redirectAfterLogin');
						router.push(redirectUrl);
					} else {
						router.push('/');
					}
				} else {
					await createUserProfile(user);
					// this is new user signup, send notification
					await notifyNewUserSignup(user);
					await notifyWelcomeUser(user);
					setLoading(false);
					// track event in Datalayer
					window.dataLayer && window.dataLayer.push({
						'event': 'new_user_signup',
						uid: user.uid,
						email: user.email,
						displayName: user.displayName
					});
					router.push('/editmyprofile');
				}
			}
		}).catch((error) => {
			setLoading(false);
			console.log("🚀 ~ file: login.js:125 ~ useEffect ~ error", error)
			setLoginError(error.message);
		});
	};

	return (
		<>
			<ToastContainer />
			<Meta />
			<Navbar transparent />

			<article>
				<Head>
					<title>Login | AVTA Tour</title>
				</Head>
			</article>

			<Navbar transparent />

			<main>
				<section className='relative w-full h-full py-40 min-h-screen'>
					<div
						className='absolute top-0 w-full h-full bg-gray-800 bg-no-repeat bg-full'
						style={{
							backgroundImage:
								'url(/assets/img/register_bg_2.png)',
						}}
					></div>

					<div className='container mx-auto px-4 h-full'>
						<div className='flex content-center items-center justify-center h-full'>
							<div className='w-full lg:w-4/12 px-4'>
								<div className='relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0'>
									<div className='rounded-t mb-0 px-3 py-6'>
										{reason && !loadingAuth &&
											<div className='text-center my-6'>
												<h6 className='text-gray-500'>
													{reason === 'claimprofile'
														&& 'You need to login before you can claim player profile'
													}
													{reason === 'createladder'
														&& 'You need to login before you can create new ladder'
													}
													{reason === 'editladder'
														&& 'You need to login before you can edit ladder'
													}
													{reason === 'apply'
														&& 'You will need to login to apply'
													}
													{reason === 'findpartner'
														&& 'You will need to login to find partner'
													}
													{reason === 'messagemember'
														&& 'You need to login before we can show player contact details'
													}
												</h6>
											</div>
										}
										<div className='text-center my-6'>
											<h6 className='text-gray-500 text-lg font-bold'>
												{loading
													? <div className='text-center'><Spinner color="blue"></Spinner> Logging in...</div>
													: 'Sign in with'}
											</h6>
										</div>
										{!loadingAuth ? (
											<div className='flex flex-col space-y-3 justify-center mb-6 mx-4'>
												<button
													onClick={() =>
														login('google')
													}
													className='bg-white active:bg-gray-50 text-gray-700 font-normal px-6 py-4 rounded-lg outline-none focus:outline-none uppercase shadow hover:shadow-md inline-flex items-center font-bold ease-linear transition-all duration-150'
													type='button'
												>
													<img
														alt='...'
														className='w-5 mr-1'
														src='/assets/img/google.svg'
													/>
													Google
												</button>
												<button
													onClick={() =>
														login('apple')
													}
													className='bg-white active:bg-gray-50 text-gray-700 font-normal px-6 py-4 rounded-lg outline-none focus:outline-none uppercase shadow hover:shadow-md inline-flex items-center font-bold ease-linear transition-all duration-150'
													type='button'
												>
													<i className="fab fa-apple mr-1 text-xl"></i>
													Apple
												</button>
												<button
													onClick={() =>
														login('yahoo')
													}
													className='bg-white active:bg-gray-50 text-gray-700 font-normal px-6 py-4 rounded-lg outline-none focus:outline-none uppercase shadow hover:shadow-md inline-flex items-center font-bold ease-linear transition-all duration-150'
													type='button'
												>
													<img
														alt='...'
														className='w-5 mr-1'
														src='/assets/img/yahoo.svg'
													/>
													Yahoo
												</button>
											</div>
										) : null}

										{loginError && (
											<div className='text-center text-red-800'>
												{loginError}
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					<FooterSmall absolute />
				</section>
			</main>

			<FooterSmall absolute />
		</>
	);
}

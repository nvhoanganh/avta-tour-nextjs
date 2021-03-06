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
	OAuthProvider,
} from 'firebase/auth';
import TournamentsCard from '../../components/Cards/TournamentsCard.js';
import FooterSmall from '../../components/Footers/FooterSmall.js';
import Image from 'next/image';
import Meta from '../../components/meta';
import { auth } from '../../lib/firebase';
import { useFirebaseAuth } from '../../components/authhook';

export default function Login() {
	const { loadingAuth } = useFirebaseAuth();
	const router = useRouter();
	const { reason } = router.query;

	const [loginError, setLoginError] = useState(null);

	const login = async (provider) => {
		const getProvider = () => {
			switch (provider) {
				case 'google':
					return new GoogleAuthProvider();
				case 'yahoo':
					return new OAuthProvider('yahoo.com');
				case 'facebook':
					return new FacebookAuthProvider();
				default:
					return new GoogleAuthProvider();
			}
		};

		localStorage.setItem('provider', provider);

		// Sign in using a redirect.
		const p = getProvider();

		if (provider != 'facebook') {
			// Start a sign in process for an unauthenticated user.
			p.addScope('profile');
			p.addScope('email');
		}

		return await signInWithRedirect(auth, p);
	};

	getRedirectResult(auth)
		.then((result) => {
			const getCredential = () => {
				const provider = localStorage.getItem('provider');
				switch (provider) {
					case 'google':
						return new GoogleAuthProvider();
					case 'yahoo':
						return new OAuthProvider('yahoo.com');
					case 'facebook':
						return new FacebookAuthProvider();
					default:
						return null;
				}
			};

			// This gives you a Facebook Access Token. You can use it to access the Facebook API.
			const credential = getCredential();
			if (!credential) return;

			const user = result?.user;
			if (user) {
				const redirectUrl = localStorage.getItem('redirectAfterLogin');
				if (redirectUrl) {
					localStorage.removeItem('redirectAfterLogin');
					router.push(redirectUrl);
				} else {
					router.push('/');
				}
			}
		})
		.catch((error) => {
			setLoginError(error.message);
		});

	return (
		<>
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
												{loadingAuth
													? <div className='text-center'><Spinner color="blue"></Spinner> Logging you in. Please wait..</div>
													: 'Sign in with'}
											</h6>
										</div>
										{!loadingAuth ? (
											<div className='flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 justify-center mb-6 mx-4 md:mx-3'>
												<button
													onClick={() =>
														login('facebook')
													}
													className='bg-white active:bg-gray-50 text-gray-700 font-normal px-6 py-4 rounded-lg outline-none focus:outline-none uppercase shadow hover:shadow-md inline-flex items-center font-bold ease-linear transition-all duration-150'
													type='button'
												>
													<img
														alt='...'
														className='w-5 mr-1'
														src='/assets/img/facebook.svg'
													/>
													Facebook
												</button>
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

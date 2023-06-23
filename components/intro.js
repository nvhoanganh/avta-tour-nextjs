import Link from 'next/link';
import CompetitionPreview from './competition-preview';
import { useFirebaseAuth } from './authhook';
import JoinOurFacebook from '../components/join-our-fb';
import Spinner from './spinner';
import { getUserProfile } from '../lib/browserapi';
import { useEffect, useState } from 'react';

export default function Intro({ upcomingCompetition }) {
	const { user, loadingAuth } = useFirebaseAuth();
	const [userProfile, setserProfile] = useState(null);
	useEffect(async () => {
		if (user) {
			const userP = await getUserProfile(user);
			setserProfile(userP);
		}
	}, [user]);
	return (
		<>
			<div className='relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-45 '>
				<div
					className='absolute top-0 w-full h-full bg-center bg-cover'
					style={{
						backgroundImage:
							"url('https://images.unsplash.com/photo-1601646761285-65bfa67cd7a3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80')",
					}}
				>
					<span
						id='blackOverlay'
						className='w-full h-full absolute opacity-40 bg-black'
					></span>
				</div>
				<div className='container relative mx-auto'>
					<div className='items-center flex flex-wrap'>
						<div className='w-full lg:w-6/12 px-4 ml-auto mr-auto text-center'>
							<div className='md:pr-12'>
								<h1 className='text-white font-semibold text-5xl'>
									Australia Vietnamese Tennis
									Association
								</h1>
								{/* <p className='mt-4 text-lg text-gray-200'>
									AVTA, Australia Vietnamese Tennis
									Association, grow together
								</p> */}
								<div className="text-center pt-12">
									{
										loadingAuth
											?
											<div className='text-center text-white'><Spinner color="white"></Spinner> Loading...</div> :
											!user ?
												<Link href='/auth/login'>
													<a className='bg-blue-600 w-9 text-white w-full mx-3 text-center text-gray-700 active:bg-gray-50 text-xs font-bold uppercase px-6 py-4 
																		rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150'>
														Join Us Today
													</a>
												</Link> :
												<div>
													<span className='mx-3 text-center text-white  px-6 py-4'>
														Welcome back, {user.displayName}!
													</span>
													{
														userProfile
															? <div className='mt-8'>
																<Link href='/editmyprofile'>
																	<a className='bg-blue-600 hover:bg-blue-800 w-9 text-white w-full mx-3 text-center text-gray-700 active:bg-gray-50 text-xs font-bold uppercase px-6 py-4 
																															rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150'>
																		{userProfile.homeClub ? 'View your profile' : 'Complete your profile'}
																	</a>
																</Link>
															</div>
															: null
													}
												</div>

									}
								</div>
							</div>
						</div>
					</div>
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
							className=' text-white fill-current'
							points='2560 0 2560 100 0 100'
						></polygon>
					</svg>
				</div>
			</div>

			<section className='pb-48 -mt-24'>
				<div className='container mx-auto px-4'>
					<div className='flex flex-wrap'>
						<div className='lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center'>
							<Link href='/competitions'>
								<div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg cursor-pointer hover:shadow-xl hover:bg-gray-100 bg-gray-50'>
									<div className='px-4 py-5 flex-auto'>
										<div className='text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400'>
											<i className='fas fa-trophy text-lg'></i>
										</div>
										<h6 className='text-xl font-semibold'>
											Tournaments
										</h6>
										<p className='mt-2 mb-4 text-gray-500'>
											View our professionally organized tennis tournaments
										</p>
									</div>
								</div>
							</Link>
						</div>

						<div className='w-full md:w-4/12 px-4 text-center'>
							<Link href='/players'>
								<div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg cursor-pointer hover:shadow-xl hover:bg-gray-100 bg-gray-50'>
									<div className='px-4 py-5 flex-auto'>
										<div className='text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400'>
											<i className='fas fa-users text-lg'></i>
										</div>
										<h6 className='text-xl font-semibold'>
											Players
										</h6>
										<p className='mt-2 mb-4 text-gray-500'>
											View and connect to AVTA players close to you
										</p>
									</div>
								</div>
							</Link>
						</div>

						<div className='pt-6 w-full md:w-4/12 px-4 text-center'>
							<Link href='/ladders'>
								<div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg cursor-pointer hover:shadow-xl hover:bg-gray-100 bg-gray-50'>
									<div className='px-4 py-5 flex-auto'>
										<div className='text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400'>
											<i className='fas fa-award text-lg'></i>
										</div>
										<h6 className='text-xl font-semibold'>
											Ladders
										</h6>
										<p className='mt-2 mb-4 text-gray-500'>
											View and join your local tennis ladder
										</p>
									</div>
								</div>
							</Link>
						</div>
					</div>

					{/* upcomingCompetition */}
					{upcomingCompetition ? (
						<CompetitionPreview {...upcomingCompetition} />
					) : <JoinOurFacebook></JoinOurFacebook>}
				</div>
			</section>
		</>
	);
}

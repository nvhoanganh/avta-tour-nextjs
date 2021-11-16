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
import SectionSeparator from '../../components/section-separator';
import Layout from '../../components/layout';
import { getAllCompetitionsForHome } from '../../lib/api';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro2';
import IndexNavbar from '../../components/Navbars/IndexNavbar.js';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import TournamentsTable from '../../components/Cards/TournamentsTable.js';
import TournamentsCard from '../../components/Cards/TournamentsCard.js';
import FooterSmall from '../../components/Footers/FooterSmall.js';
import Image from 'next/image';
import Meta from '../../components/meta';

export default function Register() {
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

					<>
						<div className='container mx-auto px-4 h-full'>
							<div className='flex content-center items-center justify-center h-full'>
								<div className='w-full lg:w-6/12 px-4'>
									<div className='relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0'>
										<div className='rounded-t mb-0 px-6 py-6'>
											<div className='text-center mb-3'>
												<h6 className='text-gray-500 text-sm font-bold'>
													Sign up with
												</h6>
											</div>
											<div className='btn-wrapper text-center'>
												<button
													className='bg-white active:bg-gray-50 text-gray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150'
													type='button'
												>
													<img
														alt='...'
														className='w-5 mr-1'
														src='/assets/img/github.svg'
													/>
													Github
												</button>
												<button
													className='bg-white active:bg-gray-50 text-gray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150'
													type='button'
												>
													<img
														alt='...'
														className='w-5 mr-1'
														src='/assets/img/google.svg'
													/>
													Google
												</button>
											</div>
											<hr className='mt-6 border-b-1 border-gray-300' />
										</div>
										<div className='flex-auto px-4 lg:px-10 py-10 pt-0'>
											<div className='text-gray-400 text-center mb-3 font-bold'>
												<small>
													Or sign up with credentials
												</small>
											</div>
											<form>
												<div className='relative w-full mb-3'>
													<label
														className='block uppercase text-gray-600 text-xs font-bold mb-2'
														htmlFor='grid-password'
													>
														Name
													</label>
													<input
														type='email'
														className='border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150'
														placeholder='Name'
													/>
												</div>

												<div className='relative w-full mb-3'>
													<label
														className='block uppercase text-gray-600 text-xs font-bold mb-2'
														htmlFor='grid-password'
													>
														Email
													</label>
													<input
														type='email'
														className='border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150'
														placeholder='Email'
													/>
												</div>

												<div className='relative w-full mb-3'>
													<label
														className='block uppercase text-gray-600 text-xs font-bold mb-2'
														htmlFor='grid-password'
													>
														Password
													</label>
													<input
														type='password'
														className='border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150'
														placeholder='Password'
													/>
												</div>

												<div>
													<label className='inline-flex items-center cursor-pointer'>
														<input
															id='customCheckLogin'
															type='checkbox'
															className='form-checkbox border-0 rounded text-gray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150'
														/>
														<span className='ml-2 text-sm font-semibold text-gray-600'>
															I agree with the{' '}
															<a
																href='#'
																className='text-blue-500'
																onClick={(e) =>
																	e.preventDefault()
																}
															>
																Privacy Policy
															</a>
														</span>
													</label>
												</div>

												<div className='text-center mt-6'>
													<button
														className='bg-gray-800 text-white active:bg-gray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150'
														type='button'
													>
														Create Account
													</button>
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>

					<FooterSmall absolute />
				</section>
			</main>

			<FooterSmall absolute />
		</>
	);
}

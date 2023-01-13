/*eslint-disable*/
import React, { useEffect } from 'react';
import Link from 'next/link';

// components

import PagesDropdown from '../Dropdowns/PagesDropdown';
import { useFirebaseAuth } from '../authhook';

export default function Navbar(props) {
	const { user, logout } = useFirebaseAuth();
	const [navbarOpen, setNavbarOpen] = React.useState(false);

	return (
		<>
			<nav className='top-0 absolute z-2 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg'>
				<div className='container px-4 mx-auto flex flex-wrap items-center justify-between'>
					<div className='w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start'>
						<Link href='/'>
							<span className='text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase'>
								<a className='hover:underline'>
									<img
										src='/assets/img/AvtaLogoSmall.png'
										alt='AVTA Tour'
										width='120'
									/>
								</a>
							</span>
						</Link>
						<button
							className='cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none'
							type='button'
							onClick={() => setNavbarOpen(!navbarOpen)}
						>
							<i className='text-white fas fa-bars'></i>
						</button>
					</div>
					<div
						className={
							'lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none z-50 bg-gray-100' +
							(navbarOpen
								? ' block rounded shadow-lg'
								: ' hidden')
						}
						id='example-navbar-warning'
					>
						<ul className='flex flex-col lg:flex-row list-none lg:ml-auto'>
							<li className='flex items-center'>
								<a
									className='lg:text-white lg:hover:text-gray-200 text-gray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold'
									href='https://www.facebook.com/groups/464135091348911'
									target='_blank'
								>
									<i className='lg:text-gray-200 text-gray-400 fab fa-facebook text-lg leading-lg ' />
									<span className='lg:hidden inline-block ml-2'>
										Share
									</span>
								</a>
							</li>

							<li className='flex items-center'>
								<a
									className='lg:text-white lg:hover:text-gray-200 text-gray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold'
									href='https://twitter.com/intent/tweet?url=http://avtatour.com&text=Join%20biggest%20Vietnamese%20Tennis%20Community%20in%20Australia%20now'
									target='_blank'
								>
									<i className='lg:text-gray-200 text-gray-400 fab fa-twitter text-lg leading-lg ' />
									<span className='lg:hidden inline-block ml-2'>
										Tweet
									</span>
								</a>
							</li>

							<li className='flex items-center'>
								<a
									className='lg:text-white lg:hover:text-gray-200 text-gray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold'
									href='https://github.com/nvhoanganh/avta-tour-nextjs'
									target='_blank'
								>
									<i className='lg:text-gray-200 text-gray-400 fab fa-github text-lg leading-lg ' />
									<span className='lg:hidden inline-block ml-2'>
										Star
									</span>
								</a>
							</li>

							<Link href='/players'>
								<a className='flex items-center lg:text-white hover:underline px-3 py-4 lg:py-2'>Players</a>
							</Link>

							<Link href='/competitions'>
								<a className='flex items-center lg:text-white hover:underline px-3 py-4 lg:py-2'>Comps</a>
							</Link>

							<Link href='/ladders'>
								<a className='flex items-center lg:text-white hover:underline px-3 py-4 lg:py-2'>Ladders</a>
							</Link>

							{
								user
								&& <Link href='/editmyprofile'>
									<a className='flex items-center lg:text-white hover:underline px-3 py-4 lg:py-2'>My Profile</a>
								</Link>
							}

							<li className='flex items-center'>
								{!user ? (
									<Link href='/auth/login'>
										<a className='bg-blue-600 text-white md:bg-gray-200 md:text-black w-full mx-3 text-center text-gray-700 active:bg-gray-50 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150'>
											<i className='fas fa-arrow-alt-circle-down'></i>{' '}
											Log in
										</a>
									</Link>
								) : (
									<a
										onClick={() => logout()}
										className=' bg-blue-600 w-full mx-3 text-center text-white md:bg-white md:text-black text-gray-700 active:bg-gray-50 text-xs font-bold px-4 py-2 rounded shadow 
										hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150'
									>
										<i className='fas fa-sign-out-alt mr-2'></i>
										Logout
									</a>
								)}
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	);
}

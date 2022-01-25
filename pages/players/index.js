import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import ErrorPage from 'next/error';
import ContentfulImage from '../../components/contentful-image';
import DropDown from '../../components/dropdown';
import Container from '../../components/container';
import PlayersCard from '../../components/Cards/PlayersCard';
import PlayersTable from '../../components/Cards/PlayersTable';
import PostBody from '../../components/post-body';
import MoreStories from '../../components/more-stories';
import Header from '../../components/header';
import PostHeader from '../../components/post-header';
import Layout from '../../components/layout';
import { getAllPlayers } from '../../lib/api';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro2';
import IndexNavbar from '../../components/Navbars/IndexNavbar.js';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import TournamentsTable from '../../components/Cards/TournamentsTable.js';
import TournamentsCard from '../../components/Cards/TournamentsCard.js';
import React, { useState, useEffect } from 'react';
import { mergeUsersAndPlayersData } from "../../lib/backendapi";

export default function Players({ allPlayers, preview }) {
	const router = useRouter();
	const [sortBy, setSortBy] = useState('Point');
	const [filter, setFilter] = useState(null);

	return (
		<Layout preview={preview}>
			<Navbar transparent />

			{router.isFallback ? (
				<PostTitle>Loading…</PostTitle>
			) : (
				<>
					<article>
						<Head>
							<title>Players | AVTA.</title>
						</Head>
					</article>

					<main className='profile-page'>
						<Intro
							title='AVTA Players'
							bgImg='https://unsplash.com/photos/RNiK93wcz-U/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8dGVubmlzJTIwcGxheWVyc3x8MHx8fHwxNjQyMDUxNDk2&force=true&w=1920'
						>
							<div className='w-full mb-12'>
								<div className='hidden container mx-auto md:block px-4'>
									<PlayersTable
										players={allPlayers}
									/>
								</div>
								<div className='md:hidden px-2 mx-auto'>
									<div className='sticky py-3 rounded-lg shadow-lg opacity-95 bg-gray-300 flex space-x-1 justify-center items-center'>
										<input type="text" className="border px-3 py-2 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-56 ease-linear transition-all duration-150" placeholder="Search Name, Club or Point"
											value={filter} onChange={(e) => { setFilter(e.target.value) }}
										/>
										<DropDown buttonText={
											<span><i class="fas fa-sort-amount-down-alt mr-1"></i>{sortBy}</span>
										}
											items={[
												<a onClick={() => setSortBy('Point')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Sort by Point</a>,

												<a onClick={() => setSortBy('Name')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Sort by Name</a>,

												<a onClick={() => setSortBy('Club')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Sort by Club</a>,
											]}
										>
										</DropDown>
									</div>
									<PlayersCard allPlayers={allPlayers} sortBy={sortBy} filter={filter} />
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
	let allPlayers = (await getAllPlayers(preview)) ?? [];
	allPlayers = await mergeUsersAndPlayersData(allPlayers);

	return {
		props: {
			preview,
			allPlayers
		},
		revalidate: 60
	};
}
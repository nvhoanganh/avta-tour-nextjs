import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'classnames';
import Head from 'next/head';
import FirebaseImage from '../../components/fb-image';
import PlayersCard from '../../components/Cards/PlayersCard';
import PlayersTable from '../../components/Cards/PlayersTable';
import Layout from '../../components/layout';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro2';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import { useFirebaseAuth } from '../../components/authhook';
import { GetMergedPlayers, CheckAndUpdateClub } from "../../lib/backendapi";
import { RevalidatePath } from "../../lib/browserapi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoogleMapReact from 'google-map-react';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from 'react';
import useFilterPlayers from '../../lib/useFilterhook';

const PlayerMarker = ({ text }) => <div><i className="fas fa-map-marker-alt text-red-700 text-3xl"></i>{text}</div>;

const ClubMarker2 = ({ lat, lng, text, onClick, count, scoreCenter }) => <span
	onClick={() => onClick(text, lat, lng)}
	title={scoreCenter ? 'AVTA Score marking club' : `View Players who play at ${text}`}
	className={cn('inline-flex items-center justify-center border h-10 w-10 rounded-full  hover:border-gray-800 hover:border-2 hover:shadow-xl hover:cursor-pointer', {
		'bg-blue-600 border-gray-900 hover:bg-blue-800': !scoreCenter,
		'bg-red-600 border-gray-700 hover:bg-red-800': scoreCenter,
	})}
>
	<span className=" text-sm leading-none text-white">{count}</span>
</span>;

export default function PlayersMap({ allPlayers, preview, clubs }) {
	const router = useRouter();
	const { user } = useFirebaseAuth();

	const refreshData = async () => {
		toast("Refreshing. Please wait...");
		await RevalidatePath(user, `/players`);
		window.location.reload();
	}

	const onClubClicked = (clubName, lat, lng) => {
		const list = clubs.filter(c => c.lat === lat && c.lng === lng);
		if (list.length > 1) {
			setClubsAtMarker(list);
			setIsOpen(true);
		} else {
			setFilter(clubName);
			setPlayerListOpen(true);
		}
	}

	const [isOpen, setIsOpen] = useState(false);
	const [isPlayerListOpen, setPlayerListOpen] = useState(false);
	const [clubsAtMarker, setClubsAtMarker] = useState([]);

	const defaultProps = {
		center: {
			lat: -37.840935,
			lng: 144.946457
		},
		zoom: 11
	};

	const {
		sortBy, setSortBy, filter, setFilter,
		avgPoint, filteredPlayers, filerPlayerStyle, setFilerPlayerStyle
	} = useFilterPlayers(allPlayers);

	return (
		<Layout preview={preview}>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title
										as="h3"
										className="text-3xl font-medium leading-6 text-gray-900 px-4 pt-5 text-center mb-14"
									>
										Clubs at this location
									</Dialog.Title>

									<div className="grid grid-cols-1 gap-x-10 gap-y-5 mb-32 mt-16 mx-5">
										{clubsAtMarker.map((club) => (
											<div
												onClick={() => {
													setIsOpen(false);
													setFilter(club.name);
													setPlayerListOpen(true);
												}}
												className="px-6 text-center flex justify-center items-center flex-row border space-x-4 p-3 rounded shadow-sm hover:bg-gray-100 hover:cursor-pointer"
												key={club.name}
											>
												<i className="fas fa-map-marker-alt text-red-600 text-3xl hover:text-red-700"></i>
												<div className=" capitalize">
													{club.name}
												</div>
											</div>
										))}
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>

			<Transition appear show={isPlayerListOpen} as={Fragment}>
				<Dialog as="div" className="relative z-50" onClose={() => setPlayerListOpen(false)}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title
										as="h3"
										className="text-3xl font-medium leading-6 text-gray-900 px-4 pt-2 text-center flex flex-col"
									>
										<div>Players at <span className='capitalize'>{filter}</span></div>

										<a className="text-sm text-gray-400 py-2 font-normal hover:underline hover:cursor-pointer"
											onClick={() => router.push(`/players?q=${encodeURIComponent(filter)}`)}
										>Click to see full list</a>

										<div className=' top-5 absolute right-5' onClick={() => setPlayerListOpen(false)}>
											<i className="fas fa-times text-gray-500 hover:cursor-pointer hover:text-gray-600"></i>
										</div>
									</Dialog.Title>

									<div className='grid grid-cols-2 md:grid-cols-3 md:gap-x-10 lg:gap-x-16 gap-y-10 pt-20 mb-16'>
										{filteredPlayers.map(x => <div key={x.sys.id} className='px-6 text-center'>
											<Link href={`/players/${x.sys.id}`}>
												<div className='mx-auto max-w-100-px cursor-pointer'>
													{
														x.photoURL || x.coverImage?.url
															? <FirebaseImage
																width={100}
																height={100}
																className='rounded-full mx-auto max-w-100-px'
																src={x.photoURL || x.coverImage?.url}
															/>
															: <span className="inline-flex items-center justify-center h-28 w-28 rounded-full bg-gray-400">
																<span className="text-xl font-medium leading-none text-white">{x.fullName.split(" ").map((n) => n[0]).join("")}</span>
															</span>
													}
												</div>
											</Link>

											<div className='pt-6 text-center'>
												<h5 className='text-xl font-bold'>
													<Link href={`/players/${x.sys.id}`}>
														<a className='hover:underline'>
															{x.fullName}
														</a>
													</Link>
												</h5>
												<p
													className={cn('mt-1 text-xl  uppercase font-semibold', {
														'text-green-600': !x.unofficialPoint,
														'text-red-600': x.unofficialPoint || x?.notInContentful,
														'text-blue-600': x.hasLadderPoint,
													})}
												>
													{x?.notInContentful ? 'N/A' : x?.avtaPoint}
												</p>
												{
													x.canMarkScore
														? <p className='text-red-500 text-sm'><i className="fas fa-user-edit text-red-600  hover:text-red-700"></i> Score Marker</p>
														: null
												}
											</div>
										</div>)}
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
			<ToastContainer />
			<Navbar transparent />

			{
				router.isFallback ? (
					<PostTitle>Loading…</PostTitle>
				) : (
					<>
						<article>
							<Head>
								<title>Players map | AVTA.</title>
							</Head>
						</article>

						<main className='profile-page'>
							<Intro
								title='Players Location'
								bgImg='https://unsplash.com/photos/vfzfavUZmfc/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjcyNTcyMjYz&force=true&w=1920'
							>
								<div className='w-full mb-12'>
									<div className='container mx-auto block px-4'>
										<div style={{ height: '70vh', width: '100%' }}>
											<GoogleMapReact
												bootstrapURLKeys={{ key: "AIzaSyCtYkMYs3wXrH_y5XjmiAZNd2UrjslujcA" }}
												defaultCenter={defaultProps.center}
												defaultZoom={defaultProps.zoom}
											>
												{/* <PlayerMarker
												lat={-37.74490216294664}
												lng={145.00393153595897}
												text="Hoang Anh"
											/> */}

												{clubs?.map(club => (
													<ClubMarker2
														lat={club.lat}
														onClick={onClubClicked}
														lng={club.lng}
														text={club.name}
														scoreCenter={club.scoreCenter}
														count={club.playersCount}
													/>
												))}

											</GoogleMapReact>
										</div>
										<div className="pt-2 flex justify-between" >
											<div className='flex flex-row items-center space-x-1'>
												<span className="inline-flex items-center justify-center border h-6 w-6 rounded-full  hover:border-gray-800 hover:border-2 hover:shadow-xl hover:cursor-pointer bg-red-600 border-gray-900"></span>
												<span>Location with AVTA Score marker
												</span>
											</div>
											<div><Link href={`/players`}>
												<a className='hover:underline font-bold'>
													<i className="fas fa-list text-blue-700"></i>
													{' '} List View
												</a>
											</Link></div>
										</div>
									</div>

								</div>
							</Intro>
						</main>
					</>
				)
			}
		</Layout >
	);
}

export async function getStaticProps({ params, preview = false }) {
	const allPlayers = await GetMergedPlayers();
	const clubs = await CheckAndUpdateClub(allPlayers);
	return {
		props: {
			preview,
			allPlayers,
			clubs
		},
		revalidate: 3600
	};
}
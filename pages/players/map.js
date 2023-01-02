import { useRouter } from 'next/router';
import Head from 'next/head';
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

const PlayerMarker = ({ text }) => <div><i className="fas fa-map-marker-alt text-red-700 text-3xl"></i>{text}</div>;

const ClubMarker = ({ lat, lng, text, onClick }) => <div
	className=' flex justify-center flex-col items-center hover:cursor-pointer hover:text-xl'
	title={`View Players who play at ${text}`}
	onClick={() => onClick(text, lat, lng)}
>
	<i className="fas fa-map-marker-alt text-red-600 text-3xl hover:text-red-700"></i>
	{/* <div className="text-indigo-800 whitespace-nowrap mapmarker hover:text-xl">
		{text}
	</div> */}
</div>;

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
			router.push(`/players?q=${encodeURIComponent(clubName)}`);
		}
	}

	const [isOpen, setIsOpen] = useState(false);
	const [clubsAtMarker, setClubsAtMarker] = useState([]);

	const defaultProps = {
		center: {
			lat: -37.840935,
			lng: 144.946457
		},
		zoom: 11
	};


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
										className="text-3xl font-medium leading-6 text-gray-900 px-4 pt-5 text-center"
									>
										Clubs at this location
										<div className="text-sm text-gray-400 py-2 font-normal">Click to see list of players</div>
									</Dialog.Title>

									<div className="grid grid-cols-1 gap-x-10 gap-y-5 mb-32 mt-12 mx-5">
										{clubsAtMarker.map((club) => (
											<div
												onClick={() => router.push(`/players?q=${encodeURIComponent(club.name)}`)}
												className="px-6 text-center flex justify-center items-center flex-row border space-x-4 p-3 rounded shadow-sm hover:bg-gray-100 hover:cursor-pointer"
												key={club.name}
											>
												<i className="fas fa-map-marker-alt text-red-600 text-3xl hover:text-red-700"></i>
												<div className="">
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
								title='Players Map'
								bgImg='https://unsplash.com/photos/vfzfavUZmfc/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjcyNTcyMjYz&force=true&w=1920'
							>
								<div className='w-full mb-12'>
									<div className='container mx-auto block px-4'>
										<div style={{ height: '80vh', width: '100%' }}>
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
													<ClubMarker
														lat={club.lat}
														onClick={onClubClicked}
														lng={club.lng}
														text={club.name}
													/>
												))}

											</GoogleMapReact>
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
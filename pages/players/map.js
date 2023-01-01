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


const PlayerMarker = ({ text }) => <div><i className="fas fa-map-marker-alt text-red-700 text-3xl"></i>{text}</div>;

const ClubMarker = ({ text, onClick }) => <div
	className=' flex justify-center flex-col items-center hover:cursor-pointer'
	title={`View Players who play at ${text}`}
	onClick={() => onClick(text)}
><i className="fas fa-map-marker-alt text-red-700 text-3xl"></i>
	<div className="text-indigoi-600 font-bold">
		{text}
	</div>
</div>;

export default function PlayersMap({ allPlayers, preview, clubs }) {
	const router = useRouter();
	const { user } = useFirebaseAuth();

	const refreshData = async () => {
		toast("Refreshing. Please wait...");
		await RevalidatePath(user, `/players`);
		window.location.reload();
	}

	const onClubClicked = (clubName) => {
		router.push(`/players?q=${encodeURIComponent(clubName)}`);
	}

	const defaultProps = {
		center: {
			lat: -37.840935,
			lng: 144.946457
		},
		zoom: 11
	};


	return (
		<Layout preview={preview}>
			<ToastContainer />
			<Navbar transparent />

			{router.isFallback ? (
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
			)}
		</Layout>
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
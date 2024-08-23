import { useRouter } from 'next/router';
import Head from 'next/head';
import PlayersCard from '../../components/Cards/PlayersCard';
import PlayersTable from '../../components/Cards/PlayersTable';
import Layout from '../../components/layout';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro2';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import { useFirebaseAuth } from '../../components/authhook';
import { GetMergedPlayers, getCompsRegistrationSummary } from "../../lib/backendapi";
import { RevalidatePath } from "../../lib/browserapi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { differenceInDays, differenceInMonths } from "date-fns";
import { last, prop, sortBy } from "ramda";


export default function Players({ allPlayers, preview }) {
	const router = useRouter();
	const { user } = useFirebaseAuth();

	const refreshData = async () => {
		toast("Refreshing. Please wait...");
		await RevalidatePath(user, `/players`);
		window.location.reload();
	}

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
							<title>Players | AVTA.</title>
						</Head>
					</article>

					<main className='profile-page'>
						<Intro
							title='AVTA Players'
							bgImg='https://unsplash.com/photos/RNiK93wcz-U/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8dGVubmlzJTIwcGxheWVyc3x8MHx8fHwxNjQyMDUxNDk2&force=true&w=1920'
						>
							<div className='w-full mb-12'>
								<div className='hidden mx-auto md:block px-52'>
									<PlayersTable
										players={allPlayers}
										user={user}
										refreshData={refreshData}
									/>
								</div>
								<div className='md:hidden px-2 mx-auto pt-32'>
									<PlayersCard allPlayers={allPlayers} refreshData={refreshData} user={user} />
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
	let allPlayers = await GetMergedPlayers()
	// console.log("🚀 ~ getStaticProps ~ allPlayers:", allPlayers);
	const compsReg = await getCompsRegistrationSummary();
	const sortByCompDate = sortBy(prop('comDate'));
	allPlayers = allPlayers.reduce((pre, cur) => {
		const playerId = cur.sys.id;
		const compsPlayed = compsReg
			.filter(x => x.player1.sys.id === playerId || x.player2.sys.id === playerId)
			.map(x => ({
				competitionId: x.competitionId,
				title: x.title,
				maxPoint: x.maxPoint,
				comDate: x.compDate,
				slug: x.slug
			}));
		cur.competitions = sortByCompDate(compsPlayed);
		cur.compsPlayed = compsPlayed.length;
		cur.lastComp = compsPlayed.length > 0 ? last(compsPlayed) : null;
		cur.monthsSinceLastComp = compsPlayed.length > 0 ? differenceInMonths(new Date(), new Date(last(cur.competitions).comDate)) : null;
		pre.push(cur);
		return pre;
	}, []);

	return {
		props: {
			preview,
			allPlayers
		},
		revalidate: 3600
	};
}
import React, { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns'
import Link from 'next/link';
import cn from 'classnames';
import { useForm } from "react-hook-form";
import PropTypes from 'prop-types';
import { db } from '../../lib/firebase';
import ContentfulImage from '../contentful-image';
import SaveButton from '../../components/savebutton';
import PlayerCard from '../../components/PlayerCard';
import useFilterPlayers from '../../lib/useFilterhook';
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import PlayerProfileStatus from '../../components/playerprofilestatus';
import { useFirebaseAuth } from '../authhook';
import { parseMsg } from '../../lib/browserapi';

export default function SendInviteViaSms({ players, competition }) {
	const [avaiPlayersAll, setAvaiPlayersAll] = useState(players);
	const [registeredPlayers, setRegisteredPlayers] = useState([]);
	const [unsubscribed, setUnsubscribed] = useState([]);
	const [avaiPlayers, setAvaiPlayers] = useState(players);
	const [selected, setSelected] = useState([]);
	const [sendResult, setSendResult] = useState('');
	const [currentSelected, setCurrentSelected] = useState('Unregistered');
	const [saving, setSaving] = useState(false);
	const { user } = useFirebaseAuth();

	const toggle = (id) => {
		const newList = selected.indexOf(id) === -1 ? [
			...selected,
			id
		] : selected.filter(x => x !== id);

		setSelected(newList);
	}

	useEffect(async () => {
		if (competition) {
			const q = query(collection(db, "competition_applications"), where("competitionId", "==", competition?.sys?.id));
			const querySnapshot = await getDocs(q);
			const registeredTeams = querySnapshot.docs.map(doc => ({
				...doc.data(),
				id: doc.id
			}));

			const unsubscribesSnapshot = await getDocs(query(collection(db, "unsubscribed")));
			const unsubscribes = unsubscribesSnapshot.docs.map(doc => doc.id);
			setUnsubscribed(unsubscribes);

			const avaiPlayers = players
				.filter(x => !registeredTeams.find(p => p.player1Id === x.sys.id) && !registeredTeams.find(p => p.player2Id === x.sys.id))
				.filter(x => !!x.mobileNumber);

			const registeredPlayers = players
				.filter(x => !!registeredTeams.find(p => p.player1Id === x.sys.id) || !!registeredTeams.find(p => p.player2Id === x.sys.id))
				.filter(x => !!x.mobileNumber);

			setAvaiPlayersAll(avaiPlayers);
			setRegisteredPlayers(registeredPlayers);

			setAvaiPlayers(avaiPlayers);
			// setSelected(avaiPlayers.map(x => x.sys.id));
		}
	}, [competition]);

	const onSubmit = async data => {
		const destinations = players
			.filter(x => selected.find(p => p === x.sys.id))
			.filter(x => !!x.mobileNumber)
			.filter(x => !unsubscribed.find(p => p === x.sys.id))
			.map(x => ({
				mobile: x.mobileNumber,
				playerId: x.sys.id,
				msg: parseMsg(x, data.msg)
			}));

		setSaving(true)
		user.getIdToken().then(idtoken => {
			return fetch(
				`/api/bulksendsms`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${idtoken}`,
					},
					body: JSON.stringify({
						destinations,
					})
				}
			)
				.then(response => response.json())
				.then((rsp) => {
					console.log('sent complete', rsp);
					setSaving(false);
					if (rsp.success) {
						setSendResult(`Successfully sent SMS to ${rsp.sentTo} players`);
					} else {
						setSendResult(`Error sending SMS. ${rsp.message || 'Please try again'}`);
					}
				})
				.catch((err) => {
					setSendResult(`Error sending SMS. ${err.message || 'Please try again'}`);
					console.log('error sending SMS', err);
					setSaving(false);
				});
		})
	}

	return (
		<>
			<div className="flex flex-col sm:flex-row justify-between items-center py-3 space-y-3">
				<div className="flex space-x-2">
					<a onClick={() => {
						setAvaiPlayers(avaiPlayersAll);
						setCurrentSelected('Unregistered');
					}}
						className={cn('border-t-0 px-2 rounded py-2 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 cursor-pointer', {
							'bg-gray-200': currentSelected === 'Unregistered',
						})}
					>Unregistered</a>
					<a onClick={() => {
						setAvaiPlayers(players.filter(x => !!x.mobileNumber));
						setCurrentSelected('All');
					}}
						className={cn('border-t-0 px-2 rounded py-2 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 cursor-pointer', {
							'bg-gray-200': currentSelected === 'All',
						})}
					>All</a>
					<a onClick={() => { setAvaiPlayers(registeredPlayers); setCurrentSelected('Registered'); }}
						className={cn('border-t-0 px-2 rounded py-2 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 cursor-pointer', {
							'bg-gray-200': currentSelected === 'Registered',
						})}
					>Registered</a>
				</div>

				<div className="flex space-x-2 ">
					<a onClick={() => setSelected([])} className="underline hover:cursor-pointer text-blue-600">Clear All</a>
					<a onClick={() =>
						setSelected(
							avaiPlayers.filter(x => !unsubscribed.find(p => p === x.sys.id)).map(x => x.sys.id)
						)
					} className="underline hover:cursor-pointer text-blue-600">Select All</a>
				</div>
			</div>
			<div className='w-full'>
				<div className='hidden container mx-auto md:block'>
					<PlayersTable players={avaiPlayers} toggle={toggle} selected={selected} unsubscribed={unsubscribed}></PlayersTable>
				</div>
				<div className='md:hidden mx-auto pt-6'>
					<PlayersCard players={avaiPlayers} toggle={toggle} selected={selected} unsubscribed={unsubscribed}></PlayersCard>
				</div>
			</div>



			<div className='py-6'>
				<SendSmsForm onSubmit={onSubmit} count={selected.length} competition={competition} saving={saving}></SendSmsForm>
			</div>
			<div className="px-3 py-3">{sendResult}</div>
		</>
	);
}

function PlayersTable({ players, toggle, selected, unsubscribed }) {
	const { sortBy, setSortBy, filter, setFilter, avgPoint, filteredPlayers } = useFilterPlayers(players);

	return (
		<>
			<div
				className={
					'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white'
				}
			>
				<div className='block w-full overflow-x-auto'>

					{/* Projects table */}
					<table className='items-center w-full bg-transparent border-collapse'>
						<thead>
							<tr>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left hover:cursor-pointer hover:underline bg-blueGray-50 text-blueGray-500 border-blueGray-100'
									}
									onClick={() => setSortBy('Name')}
								>
									Name (Nickname)
									{sortBy === 'Name' && <i className="fas fa-sort text-blue-600 ml-1"></i>}
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left hover:underline hover:cursor-pointer bg-blueGray-50 text-blueGray-500 border-blueGray-100'
									}
									onClick={() => setSortBy('Point')}
								>
									AVTA Point
									{sortBy === 'Point' && <i className="fas fa-sort text-blue-600 ml-1"></i>}
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left hover:underline hover:cursor-pointer bg-blueGray-50 text-blueGray-500 border-blueGray-100'
									}
									onClick={() => setSortBy('Club')}
								>
									Club
									{sortBy === 'Club' && <i className="fas fa-sort text-blue-600 ml-1"></i>}
								</th>
								<th
									className={
										'px-6 align-middle border border-solid py-3  border-l-0 border-r-0 whitespace-nowrap text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100'
									}
								>
									<div className='text-right'>
										<div className="italic text-gray-500 text-xs font-normal">Found {filteredPlayers.length} players wih Mobile</div>
									</div>

								</th>
							</tr>
						</thead>
						<tbody>
							{filteredPlayers.map((player) => (
								<tr key={player.sys.id}>
									<th className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										<div
											className='h-12 w-12 bg-white rounded-full border'
											alt='...'
										>
											<Link
												href={`/players/${player.sys.id}`}
											>
												{
													player.photoURL || player.coverImage?.url
														? <ContentfulImage width={120} height={120} className='hover:cursor-pointer rounded-full mx-auto max-w-120-px' src={player.photoURL || player.coverImage?.url} />
														: <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-400">
															<span className="text-xl font-medium leading-none text-white">{player.fullName.split(" ").map((n) => n[0]).join("")}</span>
														</span>
												}
											</Link>
										</div>
										<div className='flex flex-col'>
											<div
												className={
													'ml-3 font-bold text-blueGray-600'
												}
											>
												<Link
													href={`/players/${player.sys.id}`}
												>
													{player.fullName !== player.nickName ?
														<a className="hover:underline hover:cursor-pointer">{player.fullName} ({player.nickName})</a>
														:
														<a className="hover:underline hover:cursor-pointer">{player.fullName}</a>
													}
												</Link>
												<PlayerProfileStatus player={player}></PlayerProfileStatus>
											</div>
											<div className='ml-3 text-sm text-gray-600'>
												{player.club}
											</div>
										</div>
									</th>
									<td
										className={cn('border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4', {
											'text-green-600': !player?.unofficialPoint,
											'text-red-600': player?.unofficialPoint,
										})}
									>
										{player?.avtaPoint} pt.
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										{player.homeClub || 'Unknown Club'}
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-right'>
										{
											!unsubscribed.find(x => x === player.sys.id)
												? <button
													onClick={() => toggle(player.sys.id)}
													className={cn('get-started font-bold px-6 py-2 rounded outline-none focus:outline-none mr-1 mb-2  uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150 w-32', {
														'bg-blue-500 text-white': selected.indexOf(player.sys.id) >= 0,
														'bg-gray-300': selected.indexOf(player.sys.id) < 0,
													})}
												>
													{selected.indexOf(player.sys.id) >= 0 ? 'Selected' : 'Select'}
												</button>
												: <span className="italic px-6 text-red-600">Unsubscribed</span>
										}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}

function PlayersCard({ players, toggle, selected, unsubscribed }) {
	const { sortBy, setSortBy, filter, setFilter, avgPoint, filteredPlayers } = useFilterPlayers(players);

	return (
		<>
			<div className="italic text-gray-500 text-xs font-normal">Found {filteredPlayers.length} players wih mobile</div>
			<div className='flex flex-wrap justify-center pt-5 items-center'>
				<div className='grid grid-cols-1 gap-y-10 mb-32 w-full'>
					{filteredPlayers.map((player) => (
						<>
							<PlayerCard player={player} key={player.sys.id} size="md" showSelect
								buttonColor={unsubscribed.find(x => x === player.sys.id) ? 'bg-red-500 text-white' : selected.indexOf(player.sys.id) >= 0 ? 'bg-blue-500 text-white' : 'bg-gray-300'}
								buttonText={unsubscribed.find(x => x === player.sys.id) ? 'Unsubscribed' : selected.indexOf(player.sys.id) >= 0 ? 'Selected' : 'Select'}
								onSelect={(player) => {
									if (!unsubscribed.find(x => x === player.sys.id)) {
										toggle(player.sys.id)
									}
								}} />
						</>
					))}
				</div>
			</div>
		</>
	)
}


function SendSmsForm({ onSubmit, saving, count, competition }) {
	const { register, reset, handleSubmit, watch, formState: { errors } } = useForm({
		defaultValues: {
			msg: `Hi %fullname%, the next AVTA tournament ${competition.title} registration deadline is ${format(addDays(new Date(competition.date), -5), 'LLLL d, yyyy')} . If you need help finding a partner, please use our website to connect with a suitable partner: https://avtatour.com/competitions/${competition.slug}/apply?id=%id%. Join our facebook group https://www.facebook.com/groups/464135091348911 for more details about this tournament. To Unsubscribe, click %unsubscribe%`,
		}
	});

	const msg = watch('msg');

	return <form onSubmit={handleSubmit(onSubmit)}>
		<div className="flex flex-wrap pt-5">
			<div className="w-full lg:w-12/12 px-4">
				<div className="relative w-full mb-3">
					<ul>
						<li className="py-2"><span className="px-2 py-1 bg-gray-200 italic rounded">%fullname%</span> will be replaced with playe Full Name</li>
						<li className="py-2"><span className="px-2 py-1 bg-gray-200 italic rounded">%name%</span> will be replaced with playe First Name</li>
						<li className="py-2"><span className="px-2 py-1 bg-gray-200 italic rounded">%url%</span> will be replaced with player Profile page</li>
						<li className="py-2"><span className="px-2 py-1 bg-gray-200 italic rounded">%id%</span> will be replaced with player ID</li>
						<li className="py-2"><span className="px-2 py-1 bg-gray-200 italic rounded">%club%</span> will be replaced with player club</li>
						<li className="py-2"><span className="px-2 py-1 bg-gray-200 italic rounded">%unsubscribe%</span> will be replaced with player unsubscribe url</li>
					</ul>
				</div>
			</div>
		</div>
		<div className="flex flex-wrap">
			<div className="w-full lg:w-12/12 px-4">
				<div className="relative w-full mb-3">
					<label className="block uppercase text-gray-600 font-bold mb-2" htmlFor="grid-password">
						Send this SMS to <span className="text-red-600">{count}</span> players
					</label>
					<textarea type="text" className="border px-3 py-3 h-96 sm:h-40 placeholder-gray-300 text-gray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="4"
						{...register("msg", { required: true })}></textarea>
					<div>{msg?.length || 0} Characters</div>
				</div>
			</div>
		</div>
		<div className="flex flex-wrap pt-5">
			<div className="w-full lg:w-12/12 px-4">
				<div className="relative w-full mb-3 text-center">
					{
						count > 0
						&& <SaveButton saving={saving}
							type="submit">Send Now</SaveButton>
					}
				</div>
			</div>
		</div>
	</form>
}



SendInviteViaSms.defaultProps = {
	players: []
};

SendInviteViaSms.propTypes = {
};
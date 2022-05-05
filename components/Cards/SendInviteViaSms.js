import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { useForm } from "react-hook-form";
import PropTypes from 'prop-types';
import { db } from '../../lib/firebase';
import ContentfulImage from '../contentful-image';
import SaveButton from '../../components/savebutton';
import useFilterPlayers from '../../lib/useFilterhook';
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import PlayerProfileStatus from '../../components/playerprofilestatus';

export default function SendInviteViaSms({ players, competition }) {
	const [avaiPlayers, setAvaiPlayers] = useState(players);
	const [selected, setSelected] = useState([]);

	const toggle = (id) => {
		const newList = selected.indexOf(id) === -1 ? [
			...selected,
			id
		] : selected.filter(x => x !== id);

		console.log("🚀 ~ file: SendInviteViaSms.js ~ line 51 ~ toggle ~ newList", newList)
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

			const avaiPlayers = players
				.filter(x => !registeredTeams.find(p => p.player1Id === x.sys.id) && !registeredTeams.find(p => p.player2Id === x.sys.id))
				.filter(x => !!x.mobileNumber);

			setAvaiPlayers(avaiPlayers);
			setSelected(avaiPlayers.map(x => x.sys.id));
		}
	}, [competition]);

	const onSubmit = async data => {
		console.log("🚀 ~ file: SendInviteViaSms.js ~ line 46 ~ SendInviteViaSms ~ data", data)
	}
	return (
		<>
			<PlayersTable players={avaiPlayers} toggle={toggle} selected={selected}></PlayersTable>
			<div className='py-6'>
				<SendSmsForm onSubmit={onSubmit} count={selected.length}></SendSmsForm>
			</div>
		</>
	);
}

function PlayersTable({ players, toggle, selected }) {
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
										<div className="italic text-gray-500 text-xs font-normal">Found {filteredPlayers.length} Players, Avg Point: {avgPoint}</div>
										Search
										<input type="text" className="ml-2 border px-3 py-2 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-56 ease-linear transition-all duration-150"
											placeholder="Search Name, Club or Point"
											value={filter} onChange={(e) => { setFilter(e.target.value) }}
										/>
									</div>

								</th>
							</tr>
						</thead>
						<tbody>
							{filteredPlayers.map((player) => (
								<tr key={player.nickName}>
									<th className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center'>
										<div
											className='h-12 w-12 bg-white rounded-full border'
											alt='...'
										>
											<Link
												href={`/players/${player.sys.id}`}
											>
												<ContentfulImage width={120} height={120} className='hover:cursor-pointer rounded-full mx-auto max-w-120-px' src={player.photoURL || player.coverImage?.url || 'https://via.placeholder.com/120'} />
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
										{player?.avtaPoint} pt. {player?.unofficialPoint ? '[Unofficial]' : ''}
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4'>
										{player.homeClub || 'Unknown Club'}
									</td>
									<td className='border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-right'>
										<button
											onClick={() => toggle(player.sys.id)}
											className={cn('get-started font-bold px-6 py-2 rounded outline-none focus:outline-none mr-1 mb-2  uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150 w-32', {
												'bg-blue-500 text-white': selected.indexOf(player.sys.id) >= 0,
												'bg-gray-300': selected.indexOf(player.sys.id) < 0,
											})}
										>
											{selected.indexOf(player.sys.id) >= 0 ? 'Selected' : 'Select'}
										</button>
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


function SendSmsForm({ onSubmit, saving, count }) {
	const { register, reset, handleSubmit, watch, formState: { errors } } = useForm();
	const msg = watch('aboutMe');
	return <form onSubmit={handleSubmit(onSubmit)}>
		<div className="flex flex-wrap pt-5">
			<div className="w-full lg:w-12/12 px-4">
				<div className="relative w-full mb-3">
					<ul>
						<li className="py-2"><span className="px-2 py-1 bg-gray-200 italic rounded">%PlayerUrl%</span> : will be replaced with player profile page</li>
						<li className="py-2"><span className="px-2 py-1 bg-gray-200 italic rounded">%PlayerID%</span> : will be replaced with player ID</li>
					</ul>
				</div>
			</div>
		</div>
		<div className="flex flex-wrap">
			<div className="w-full lg:w-12/12 px-4">
				<div className="relative w-full mb-3">
					<label className="block uppercase text-gray-600 font-bold mb-2" htmlFor="grid-password">
						Send this SMS to {count} players
					</label>
					<textarea type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="4"
						{...register("aboutMe", { required: true })}></textarea>
					<div>{msg.length} Chars.</div>
				</div>
			</div>
		</div>
		<div className="flex flex-wrap pt-5">
			<div className="w-full lg:w-12/12 px-4">
				<div className="relative w-full mb-3 text-center">
					<SaveButton saving={saving}
						type="submit">Send Now</SaveButton>
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
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment } from 'react'
import { format } from 'date-fns'
import GroupRankingsCard from './Cards/GroupRankingsCardFB';
import WheelSpinner from './WheelSpinner';

export default function RandomGroupsAllocation({ groups, teams, show, onClose, onSave, competition }) {
	const [remaingTeams, setRemainingTeams] = useState(teams);
	const [updatedGroups, setUpdatedGroups] = useState(groups);

	const onTeamSelected = (team) => {
		allocateTeam(team);

		// take away from remaining team
		const remaining = remaingTeams.filter(x => x.id !== team.id);
		if (remaining.length === 1) {
			allocateTeam(remaining[0]);
			setRemainingTeams([]);
		} else {
			setRemainingTeams(remaining);
		}
	}

	function allocateTeam(team) {
		const groupNames = (Object.keys(updatedGroups)).sort();
		for (let index = 0; index < groupNames.length; index++) {
			const groupName = groupNames[index];
			let found = false;
			for (let u = 0; u < updatedGroups[groupName].length; u++) {
				const currentteam = updatedGroups[groupName][u];
				if (typeof currentteam === 'number') {
					updatedGroups[groupName][u] = team;
					found = true;
					break;
				}
			}
			if (found) break;
		}

		setUpdatedGroups(JSON.parse(JSON.stringify(updatedGroups)));
	}

	useEffect(() => {
		const onBeforeUnload = (ev) => {

			//#############     
			console.log("SOME CODE HERE");
			//#############

			ev.returnValue = "You sure you want to stop the draw? \nAll current changes will be lost";
			return "You sure you want to stop the draw?";
		};

		window.addEventListener("beforeunload", onBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", onBeforeUnload);
		};
	}, []);

	return (<>
		<Transition appear show={show} as={Fragment}>
			<Dialog as="div" className="relative z-50 max-h-50vh" onClose={() => { }}>
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
					<div className="flex min-h-full items-center justify-center text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full mx-64 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="text-3xl font-medium leading-6 text-gray-900 px-4 pt-2 text-center mb-6"
								>
									AVTA Tour {competition.maxPoint} - {format(new Date(competition.date), 'do MMMM yyyy')}
								</Dialog.Title>


								<div className="px-2 lg:flex-row flex">
									<div>
										<div className='mt-4 w-[400px]'>
											<GroupRankingsCard
												is_superuser={false}
												fullWidth={true}
												groups={updatedGroups}
											/>
										</div>
									</div>
									{
										remaingTeams?.length > 1
											? <div className="w-full flex justify-center">
												<WheelSpinner teams={remaingTeams} onTeamSelected={onTeamSelected} />
											</div>
											: <div className="flex justify-center items-center mx-auto">
												<button type="submit" role="link" className="bg-blue-500 text-white active:bg-blue-600 font-bold px-8 py-5 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150
    disabled:cursor-wait whitespace-nowrap
             disabled:bg-gray-200 uppercase"
													onClick={() => onSave(updatedGroups)}
												>
													Complete Draw
												</button>
											</div>
									}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	</>
	);


}

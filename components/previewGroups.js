import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment } from 'react'
import { format } from 'date-fns'
import GroupRankingsCard from './Cards/GroupRankingsCardFB';
import TeamRankingTable from './Cards/TeamRankingTableFB';


export default function PreviewGroups({ groups, show, onClose, onSave }) {
	return (<>
		<Transition appear show={show} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={onClose}>
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
							<Dialog.Panel className="w-full max-w-lg lg:max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="text-3xl font-medium leading-6 text-gray-900 px-4 pt-2 text-center mb-6"
								>
									Groups Allocations
								</Dialog.Title>


								<div className="px-2">
									<div className='hidden container md:block'>
										<TeamRankingTable
											is_superuser={false}
											previewMode
											groups={groups}
										/>
									</div>
									<div className='md:hidden mt-4 '>
										<GroupRankingsCard
											is_superuser={false}
											groups={groups}
										/>
									</div>
								</div>
								<div className="text-center text-base mt-64 flex space-x-3 justify-center">
										<button type="submit" role="link" className="bg-blue-500 text-white active:bg-blue-600 font-bold px-3 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150
    disabled:cursor-wait whitespace-nowrap
             disabled:bg-gray-200"
											onClick={onSave}
										>
											Save
										</button>
										<button type="submit" role="link" className="bg-gray-500 text-white active:bg-blue-600 font-bold px-3 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150
    disabled:cursor-wait whitespace-nowrap
             disabled:bg-gray-200"
											onClick={onClose}
										>
											Close
										</button>
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

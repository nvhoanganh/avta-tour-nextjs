import React from "react";
import { format } from 'date-fns'
import Link from 'next/link'
import PostTitle from '../../components/post-title';
import TeamAvatar from '../../components/TeamAvatarNoLink';
import cn from 'classnames';
import DropDown from '../../components/dropdown';
import SaveButton from '../../components/savebutton';
import { useRouter } from 'next/router';
import { useFirebaseAuth } from '../authhook';
import { useState, useEffect } from 'react'
import Spinner from '../../components/spinner';
import {
  getPlayerById,
  score
} from '../../lib/browserapi';
import { db } from '../../lib/firebase';
import { query, collection, doc, getDocs, getDoc, where, addDoc } from "firebase/firestore";

import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SubmitScore({ competition }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const onSubmit = async data => {
    setSaving(true)
    toast("Result submitted!");

    data = {
      competitionId: competition?.sys?.id,
      compDate: competition?.date,
      maxPoint: competition?.maxPoint,
      slug: competition?.slug,
      title: competition?.title,
      type: competition?.type,
      active: competition?.active,
      timestamp: (new Date()),

      stage: data.stage,
      gameWonByLoser: data.gameWonByLoser,
      stage: data.stage,
      knockoutRound: data.knockoutRound || '',
      group: data.group || '',
      losers: data.selectedLoser,
      winners: data.selectedWinner,
      loser1: data.selectedLoser.players[0].sys.id,
      loser2: data.selectedLoser.players[1].sys.id,
      winner1: data.selectedWinner.players[0].sys.id,
      winner2: data.selectedWinner.players[1].sys.id,
    };

    const docRef = await addDoc(collection(db, "competition_results"), data);

    setSaving(false)
  };

  return (
    <>
      <ToastContainer />

      {
        saving
          ? <><div className="text-center py-24"><Spinner size="lg" color="blue" /> Loading...</div> :</>
          : <SubmitScoreForm onSubmit={onSubmit} saving={saving} competition={competition} />
      }

    </>
  );
}

function SubmitScoreForm({ onSubmit, competition, saving }) {
  const { register, reset, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  const gameWonByLoser = watch('gameWonByLoser');
  const stage = watch('stage');
  const winner = watch('winner');
  const loser = watch('loser');
  const group = watch('group');
  const knockoutRound = watch('knockoutRound');
  const selectedWinner = watch('selectedWinner');
  const selectedLoser = watch('selectedLoser');

  const isValid = () => {
    return !!selectedWinner && !!selectedLoser
      && selectedWinner.name !== selectedLoser.name
      && !!gameWonByLoser
      && !!stage
      &&
      (
        (stage === score.GROUP_STAGE && !!group) ||
        (stage === score.KNOCKOUT_STAGE && !!knockoutRound)
      )
  }

  const getFilteredTeams = (teams, query) => {
    if (!query) return [];

    return teams.filter(team => {
      const players = {
        player1: team.players[0],
        player2: team.players[1],
      };

      return team.name.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0 ||

        players.player1.fullName.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0 ||
        players.player1.nickName.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0 ||

        players.player2.fullName.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0 ||
        players.player2.nickName.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0
        ;
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6  border-0">
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <h6 className="text-gray-400 text-lg mt-3 mb-6 text-center">
            Submit Result for {competition.maxPoint} - {format(new Date(competition.date), 'LLLL	d, yyyy')} - {competition.club}
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Winning Team
                </label>

                {!selectedWinner ?
                  <>
                    <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("winner", { required: true })} placeholder="Start typing to search.." />
                    <div className='flex flex-col space-y-2 py-5'>
                      {getFilteredTeams(competition?.teams, winner).map((team) => (
                        <TeamCard
                          onSelect={() => setValue('selectedWinner', team)}
                          team={team}
                        />
                      ))}
                    </div>
                  </> :
                  <TeamCard
                    team={selectedWinner}
                  />
                }


              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Losing Team
                </label>



                {!selectedLoser ||
                  (selectedWinner && selectedLoser
                    && selectedWinner.name === selectedLoser.name)
                  ?
                  <>
                    <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("loser", { required: true })} placeholder="Start typing to search.." />
                    <div className='flex flex-col space-y-2 py-5'>

                      {selectedWinner && selectedLoser
                        && selectedWinner.name === selectedLoser.name && <span className="text-red-700">
                          Winner and loser can't be the same
                        </span>}


                      {getFilteredTeams(competition?.teams, loser).map((team) => (
                        <TeamCard
                          onSelect={() => setValue('selectedLoser', team)}
                          team={team}
                        />
                      ))}
                    </div>
                  </> :
                  <TeamCard
                    team={selectedLoser}
                  />
                }

                {selectedWinner && selectedLoser
                  && selectedWinner.name === selectedLoser.name && <span className="text-red-700">
                    Winner and loser can't be the same
                  </span>}


              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4 py-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Stage
                </label>

                <div className="flex space-x-2">
                  <DropDown align='left' buttonText={
                    <span className="px-3">{stage || 'Select..'}</span>
                  }
                    items={[
                      <a onClick={() => setValue('stage', score.GROUP_STAGE)} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Group Stage</a>,
                      <a onClick={() => setValue('stage', score.KNOCKOUT_STAGE)} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Knockout Stage</a>,
                    ]}
                  >
                  </DropDown>

                  {stage && stage === score.GROUP_STAGE &&
                    <DropDown align='left' buttonText={
                      <span className="px-3">{group ? 'Group: ' + group : 'Select group'}</span>
                    }
                      items={[
                        <a onClick={() => setValue('group', 'A')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">A</a>,
                        <a onClick={() => setValue('group', 'B')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">B</a>,
                        <a onClick={() => setValue('group', 'C')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">C</a>,
                        <a onClick={() => setValue('group', 'D')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">D</a>,
                        <a onClick={() => setValue('group', 'E')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">E</a>,
                        <a onClick={() => setValue('group', 'F')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">F</a>,
                        <a onClick={() => setValue('group', 'G')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">G</a>,
                        <a onClick={() => setValue('group', 'H')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">H</a>,
                      ]}
                    >
                    </DropDown>}

                  {stage && stage === score.KNOCKOUT_STAGE &&
                    <DropDown align='left' buttonText={
                      <span className="px-3">{knockoutRound ? 'Round: ' + knockoutRound : 'Select round'}</span>
                    }
                      items={[
                        <a onClick={() => setValue('knockoutRound', 'Quarter')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Quarter Final</a>,
                        <a onClick={() => setValue('knockoutRound', 'Semi')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Semi Final</a>,
                        <a onClick={() => setValue('knockoutRound', 'Final')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Final</a>,
                        <a onClick={() => setValue('knockoutRound', '16')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Round of 16</a>,
                        <a onClick={() => setValue('knockoutRound', '32')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Round of 32</a>,
                        <a onClick={() => setValue('knockoutRound', '64')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Round of 64</a>,
                        <a onClick={() => setValue('knockoutRound', '128')} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Round of 128</a>,
                      ]}
                    >
                    </DropDown>}
                </div>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4 py-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Game won by losing team
                </label>

                <DropDown align='left' buttonText={
                  <span className="px-3">{gameWonByLoser || 'Select..'}</span>
                }
                  items={[
                    <a onClick={() => setValue('gameWonByLoser', 1)} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">1</a>,
                    <a onClick={() => setValue('gameWonByLoser', 2)} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">2</a>,
                    <a onClick={() => setValue('gameWonByLoser', 3)} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">3</a>,
                    <a onClick={() => setValue('gameWonByLoser', 4)} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">4</a>,
                    <a onClick={() => setValue('gameWonByLoser', 5)} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">5</a>,
                    <a onClick={() => setValue('gameWonByLoser', 6)} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">6</a>,
                  ]}
                >
                </DropDown>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap pt-10">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3 text-left lg:text-right">
                <button type="button" onClick={() => reset()} className="bg-gray-500 text-white font-bold uppercase text-xs px-8 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">Reset</button>
                {isValid() && <SaveButton saving={saving}
                  type="submit">Submit Score</SaveButton>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form >);
}


function TeamCard({ team, onSelect }) {
  const players = {
    player1: team.players[0],
    player2: team.players[1],
  };

  return (<div
    className='relative flex flex-col min-w-0 break-words  bg-white rounded mb-3 xl:mb-0 shadow-lg cursor-pointer hover:bg-gray-100'
    onClick={() => onSelect && onSelect(team)}
  >
    <div className="flex-auto p-4">
      <div className="flex flex-wrap ">
        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
          <div
            className=
            'font-bold flex space-x-1 text-gray-600 '
          >
            <span>{team.name}</span>
          </div>
          <div
            className=
            'text-gray-600 '
          >
            {players.player1.homeClub || 'Unknown Club'}
          </div>
          <div className='text-sm text-gray-600 flex space-x-2'>
            <span className='text-green-600'>{players.player1.avtaPoint + players.player2.avtaPoint} pt.</span>
          </div>
        </div>
        <div className="relative w-auto pl-4 flex-initial flex">
          <TeamAvatar team={players} disableLink />
        </div>
      </div>
    </div>
  </div>)
}
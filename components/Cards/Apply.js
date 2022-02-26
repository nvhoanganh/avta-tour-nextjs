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
import PlayerWithIcon from '../../components/PlayerWithIcon';
import {
  getPlayerById,
  score,
  getPlayers
} from '../../lib/browserapi';
import { db } from '../../lib/firebase';
import { query, collection, doc, getDocs, getDoc, where, addDoc } from "firebase/firestore";

import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ApplyForCompetition({ competition, players }) {
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
      loserTeamId: data.selectedLoser.sys.id,
      winnerTeamId: data.selectedWinner.sys.id,
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
          : <ApplyForCompForm onSubmit={onSubmit} saving={saving}
            competition={competition} players={players} />
      }

    </>
  );
}

function ApplyForCompForm({ onSubmit, competition, saving, players }) {
  const { register, reset, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  const player1 = watch('player1');
  const player2 = watch('player2');
  const selectedPlayer1 = watch('selectedPlayer1');
  const selectedPlayer2 = watch('selectedPlayer2');

  const isValid = () => {
    return !!player1 && !!player2
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6  border-0">
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <h6 className="text-gray-400 text-lg mt-3 mb-6 text-center">
            Apply for {competition.maxPoint} - {format(new Date(competition.date), 'LLLL	d, yyyy')} - {competition.club}
          </h6>
          <h6 className="text-gray-400 text-lg mt-3 mb-6 text-center">
            Total Point:
          </h6>
          <div className="flex flex-wrap">

            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Player 1
                </label>

                {!selectedPlayer1 ?
                  <>
                    <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("player1", { required: true })} placeholder="Start typing to search.." />

                    <div className='flex flex-wrap justify-center pt-5'>
                      <div className='grid grid-cols-2 gap-y-20 mb-32'>
                        {getPlayers(players, 'Point', player1).map((player) => (
                          <PlayerWithIcon player={player} size="md" showSelect onSelect={(player) => setValue('selectedPlayer1', player)} />
                        ))}
                      </div>
                    </div>
                  </> :
                  <PlayerWithIcon player={selectedPlayer1} size="md" />
                }
              </div>
            </div>

            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Player 2
                </label>

                {!selectedPlayer2 ?
                  <>
                    <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("player2", { required: true })} placeholder="Start typing to search.." />

                    <div className='flex flex-wrap justify-center pt-5'>
                      <div className='grid grid-cols-2 gap-y-20 mb-32'>
                        {getPlayers(players, 'Point', player2).map((player) => (
                          <PlayerWithIcon player={player} size="md" showSelect onSelect={(player) => setValue('selectedPlayer2', player)} />
                        ))}
                      </div>
                    </div>
                  </> :
                  <PlayerWithIcon player={selectedPlayer2} size="md" />
                }
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
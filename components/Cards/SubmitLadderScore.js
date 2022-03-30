import { format } from 'date-fns'
import TeamAvatar from '../../components/TeamAvatarNoLink';
import DropDown from '../../components/dropdown';
import SaveButton from '../../components/savebutton';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import Spinner from '../../components/spinner';
import { score } from '../../lib/browserapi';
import { db } from '../../lib/firebase';
import { collection, addDoc } from "firebase/firestore";

import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
var Diacritics = require('diacritic');

export default function SubmitLadderScore({ ladder, allPlayers }) {
  console.log("🚀 ~ file: SubmitLadderScore.js ~ line 17 ~ SubmitLadderScore ~ allPlayers", allPlayers)
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const onSubmit = async data => {
    setSaving(true)
    toast("Result submitted!");

    console.log("🚀 ~ file: SubmitLadderScore.js ~ line 22 ~ SubmitLadderScore ~ data", data)

    // data = {
    //   competitionId: ladder?.sys?.id,
    //   compDate: ladder?.date,
    //   maxPoint: ladder?.maxPoint,
    //   slug: ladder?.slug,
    //   title: ladder?.title,
    //   type: ladder?.type,
    //   active: ladder?.active,
    //   timestamp: (new Date()),

    //   stage: data.stage,
    //   gameWonByLoser: data.gameWonByLoser,
    //   stage: data.stage,
    //   knockoutRound: data.knockoutRound || '',
    //   group: data.group || '',
    //   losers: data.selectedLoser,
    //   winners: data.selectedWinner,
    //   loserTeamId: data.selectedLoser.sys.id,
    //   winnerTeamId: data.selectedWinner.sys.id,
    //   loser1: data.selectedLoser.players[0].sys.id,
    //   loser2: data.selectedLoser.players[1].sys.id,
    //   winner1: data.selectedWinner.players[0].sys.id,
    //   winner2: data.selectedWinner.players[1].sys.id,
    // };

    // const docRef = await addDoc(collection(db, "competition_results"), data);

    setSaving(false)
  };

  return (
    <>
      <ToastContainer />

      {
        saving
          ? <><div className="text-center py-24"><Spinner size="lg" color="blue" /> Loading...</div> :</>
          : <SubmitLadderScoreForm onSubmit={onSubmit} saving={saving}
            ladder={ladder} allPlayers={allPlayers} />
      }

    </>
  );
}

function SubmitLadderScoreForm({ onSubmit, ladder, saving, allPlayers }) {
  const { register, reset, handleSubmit, watch, setValue, errors, getValues } = useForm({ mode: "onBlur" });

  const sortedPlayers = allPlayers.sort((a, b) => {
    return Diacritics.clean(b.fullName) > Diacritics.clean(a.fullName) ? -1 : 1;
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6  border-0">
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <h6 className="text-gray-400 text-lg mt-3 mb-6 text-center">
            Submit Result for {ladder.name} - {format(new Date(ladder.startDate), 'LLLL	d, yyyy')}
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 py-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Winner 1
                </label>

                <div className="flex space-x-2">
                  <select className="appearance-none
      border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" aria-label="Default select example"
                    {...register("winner1", {
                      required: true,
                      validate: () => getValues("winner1") !== getValues("winner2") && getValues("winner1") !== getValues("loser1") && getValues("winner1") !== getValues("loser2")
                    })}
                  >
                    <option value=""></option>
                    {sortedPlayers.map(player => (
                      <option key={player.sys.id} value={player.sys.id}>{player.fullName}{player.fullName !== player.nickName ? ` (${player.nickName})` : ''} [{player.avtaPoint}]</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-6/12 px-4 py-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Winner 2
                </label>

                <div className="flex space-x-2">
                  <select className="appearance-none
      border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" aria-label="Default select example"
                    {...register("winner2", {
                      required: true,
                      validate: () => getValues("winner2") !== getValues("winner1") && getValues("winner2") !== getValues("loser1") && getValues("winner2") !== getValues("loser2")
                    })}
                  >
                    <option value=""></option>
                    {sortedPlayers.map(player => (
                      <option key={player.sys.id} value={player.sys.id}>{player.fullName}{player.fullName !== player.nickName ? ` (${player.nickName})` : ''} [{player.avtaPoint}]</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-6/12 px-4 py-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Loser 1
                </label>

                <div className="flex space-x-2">
                  <select className="appearance-none
      border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" aria-label="Default select example"
                    {...register("loser1", {
                      required: true,
                      validate: () => getValues("loser1") !== getValues("loser2") && getValues("loser1") !== getValues("winner1") && getValues("loser1") !== getValues("winner2")
                    })}
                  >
                    <option value=""></option>
                    {sortedPlayers.map(player => (
                      <option key={player.sys.id} value={player.sys.id}>{player.fullName}{player.fullName !== player.nickName ? ` (${player.nickName})` : ''} [{player.avtaPoint}]</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-6/12 px-4 py-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Loser 2
                </label>

                <div className="flex space-x-2">
                  <select className="appearance-none
      border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" aria-label="Default select example"
                    {...register("loser2", {
                      required: true,
                      validate: () => getValues("loser2") !== getValues("loser1") && getValues("loser2") !== getValues("winner1") && getValues("loser2") !== getValues("winner2")
                    })}
                  >
                    <option value=""></option>
                    {sortedPlayers.map(player => (
                      <option key={player.sys.id} value={player.sys.id}>{player.fullName}{player.fullName !== player.nickName ? ` (${player.nickName})` : ''} [{player.avtaPoint}]</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-6/12 px-4 py-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Game Won by Winners
                </label>

                <div className="flex space-x-2">
                  <select className="appearance-none
      border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" aria-label="Default select example"
                    {...register("gameWonByWinners", { required: true })}
                  >
                    {[6, 7].map(score => (
                      <option key={score} value={score}>{score} Games</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-6/12 px-4 py-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Game Won by Losers
                </label>

                <div className="flex space-x-2">
                  <select className="appearance-none
      border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" aria-label="Default select example"
                    {...register("gameWonByLosers", { required: true })}
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(score => (
                      <option key={score} value={score}>{score} Games</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>


          </div>

          <div className="flex flex-wrap pt-10">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3 text-left lg:text-right">
                <button type="button" onClick={() => reset()} className="bg-gray-500 text-white font-bold uppercase text-xs px-8 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">Reset</button>
                <SaveButton saving={saving}
                  type="submit">Submit Score</SaveButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>);
}
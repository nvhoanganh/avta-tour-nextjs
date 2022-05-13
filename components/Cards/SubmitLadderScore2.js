import { format } from 'date-fns'
import SaveButton from '../../components/savebutton';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getFBUserIdFromContentfulId, RevalidatePath } from '../../lib/browserapi';
import Spinner from '../../components/spinner';
import { db } from '../../lib/firebase';
import useFilterPlayers from '../../lib/useFilterhook';
import { collection, addDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
var Diacritics = require('diacritic');

export default function SubmitLadderScore({ ladder, allPlayers, user }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const onSubmit = async data => {
    setSaving(true)
    try {
      const toSubmit = {
        ladderId: ladder.id,
        ...data,
        winner1: data.winners[0],
        winner2: data.winners[1],
        loser1: data.losers[0],
        loser2: data.losers[1],
        winnerUser1: { uid: getFBUserIdFromContentfulId(allPlayers, data.winners[0]) },
        winnerUser2: { uid: getFBUserIdFromContentfulId(allPlayers, data.winners[1]) },
        loserUser1: { uid: getFBUserIdFromContentfulId(allPlayers, data.losers[0]) },
        loserUser2: { uid: getFBUserIdFromContentfulId(allPlayers, data.losers[1]) },
        timestamp: (new Date()),
        gameWonByWinners: +data.gameWonByWinners,
        gameWonByLosers: +data.gameWonByLosers,
        submittedById: user.uid,
        submittedByFullName: user.displayName,
      }
      delete toSubmit.winners
      delete toSubmit.losers

      const docRef = await addDoc(collection(db, "ladder_results"), toSubmit);
      await RevalidatePath(user, `/ladders/${ladder.id}`);

      toast("Result submitted!");
      setSaving(false)
    } catch (error) {
      console.log('Submit failed', error)
      toast.error("Failed to submit result: " + error.message);
      setSaving(false)
    }
  };

  return (
    <>
      <ToastContainer />
      {
        saving
          ? <><div className="text-center py-24"><Spinner size="lg" color="blue" />Saving result. Please wait..</div> :</>
          : <SubmitLadderScoreForm onSubmit={onSubmit} saving={saving}
            ladder={ladder} allPlayers={allPlayers} />
      }

    </>
  );
}

function SubmitLadderScoreForm({ onSubmit, ladder, saving, allPlayers }) {
  const { register, reset, handleSubmit, watch, setValue, errors, getValues } = useForm({ mode: "onBlur" });
  const winners = watch('winners') || [];
  const selectedWinners = allPlayers.filter(x => winners.indexOf(x.sys.id) !== -1);
  const losers = watch('losers') || []
  const loserSet = watch('gameWonByLosers')
  const winnerSet = watch('gameWonByWinners')
  const selectedLosers = allPlayers.filter(x => losers.indexOf(x.sys.id) !== -1);

  const { sortBy, setSortBy, filter, setFilter, avgPoint, filteredPlayers } = useFilterPlayers(allPlayers);

  const isValid = () => {
    return winners.length === 2 && losers.length === 2 && winners[0] !== losers[0] && winners[0] !== losers[1] &&
      winners[1] !== losers[0] && winners[1] !== losers[1] && !!loserSet && !!winnerSet && loserSet !== winnerSet;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6  border-0">
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <h6 className="text-gray-400 text-lg mb-2 text-center uppercase">
            Submit Result
          </h6>
          <div className="text-center mb-8">{ladder.name} - {format(new Date(ladder.startDate), 'LLLL	d, yyyy')}</div>
          <div className="flex flex-wrap">
            <div className="w-full px-4 py-4">
              <div className="relative w-full mb-3 flex justify-center">
                <input type="text" className="border px-3 py-2 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 w-96" placeholder="Search Name, Club or Point"
                  value={filter} onChange={(e) => { setFilter(e.target.value) }}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 py-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Winners:
                </label>
                {winners?.length < 2 ? <div className="flex flex-col space-y-1">
                  <div className="text-sm italic text-gray-500">{winners?.length} selected</div>
                  {
                    filteredPlayers.map(
                      (player, i) => <label key={player.sys.id} className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="form-checkbox border rounded text-blueGray-700 ml-2 w-5 h-5 ease-linear transition-all duration-150"
                          value={player.sys.id} name={"withIndex." + i * 2}
                          {...register("winners", {
                            required: true,
                          })}
                        />{player.fullName} - {player?.avtaPoint}pt [{player.homeClub || 'Unknown Club'}]
                      </label>
                    )
                  }
                </div> :
                  <div>
                    <span>{selectedWinners.map(x => `${x.fullName} [${x.avtaPoint}]`).join(' & ')}</span>
                    <span className="bg-red-500  text-white font-bold hover:shadow-md shadow text-xs ml-2 px-2 py-1 rounded outline-none 
                            focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150 cursor-pointer" onClick={() => setValue('winners', null)}>Clear</span>
                  </div>
                }
              </div>
            </div>

            <div className="w-full lg:w-6/12 py-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Losers:
                </label>
                {losers?.length < 2 ? <div className="flex flex-col space-y-1">
                  <div className="text-sm italic text-gray-500">{losers?.length} selected</div>
                  {
                    filteredPlayers.map(
                      (player, i) => <label key={player.sys.id} className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="form-checkbox border rounded text-blueGray-700 ml-2 w-5 h-5 ease-linear transition-all duration-150" value={player.sys.id} name={"withIndex." + i * 2}
                          {...register("losers", {
                            required: true,
                          })}
                        />{player.fullName} - {player?.avtaPoint}pt [{player.homeClub || 'Unknown Club'}]
                      </label>
                    )
                  }
                </div> : <div>
                  <span>{selectedLosers.map(x => `${x.fullName} [${x.avtaPoint}]`).join(' & ')}</span>
                  <span className="bg-red-500  text-white font-bold hover:shadow-md shadow text-xs ml-2 px-2 py-1 rounded outline-none 
                            focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150 cursor-pointer" onClick={() => setValue('losers', null)}>Clear</span>
                </div>}
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

            <div className="w-full lg:w-6/12 px-4 py-4">
              <div className="relative w-full mb-3">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="form-checkbox border rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150" {...register("isBagel")} />
                  <span className="ml-2 text-sm font-semibold text-blueGray-600">Is Bagel</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap pt-10">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3 text-left lg:text-right">
                <button type="button" onClick={() => reset()} className="bg-gray-500 text-white font-bold uppercase text-xs px-8 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">Reset</button>
                {
                  isValid() && <SaveButton saving={saving}
                    type="submit">Submit</SaveButton>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>);
}
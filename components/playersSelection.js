import LadderMatches from './ladderMatches'
import { useForm } from "react-hook-form";
import { getMatchups, RevalidatePath } from "../lib/browserapi"
import useFilterPlayers from '../lib/useFilterhook';
import { db } from '../lib/firebase';
import { getPlayers, getSortLabel } from '../lib/browserapi';
import SaveButton from './savebutton';
import { useState, useEffect } from 'react'
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
var Diacritics = require('diacritic');

export default function PlayersSelection({ registered, ladderId, user, results }) {
  const [matchUps, setMatchUps] = useState(null);
  const [saving, setSaving] = useState(false);

  const { register, reset, handleSubmit, watch, setValue, errors, getValues } = useForm({
      mode: "onBlur"
    }
  );

  // only include the registered players
  const { sortBy, setSortBy, filter, setFilter, avgPoint, filerPlayerStyle, filteredPlayers } = useFilterPlayers(registered);

  const selectedPlayers = watch('selected');
  useEffect(() => {
    const previousSaved = localStorage.getItem('previousSelectedPlayers');
    if (previousSaved) {
      setValue('selected', JSON.parse(previousSaved))
    }
  },[]);

  const onSubmit = data => {
    const selectedPlayers = registered.filter(x => data.selected.indexOf(x.sys.id) !== -1);
    const matches = getMatchups(selectedPlayers, results);
    setMatchUps(matches);
    localStorage.setItem('previousSelectedPlayers', JSON.stringify(data.selected));
  };

  const resetForm = () => {
    reset();
    setMatchUps(null);
  }

  const saveMatcheups = async () => {
    setSaving(true);
    const ladderRef = doc(db, "ladder_matches", ladderId);
    await setDoc(ladderRef, {
      tonightMatches: matchUps
    });
    await RevalidatePath(user, `/ladders/${ladderId}`);
    setSaving(false)
    toast("Matches saved!.");
    window.location.reload();
  }


  return (
    <>
      <ToastContainer />
      {
        matchUps
          ? <div className="flex flex-col py-10">
            <LadderMatches matchUps={matchUps}></LadderMatches>
            <div>
              {/* {
                user
                  ? <SaveButton saving={saving} onClick={() => saveMatcheups()}
                    type="submit">Save</SaveButton>
                  : null
              } */}
              <button type="button" className="bg-gray-500 ml-2 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 my-8 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" onClick={resetForm} >Cancel</button>
            </div>
          </div>
          :
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" text-lg py-3 font-bold">Who is playing?</div>
            {/* <input type="text" className="border px-3 py-2 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="Search Name, Club or Point"
              value={filter} onChange={(e) => { setFilter(e.target.value) }}
            /> */}
            <div className=" text-sm text-gray-600 italic">{selectedPlayers?.length} selected</div>

            <div className="flex flex-col space-y-1 pt-4">
              {
                getPlayers(registered, 'Name', filter, null, filerPlayerStyle).map(
                  (player, i) =>
                    <label key={player.sys.id} className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="form-checkbox border rounded text-blueGray-700 my-2 ml-2 w-5 h-5 ease-linear transition-all duration-150" value={player.sys.id} name={"withIndex." + i * 2}
                        {...register("selected", { required: true })}
                      /><span className="pl-2">{player.fullName} - {player?.avtaPoint}pt</span>
                    </label>
                )
              }
            </div>
            <button type="submit" className="bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 my-8 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" >Generate</button>
          </form>
      }
    </>
  )
}

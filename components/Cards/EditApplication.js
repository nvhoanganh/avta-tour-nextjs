import React from "react";
import { format } from 'date-fns'
import Link from 'next/link'
import PostTitle from '../../components/post-title';
import TeamAvatar from '../../components/TeamAvatarNoLink';
import TeamCard from './TeamCard';
import cn from 'classnames';
import DropDown from '../../components/dropdown';
import PostBody from '../../components/post-body';
import SaveButton from '../../components/savebutton';
import { useRouter } from 'next/router';
import { useFirebaseAuth } from '../authhook';
import { useState, useEffect } from 'react'
import Spinner from '../../components/spinner';
import PlayerWithIcon from '../../components/PlayerWithIcon';
import PlayerCard from '../../components/PlayerCard';
import {
  getPlayerById,
  score,
  getPlayers
} from '../../lib/browserapi';
import { db } from '../../lib/firebase';
import { query, collection, doc, setDoc, getDocs, getDoc, where, addDoc } from "firebase/firestore";

import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditApplicationCompetition({ competition, players, rule, linkedPlayerId, userRole, editTeamId, currentUser }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [registeredTeam, setRegisteredTeam] = useState(null);
  const [avaiPlayers, setAvaiPlayers] = useState(players);

  const goback = () => {
    router.push(`/competitions/${router.query.slug}`);
  }

  const onSubmit = async data => {
    setSaving(true)

    data = {
      ...registeredTeam,
      player1: data.selectedPlayer1,
      player2: data.selectedPlayer2,
      player1Id: data.selectedPlayer1.sys.id,
      player2Id: data.selectedPlayer2.sys.id,
      changedByUser: currentUser.uid,
    };

    // update groupsAllocation
    const groupRef = doc(db, "competition_groups", competition.sys.id);
    const groups = await getDoc(groupRef);
    if (groups.exists()) {
      const groupData = groups.data();
      const updatedGroupAlloc = Object.keys(groupData).reduce((pre, currGroup) => {
        const updatedTeams = groupData[currGroup].map(x => {
          if (x.id === editTeamId) {
            return {
              ...x,
              ...data,
              paidOn: data.paidOn.toDate().toISOString(),
              timestamp: data.timestamp.toDate().toISOString(),
            }
          }
          return x;
        });

        return {
          ...pre,
          [currGroup]: updatedTeams
        }
      }, {});
      await setDoc(groupRef, updatedGroupAlloc);
    }

    // update schedule
    const scheduldeRef = doc(db, "competition_schedule", competition.sys.id);
    const scheduldes = await getDoc(scheduldeRef);
    if (scheduldes.exists()) {
      const scheduldeData = scheduldes.data();
      const updatedSchedule = Object.keys(scheduldeData).reduce((pre, currentCourt) => {
        const matches = scheduldeData[currentCourt].map(x => {
          if (x.between[0].id === editTeamId) {
            return {
              ...x,
              between: [
                {
                  ...x.between[0],
                  ...data,
                  paidOn: data.paidOn.toDate().toISOString(),
                  timestamp: data.timestamp.toDate().toISOString(),
                },
                x.between[1]
              ]
            }
          }

          if (x.between[1].id === editTeamId) {
            return {
              ...x,
              between: [
                x.between[0],
                {
                  ...x.between[1],
                  ...data,
                  paidOn: data.paidOn.toDate().toISOString(),
                  timestamp: data.timestamp.toDate().toISOString(),
                },
              ]
            }
          }
          return x;
        });

        return {
          ...pre,
          [currentCourt]: matches
        }
      }, {});

      const scheduleRef = doc(db, "competition_schedule", competition.sys.id);
      await setDoc(scheduleRef, updatedSchedule);
    }



    // update application
    const appRef = doc(db, "competition_applications", editTeamId);
    await setDoc(appRef, data);

    setSaving(false);

    // go back
    toast("Team updated successfully");

    goback();
  };

  useEffect(async () => {
    if (editTeamId) {
      const docSnap = await getDoc(doc(db, "competition_applications", editTeamId));
      if (docSnap.exists()) {
        setRegisteredTeam(docSnap.data());
      }
    }
  }, [editTeamId]);

  return (
    <>
      <ToastContainer />
      {
        registeredTeam &&
        <div className="relative flex flex-col min-w-0 break-words mb-6  border-0 justify-center items-center">
          <ApplyForCompForm onSubmit={onSubmit} saving={saving} linkedPlayerId={linkedPlayerId}
            competition={competition} players={players} rule={rule} userRole={userRole}
            currentPlayer1={registeredTeam.player1} currentPlayer2={registeredTeam.player2}
          />
        </div>
      }
    </>
  );
}

function ApplyForCompForm({ onSubmit, competition, saving, players, rule, linkedPlayerId, userRole, currentPlayer1, currentPlayer2 }) {
  const { register, reset, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      selectedPlayer1: currentPlayer1, selectedPlayer2: currentPlayer2,
    }
  });

  const player1 = watch('player1');
  const player2 = watch('player2');
  const selectedPlayer1 = watch('selectedPlayer1');
  const selectedPlayer2 = watch('selectedPlayer2');

  const isValid = () => {
    return !!selectedPlayer1 && !!selectedPlayer2 &&
      selectedPlayer1?.sys?.id !== selectedPlayer2?.sys?.id
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border-0">
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          {/* header */}
          <h6 className=" text-3xl uppercase mt-3 text-center">
            Edit Team
          </h6>
          <p className="text-gray-400 text-sm text-center mb-12">
            <Link href={`/competitions/${competition.slug}`}><a
              className='underline ml-2'
            >
              Go Back
            </a></Link>
          </p>
          <p className="text-gray-400 text-sm mt-3 mb-6 text-center">{format(new Date(competition.date), 'LLLL	d, yyyy')} @ {competition.club}
          </p>
          <h6 className="text-sm mt-3 mb-14 text-center">
            Point: <span className="text-green-600">{((selectedPlayer1?.avtaPoint || 0) + (selectedPlayer2?.avtaPoint || 0)) || '0'}</span> / <span className="text-red-600">{competition.maxPoint - ((selectedPlayer1?.avtaPoint || 0) + (selectedPlayer2?.avtaPoint || 0))}</span>
          </h6>
          {selectedPlayer1 && selectedPlayer2
            && selectedPlayer1.sys.id === selectedPlayer2.sys.id && <div className="text-red-700 text-center py-6">
              Select a different player
            </div>
          }

          {/* Form */}
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password" id="player1">
                  {selectedPlayer1?.sys?.id === linkedPlayerId ? 'Player 1 (You)' : 'Player 1'}
                </label>

                {!selectedPlayer1 ?
                  <>
                    <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("player1", { required: true })} placeholder="Search by name, point or club" />
                    <div className="text-gray-400 text-sm py-2 italic text-center">Available players with Point less than {competition.maxPoint - (selectedPlayer2?.avtaPoint || 0)}</div>
                    <div className='flex flex-wrap justify-center pt-5 items-center'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-20 gap-x-10 mb-32 w-full'>
                        {getPlayers(players, 'Point', player1, competition.maxPoint - (selectedPlayer2?.avtaPoint || 0)).map((player) => (
                          <PlayerCard player={player} key={player.sys.id} size="md" showSelect onSelect={(player) => {
                            setValue('selectedPlayer1', player);
                            setTimeout(() => {
                              const lbl = document.getElementById("player1");
                              lbl && lbl.scrollIntoView();
                            }, 100);
                          }} />
                        ))}
                      </div>
                    </div>
                  </> :
                  <PlayerCard player={selectedPlayer1} size="md" showSelect buttonText="Replace" buttonColor="bg-gray-500" onSelect={(player) => setValue('selectedPlayer1', null)} />
                }
              </div>
            </div>

            <div className="w-full lg:w-6/12 px-4 mt-8 sm:mt-0">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  {selectedPlayer2?.sys?.id === linkedPlayerId ? 'Player 2 (You)' : 'Player 2'}
                </label>

                {!selectedPlayer2 ?
                  <>
                    <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("player2", { required: true })} placeholder="Search by name, point or club" />

                    <div className="text-gray-400 text-sm py-2 italic text-center">Available players with Point less than {competition.maxPoint - (selectedPlayer1?.avtaPoint || 0)}:</div>
                    <div className='flex flex-wrap justify-center pt-5 items-center'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-20 gap-x-10 mb-32 w-full'>
                        {getPlayers(players, 'Point', player2, competition.maxPoint - (selectedPlayer1?.avtaPoint || 0)).map((player) => (
                          <PlayerCard player={player} size="md" key={player.sys.id} showSelect onSelect={(player) => {
                            setValue('selectedPlayer2', player);
                          }} />
                        ))}
                      </div>
                    </div>
                  </> :
                  <PlayerCard player={selectedPlayer2} size="md" showSelect buttonText="Replace" buttonColor="bg-gray-500" onSelect={(player) => setValue('selectedPlayer2', null)} />
                }
              </div>
            </div>
          </div>

          <div className="flex flex-wrap pt-16">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3 text-left lg:text-right flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 justify-center">
                {
                  isValid() && <SaveButton saving={saving} className="w-full sm:w-32"
                    type="submit">Update</SaveButton>
                }

                <Link href={`/competitions/${competition.slug}`}><a
                  className='bg-gray-500 text-white font-bold uppercase text-xs px-8 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 w-full sm:w-32 text-center'
                >
                  Cancel
                </a></Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </form >);
}
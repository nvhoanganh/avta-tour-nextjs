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
import { loadStripe } from '@stripe/stripe-js';
import PlayerCard from '../../components/PlayerCard';
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

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function ApplyForCompetition({ competition, players, rule }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [registeredTeam, setRegisteredTeam] = useState(null);
  const [avaiPlayers, setAvaiPlayers] = useState(players);

  const onSubmit = async data => {
    setSaving(true)

    data = {
      competitionId: competition?.sys?.id,
      compDate: competition?.date,
      maxPoint: competition?.maxPoint,
      slug: competition?.slug,
      title: competition?.title,
      type: competition?.type,
      active: competition?.active,
      timestamp: (new Date()),

      player1: data.selectedPlayer1,
      player2: data.selectedPlayer2,
      player1Id: data.selectedPlayer1.sys.id,
      player2Id: data.selectedPlayer2.sys.id,
      paid: false,
    };

    const docRef = await addDoc(collection(db, "competition_applications"), data);
    setSaving(false);

    setRegisteredTeam({
      id: docRef.id,
      ...data
    });
  };

  useEffect(async () => {
    if (competition) {
      const q = query(collection(db, "competition_applications"), where("competitionId", "==", competition?.sys?.id));

      const querySnapshot = await getDocs(q);
      const registeredTeams = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      const avaiPlayers = players.filter(x => !registeredTeams.find(p => p.player1Id === x.sys.id) && !registeredTeams.find(p => p.player2Id === x.sys.id));
      setAvaiPlayers(avaiPlayers);
    }
  }, [competition]);

  return (
    <>
      <ToastContainer />
      {
        !registeredTeam &&
        <ApplyForCompForm onSubmit={onSubmit} saving={saving}
          competition={competition} players={avaiPlayers} rule={rule} />
      }

      {registeredTeam &&
        <>
          <form action={`/api/checkout_sessions?applicationId=${registeredTeam.id}&competition=${router.query.slug}`} method="POST"
            className="relative flex flex-col min-w-0 break-words mb-6  border-0 justify-center items-center"
          >
            <p className="uppercase py-2 h1">Application received</p>

            <div className="form-group w-96 py-3">
              <TeamCard team={registeredTeam} />
            </div>

            <p className="text-gray-400 text-sm pb-6">Application Id: {registeredTeam.id}</p>
            <p className="text-gray-400 text-sm pb-6">Status: <strong>Not Paid</strong></p>
            <button type="submit" role="link" className="bg-purple-500 text-white active:bg-blue-600 font-bold px-8 py-5 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150
    disabled:cursor-wait whitespace-nowrap
             disabled:bg-gray-200">
              Pay ${competition.costPerTeam}.00 now using Stripe
            </button>

            <p className="pt-3 pb-6 text-gray-400 text-sm">Note: You will be taken to checkout.stripe.com to make this payment</p>
          </form>
        </>
      }
    </>
  );
}

function ApplyForCompForm({ onSubmit, competition, saving, players, rule }) {
  const { register, reset, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  const agreed = watch('agreed');
  const player1 = watch('player1');
  const player2 = watch('player2');
  const selectedPlayer1 = watch('selectedPlayer1');
  const selectedPlayer2 = watch('selectedPlayer2');

  const isValid = () => {
    return !!selectedPlayer1 && !!selectedPlayer2 &&
      selectedPlayer1?.sys?.id !== selectedPlayer2?.sys?.id
      && ((selectedPlayer1?.avtaPoint || 0) + (selectedPlayer2?.avtaPoint || 0)) <= competition.maxPoint
      && !!agreed
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border-0">
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <h6 className="text-gray-400 text-lg mt-3 mb-6 text-center">
            Application Form - {format(new Date(competition.date), 'LLLL	d, yyyy')} - {competition.club}
          </h6>
          <h6 className="text-lg mt-3 mb-6 text-center">
            Current Point: <span className="text-green-600">{((selectedPlayer1?.avtaPoint || 0) + (selectedPlayer2?.avtaPoint || 0)) || '0'}</span> -
            Remaining Point: <span className="text-red-600">{competition.maxPoint - ((selectedPlayer1?.avtaPoint || 0) + (selectedPlayer2?.avtaPoint || 0)) || competition.maxPoint}</span>
          </h6>
          {selectedPlayer1 && selectedPlayer2
            && selectedPlayer1.sys.id === selectedPlayer2.sys.id && <div className="text-red-700 text-center py-6">
              Select a different player
            </div>}
          <div className="flex flex-wrap">

            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Player 1
                </label>

                {!selectedPlayer1 ?
                  <>
                    <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("player1", { required: true })} placeholder="Search by name, point or club" />
                    <div className="text-gray-400 text-sm py-2 italic text-center">Available players with Point less than {competition.maxPoint - (selectedPlayer2?.avtaPoint || 0)}</div>
                    <div className='flex flex-wrap justify-center pt-5 items-center'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-20 gap-x-10 mb-32 w-full'>
                        {getPlayers(players, 'Point', player1, competition.maxPoint - (selectedPlayer2?.avtaPoint || 0)).map((player) => (
                          <PlayerCard player={player} size="md" showSelect onSelect={(player) => setValue('selectedPlayer1', player)} />
                        ))}
                      </div>
                    </div>
                  </> :
                  <PlayerCard player={selectedPlayer1} size="md" showSelect buttonText="Clear" buttonColor="bg-red-500" onSelect={(player) => setValue('selectedPlayer1', null)} />
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
                    <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("player2", { required: true })} placeholder="Search by name, point or club" />

                    <div className="text-gray-400 text-sm py-2 italic text-center">Available players with Point less than {competition.maxPoint - (selectedPlayer1?.avtaPoint || 0)}:</div>
                    <div className='flex flex-wrap justify-center pt-5 items-center'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-20 gap-x-10 mb-32 w-full'>
                        {getPlayers(players, 'Point', player2, competition.maxPoint - (selectedPlayer1?.avtaPoint || 0)).map((player) => (
                          <PlayerCard player={player} size="md" showSelect onSelect={(player) => setValue('selectedPlayer2', player)} />
                        ))}
                      </div>
                    </div>
                  </> :
                  <PlayerCard player={selectedPlayer2} size="md" showSelect buttonText="Clear" buttonColor="bg-red-500" onSelect={(player) => setValue('selectedPlayer2', null)} />
                }
              </div>
            </div>
          </div>

          <div className="flex flex-wrap pt-16">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3 text-left lg:text-right flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 justify-center">
                <div>
                  <PostBody content={rule} />
                </div>
                <div>
                  <label className='inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      {...register("agreed", { required: true })}
                      className='form-checkbox border-0 rounded text-gray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150'
                    />
                    <span className='ml-2 text-sm font-semibold text-gray-600'>
                      I have read terms and conditions
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap pt-16">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3 text-left lg:text-right flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 justify-center">
                {
                  isValid() && <SaveButton saving={saving} className="w-full sm:w-32"
                    type="submit">Submit</SaveButton>
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
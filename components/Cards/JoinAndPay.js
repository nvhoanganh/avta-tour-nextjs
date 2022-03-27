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

export default function JoinGroup({ group, players, linkedPlayerId, userRole }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [registeredTeam, setRegisteredTeam] = useState(null);
  const [avaiPlayers, setAvaiPlayers] = useState(players);

  const onSubmit = async data => {
    setSaving(true)

    data = {
      competitionId: group?.sys?.id,
      compDate: group?.date,
      maxPoint: group?.maxPoint,
      slug: group?.slug,
      title: group?.title,
      type: group?.type,
      active: group?.active,
      timestamp: (new Date()),

      player1: data.selectedPlayer1,
      player2: data.selectedPlayer2,
      player1Id: data.selectedPlayer1.sys.id,
      player2Id: data.selectedPlayer2.sys.id,
      paid: false,
    };

    // const docRef = await addDoc(collection(db, "competition_applications"), data);
    setSaving(false);

    setRegisteredTeam({
      id: docRef.id,
      ...data
    });
  };

  useEffect(() => {
    if (linkedPlayerId) {
      const currentLinkedPlayer = players?.find(x => x.sys.id === linkedPlayerId);
      if (currentLinkedPlayer) {
        setValue('selectedPlayer1', currentLinkedPlayer)
      }
    }
  }, [linkedPlayerId]);

  return (
    <>
      <ToastContainer />
      <>
        <form action={`/api/checkout_sessions?applicationId=${registeredTeam.id}&group=${router.query.id}`} method="POST"
          className="relative flex flex-col min-w-0 break-words mb-6  border-0 justify-center items-center"
        >
          <p className="uppercase py-2 h1">Join</p>

          <div className="form-group w-96 py-3">
            <TeamCard team={registeredTeam} />
          </div>

          <p className="text-gray-400 text-sm pb-6">Application Id: {registeredTeam.id}</p>
          <p className="text-gray-400 text-sm pb-6">Status: <strong>Not Paid</strong></p>
          <button type="submit" role="link" className="bg-purple-500 text-white active:bg-blue-600 font-bold px-8 py-5 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150
    disabled:cursor-wait whitespace-nowrap
             disabled:bg-gray-200">
            Pay ${group.costPerTeam}.00 now using Stripe
          </button>

          <p className="pt-3 pb-6 text-gray-400 text-sm">Note: You will be taken to checkout.stripe.com to make this payment</p>
        </form>
      </>
    </>
  );
}
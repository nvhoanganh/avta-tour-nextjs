import { format } from 'date-fns'
import Link from 'next/link'
import TeamCard from './TeamCard';
import PostBody from '../../components/post-body';
import SaveButton from '../../components/savebutton';
import Stripepaymentinfo from '../../components/stripepaymentinfo';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js';
import PlayerCard from '../../components/PlayerCard';
import { getPlayers, RevalidatePath } from '../../lib/browserapi';
import { db } from '../../lib/firebase';
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import { useFirebaseAuth } from '../../components/authhook';
import { useForm } from "react-hook-form";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function ApplyForCompetition({ competition, players, rule, linkedPlayerId, userRole }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [registeredTeam, setRegisteredTeam] = useState(null);
  const [avaiPlayers, setAvaiPlayers] = useState(players);
  const { user, loadingAuth } = useFirebaseAuth();

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
    await RevalidatePath(user, `/competitions/${competition?.slug}`);

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
        <ApplyForCompForm onSubmit={onSubmit} saving={saving} linkedPlayerId={linkedPlayerId}
          competition={competition} players={avaiPlayers} rule={rule} />
      }

      {registeredTeam &&
        <>
          <form action={`/api/checkout_sessions?applicationId=${registeredTeam?.id}&competition=${router.query.slug}`} method="POST"
            className="relative flex flex-col min-w-0 break-words mb-6  border-0 justify-center items-center"
          >
            <p className="uppercase py-2 h1">Application received</p>

            {
              competition.costPerTeam > 0 ? <>
                <p className="text-gray-400 text-sm pb-6">Application Id: {registeredTeam?.id}</p>
                <p className="text-gray-400 text-sm pb-6">Status: <strong>Not Paid</strong></p>
                <button type="submit" role="link" className="bg-purple-500 text-white active:bg-blue-600 font-bold px-8 py-5 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150
    disabled:cursor-wait whitespace-nowrap
             disabled:bg-gray-200">
                  Pay ${competition.costPerTeam}.00 now with Stripe.com
                </button>

                <Stripepaymentinfo />
              </> : <>
                <Link href={`/competitions/${competition.slug}`}>
                  <a
                    className='bg-blue-500 my-8 text-white font-bold uppercase text-xs px-8 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 w-full sm:w-32 text-center mb-8'
                  >
                    Go Back
                  </a></Link>
              </>
            }
          </form>
        </>
      }
    </>
  );
}

function ApplyForCompForm({ onSubmit, competition, saving, players, rule, linkedPlayerId }) {
  const { register, reset, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  const agreed = watch('agreed');
  const player1 = watch('player1');
  const player2 = watch('player2');
  const selectedPlayer1 = watch('selectedPlayer1');
  const selectedPlayer2 = watch('selectedPlayer2');

  useEffect(() => {
    if (linkedPlayerId) {
      const currentLinkedPlayer = players?.find(x => x.sys.id === linkedPlayerId);
      if (currentLinkedPlayer) {
        setValue('selectedPlayer1', currentLinkedPlayer)
      }
    }
  }, [linkedPlayerId]);

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
          <h6 className=" text-3xl uppercase mt-3 text-center">
            Application Form
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
            </div>}
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
                  <PlayerCard player={selectedPlayer1} size="md" showSelect buttonText="Clear" buttonColor="bg-red-500" onSelect={(player) => setValue('selectedPlayer1', null)} />
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
                            setTimeout(() => {
                              const lbl = document.getElementById("rule");
                              lbl && lbl.scrollIntoView();
                            }, 100);

                          }} />
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
            <div className="relative w-full mb-3 text-left flex flex-col items-center space-y-2 sm:space-y-0 justify-center">
              <div id="rule">
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
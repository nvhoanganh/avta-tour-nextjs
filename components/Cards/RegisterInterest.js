import { format } from 'date-fns'
import Link from 'next/link'
import PostBody from '../../components/post-body';
import SaveButton from '../../components/savebutton';
import Stripepaymentinfo from '../../components/stripepaymentinfo';
import PlayersPicker from '../../components/Cards/PlayersPicker';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import PlayerCard from '../../components/PlayerCard';
import { RevalidatePath } from '../../lib/browserapi';
import { db } from '../../lib/firebase';
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import { useFirebaseAuth } from '../../components/authhook';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterInterest({ competition, players, linkedPlayerId, userRole }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [avaiPlayers, setAvaiPlayers] = useState(players);
  const { user, loadingAuth } = useFirebaseAuth();


  const onSubmit = async data => {
    setSaving(true)

    data = {
      competitionId: competition?.sys?.id,
      compDate: competition?.date,
      maxPoint: competition?.maxPoint,
      timestamp: (new Date()),

      player: data.currentPlayer,
      playerId: data.currentPlayer.sys.id,
    };

    // const docRef = await addDoc(collection(db, "competition_interested_players"), data);

    console.log(data);
    toast('Thanks. Your applicatioon has been submitted');
    setTimeout(() => {
      router.push(`/competitions/${competition.slug}`);
    }, 500);

    setSaving(false);
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
      <RegisterInterestForm onSubmit={onSubmit} saving={saving} linkedPlayerId={linkedPlayerId}
        competition={competition} players={players} registeredPlayers={registeredPlayers} />
    </>
  );
}

function RegisterInterestForm({ onSubmit, competition, saving, player, linkedPlayerId, registeredPlayers, players }) {
  const { register, reset, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValue: {
      player1Style: 'All',
    }
  });

  const currentPlayer = watch('currentPlayer');
  const player1 = watch('player1');
  const selectedPlayer1 = watch('selectedPlayer1');
  const player1Style = watch('player1Style');

  useEffect(() => {
    if (linkedPlayerId) {
      const currentLinkedPlayer = players?.find(x => x.sys.id === linkedPlayerId);
      setValue('currentPlayer', currentLinkedPlayer || null);
    }
  }, [linkedPlayerId, players]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border-0">
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <h6 className=" text-3xl uppercase mt-3 text-center">
            Register Interest
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

          <div className="flex flex-wrap space-y-12">
            <div className="w-full">
              <div className="relative w-full mb-3">
                <label className="block text-gray-600 text-sm mb-2" htmlFor="grid-password" id="player1">
                  Click Register to register your interest in playing this tournament
                </label>

                {currentPlayer &&
                  <PlayerCard player={currentPlayer} size="md" showSelect={false} />
                }
              </div>
            </div>

            <div className="w-full px-4">
              <div className="relative w-full mb-3 text-left lg:text-right flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 justify-center">
                <SaveButton saving={saving} className="w-full sm:w-32"
                  type="submit">Register</SaveButton>

                <Link href={`/competitions/${competition.slug}`}><a
                  className='bg-gray-500 text-white font-bold uppercase text-xs px-8 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 w-full sm:w-32 text-center'
                >
                  Cancel
                </a></Link>
              </div>
            </div>
            <div className="w-full px-4">
              <div className="relative w-full mb-3">
                <label className="uppercase block font-bold mb-2" htmlFor="grid-password" id="player1">
                  These players are looking for partner too!
                </label>

                <p className="block py-4 pb-6  text-gray-600 text-sm italic mb-2">Connect with them via our <a className="text-blue-500 underline" href="https://www.facebook.com/groups/464135091348911" target="_blank">Facebook</a> group</p>

                <PlayersPicker
                  register={register}
                  selectedPlayerNumber="selectedPlayer1"
                  competition={competition}
                  otherPlayer={currentPlayer}
                  players={players}
                  filter={player1}
                  filterName="player1"
                  setValue={setValue}
                  playStyleFilter={player1Style}
                  playerStyleFilterName="player1Style"
                ></PlayersPicker>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>);
}
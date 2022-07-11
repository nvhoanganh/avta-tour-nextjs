import { format } from 'date-fns'
import Link from 'next/link'
import SaveButton from '../../components/savebutton';
import PlayersPicker from '../../components/Cards/PlayersPicker';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import PlayerCard from '../../components/PlayerCard';
import { db } from '../../lib/firebase';
import { setDoc, query, collection, getDocs, doc, where } from "firebase/firestore";
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

      player: data.selectedPlayer1,
      playerId: data.selectedPlayer1.sys.id,
    };

    const docRef = await setDoc(doc(db, "competition_interested_players", `${data.competitionId}_${data.playerId}`), data);

    toast('Thanks. Your application has been submitted');
    setTimeout(() => {
      router.push(`/competitions/${competition.slug}`);
    }, 100);

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
    defaultValues: {
      player1Style: 'All',
      player2Style: 'All',
    }
  });

  const player1 = watch('player1');
  const selectedPlayer1 = watch('selectedPlayer1');
  const player1Style = watch('player1Style');

  useEffect(() => {
    if (linkedPlayerId) {
      const currentLinkedPlayer = players?.find(x => x.sys.id === linkedPlayerId);
      setValue('selectedPlayer1', currentLinkedPlayer || null);
    }
  }, [linkedPlayerId, players]);

  const isValid = () => {
    return !!selectedPlayer1
  }

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

          <p className="mt-3 mb-6">
            <strong>How does this work?</strong>
          </p>

          <p className="mt-3 mb-16">
            Once you have registered your interest in playing this tournament, people will see your name under <strong>Looking for partner</strong> section on the tournament home page.
            Players can reach out to you by joining our <a href="https://www.facebook.com/groups/464135091348911" className="underline text-blue-600" target="_blank">Facebook</a> group.
            <br /><br />
            Once you have found a suitable partner. You can apply and pay <Link href={`/competitions/${competition.slug}/apply`}><a
              className='underline'
            >here</a></Link>
          </p>

          <div className="flex flex-wrap space-y-10">
            <div className="w-full">
              <div className="relative w-full mb-3 flex flex-col items-center justify-center">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password" id="player1">
                  {selectedPlayer1 ? 'Register interest as' : 'Who are you again?'}
                </label>

                {!selectedPlayer1 ?
                  <>
                    <PlayersPicker
                      register={register}
                      selectedPlayerNumber="selectedPlayer1"
                      competition={competition}
                      players={players}
                      filter={player1}
                      filterName="player1"
                      showSelect={true}
                      setValue={setValue}
                      playStyleFilter={player1Style}
                      playerStyleFilterName="player1Style"
                    ></PlayersPicker>
                  </> :
                  <PlayerCard player={selectedPlayer1} size="md" showSelect buttonText="Clear" buttonColor="bg-red-500" onSelect={(player) => setValue('selectedPlayer1', null)} />
                }
              </div>
            </div>

            <div className="w-full">
              <div className="relative w-full mb-3 text-left lg:text-right flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 justify-center">
                {
                  isValid() && <SaveButton saving={saving} className="w-full sm:w-32"
                    type="submit">Register</SaveButton>
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
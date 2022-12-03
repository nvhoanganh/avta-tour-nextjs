import { format } from 'date-fns'
import Link from 'next/link'
import SaveButton from '../../components/savebutton';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import PlayerCard from '../../components/PlayerCard';
import { useFirebaseAuth } from '../../components/authhook';
import PlayersPicker from '../../components/Cards/PlayersPicker';
import { RevalidatePath } from '../../lib/browserapi';
import { db } from '../../lib/firebase';
import { query, collection, doc, setDoc, deleteDoc, getDocs, getDoc, where } from "firebase/firestore";

import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditApplicationCompetition({ competition, players, rule, linkedPlayerId, userRole, editTeamId, currentUser }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [registeredTeam, setRegisteredTeam] = useState(null);
  const [avaiPlayers, setAvaiPlayers] = useState(players);
  const { user, loadingAuth } = useFirebaseAuth();

  const goback = () => {
    router.push(`/competitions/${router.query.slug}`);
  }

  const deleteTeam = async () => {
    if (confirm('Are you sure you want to delete')) {
      console.log('deleting team: ' + editTeamId);
      await deleteDoc(doc(db, "competition_applications", editTeamId));
      await RevalidatePath(user, `/competitions/${competition?.slug}`);
      toast("Team deleted successfully");
      setTimeout(() => goback(), 750);
    }
  }

  useEffect(async () => {
    if (competition) {
      const q = query(collection(db, "competition_applications"), where("competitionId", "==", competition?.sys?.id));

      const querySnapshot = await getDocs(q);
      const registeredTeams = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      // const avaiPlayers = players.filter(x => !registeredTeams.find(p => p.player1Id === x.sys.id) && !registeredTeams.find(p => p.player2Id === x.sys.id));
      setAvaiPlayers(players);
    }
  }, [competition]);

  const onSubmit = async data => {

    setSaving(true)

    data = {
      ...registeredTeam,
      player1: data.selectedPlayer1,
      player2: data.selectedPlayer2,
      player1Id: data.selectedPlayer1.sys.id,
      player2Id: data.selectedPlayer2.sys.id,
      changedByUser: currentUser.uid,
      ...(!!data.paid && {
        paid: true,
        paidOn: new Date()
      })
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
              paidOn: data.paidOn instanceof Date ? data.paidOn.toISOString() : data.paidOn.toDate().toISOString(),
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
                  paidOn: data.paidOn instanceof Date ? data.paidOn.toISOString() : data.paidOn.toDate().toISOString(),
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
                  paidOn: data.paidOn?.toDate()?.toISOString(),
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
            competition={competition} players={avaiPlayers} rule={rule} userRole={userRole} paid={registeredTeam.paidOn}
            currentPlayer1={registeredTeam.player1} currentPlayer2={registeredTeam.player2} deleteTeam={deleteTeam}
          />
        </div>
      }
    </>
  );
}

function ApplyForCompForm({ onSubmit, competition, saving, players, rule, linkedPlayerId, userRole, currentPlayer1, currentPlayer2, paid, deleteTeam }) {
  const { register, reset, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      selectedPlayer1: currentPlayer1, selectedPlayer2: currentPlayer2, paid
    }
  });

  const player1 = watch('player1');
  const player2 = watch('player2');
  const selectedPlayer1 = watch('selectedPlayer1');
  const selectedPlayer2 = watch('selectedPlayer2');

  const player1Style = watch('player1Style');
  const player2Style = watch('player2Style');

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
                    <PlayersPicker
                      register={register}
                      selectedPlayerNumber="selectedPlayer1"
                      competition={competition}
                      otherPlayer={selectedPlayer2}
                      players={players}
                      filter={player1}
                      filterName="player1"
                      showSelect={true}
                      setValue={setValue}
                      playStyleFilter={player1Style}
                      playerStyleFilterName="player1Style"
                    ></PlayersPicker>
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
                    <PlayersPicker
                      register={register}
                      selectedPlayerNumber="selectedPlayer2"
                      competition={competition}
                      otherPlayer={selectedPlayer1}
                      players={players}
                      filter={player2}
                      filterName="player2"
                      showSelect={true}
                      setValue={setValue}
                      playStyleFilter={player2Style}
                      playerStyleFilterName="player2Style"
                    ></PlayersPicker>
                  </> :
                  <PlayerCard player={selectedPlayer2} size="md" showSelect buttonText="Replace" buttonColor="bg-gray-500" onSelect={(player) => setValue('selectedPlayer2', null)} />
                }
              </div>
            </div>
          </div>

          {
            !paid && userRole?.superuser
            && <div>
              <label className='flex justify-center py-6'>
                <input
                  type='checkbox'
                  {...register("paid")}
                  className='form-checkbox border-0 rounded text-gray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150'
                />
                <span className='ml-2 text-sm font-semibold text-gray-600'>
                  Paid via direct transfer
                </span>
              </label>
            </div>
          }

          <div className="flex flex-wrap pt-16">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3 text-left lg:text-right flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 justify-center sm:space-x-2">
                {
                  isValid() && <SaveButton saving={saving} className="w-full sm:w-32"
                    type="submit">Update</SaveButton>
                }

                {/* <Link href={`/competitions/${competition.slug}`}> */}
                <a onClick={() => {
                  setValue('selectedPlayer2', currentPlayer2);
                  setValue('selectedPlayer1', currentPlayer1);
                }}
                  className='bg-gray-500 text-white font-bold uppercase text-xs px-8 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 w-full sm:w-32 text-center'
                >
                  Cancel
                </a>
                {/* </Link> */}
                <button onClick={deleteTeam} type="button"
                  className='bg-red-500 text-white font-bold uppercase text-xs px-8 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 w-full sm:w-32 text-center'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </form >);
}
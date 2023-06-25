import ToggleContactDetails from '../../../components/ToggleContactDetails';
import Countdown from 'react-countdown';
import ToggleTournamentRule from '../../../components/ToggleTournamentRule';
import PlayerCard from '../../../components/PlayerCard';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'classnames';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import CountDownTimer from '../../../components/countdowntimer';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import ErrorPage from 'next/error';
import ContentfulImage from '../../../components/contentful-image';
import DateComponent from '../../../components/date';
import MatchScheduler from '../../../components/MatchScheduler';
import Container from '../../../components/container';
import PostBody from '../../../components/post-body';
import MoreStories from '../../../components/more-stories';
import MatchResultsTable from '../../../components/Cards/MatchResultsTableFb';
import Header from '../../../components/header';
import PostHeader from '../../../components/post-header';
import Layout from '../../../components/layout';
import { downloadTournamentRankingResults, downloadTournamentResults, getAllCompetitionsForHome, getCompetitionBySlug, getGroupStageStanding, getRulebyId } from '../../../lib/api';
import { getCompResults, getAppliedTeams, getCompSchedule, getCompGroupsAllocation } from '../../../lib/backendapi';
import { removeRegisteredPlayer, getAllGroupMatches, exportGroupsAllocation, getCompGroups, RevalidatePath } from '../../../lib/browserapi';
import { db } from '../../../lib/firebase';
import PostTitle from '../../../components/post-title';
import Intro from '../../../components/intro';
import IndexNavbar from '../../../components/Navbars/IndexNavbar.js';
import Navbar from '../../../components/Navbars/AuthNavbar.js';
import TeamsCard from '../../../components/Cards/TeamsCard2.js';
import MatchResultsCard from '../../../components/Cards/MatchResultsCardFb';
import MatchScheduleCard from '../../../components/Cards/MatchScheduleCard';
import MatchScheduleGrid from '../../../components/Cards/MatchScheduleGrid';
import GroupRankingsCard from '../../../components/Cards/GroupRankingsCardFB';
import TeamRankingTable from '../../../components/Cards/TeamRankingTableFB';
import { useFirebaseAuth } from '../../../components/authhook2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { query, collection, doc, getDocs, getDoc, where, setDoc, deleteDoc } from "firebase/firestore";
import fileDownload from 'js-file-download';

export default function Competition({ competition, preview }) {
  const { user, loadingAuth, fullProfile } = useFirebaseAuth({});
  const router = useRouter();
  const { view } = router.query;
  const [activeTab, setActiveTab] = useState(0);
  const [courtNames, setCourtNames] = useState('');
  const [userRoles, setUserRoles] = useState(null);
  const [lookingPartners, setLookingPartners] = useState([]);
  const [reloadToken, setReloadToken] = useState(null);
  const [hideRules, setHideRules] = useState(false);
  const [hideContacts, setHideContacts] = useState(false);


  const refreshData = async () => {
    toast("Refreshing. Please wait...");
    await RevalidatePath(user, `/competitions/${competition.slug}`);
    window.location.reload();
  }

  const deleteResult = async (record) => {
    if (!userRoles?.superuser) return;

    if (confirm('Are you sure you want to delete?')) {
      try {
        await deleteDoc(doc(db, "competition_results", record.id));
        toast("Result Deleted!");
      } catch (error) {
        toast.error("Delete failed! Reload page and try again, this record might be already deleted");
      }
    }
  }

  const exportGroupMatches = () => {
    const output = getAllGroupMatches(competition.groupsAllocation)
    const txt = output.map(group => {
      return `Group ${group.group}:\n${group.matches.join('\n')}`;
    }).join('\n\n');;

    fileDownload(txt, `${competition.slug} - matches.txt`);
  }

  const editMatchSchedule = () => {
    const courts = prompt('Enter courts available, separated by comma. E.g. 1,2,3,4,5 or 2,4,7,8');
    if (!courts) {
      return;
    }
    setCourtNames(courts.split(',').filter(x => !!x).join(','));
  }

  const deleteSchedule = async () => {
    if (!userRoles?.superuser) return;

    if (confirm('Are you sure you want to delete entire schedule? This action is non reversible')) {
      try {
        await deleteDoc(doc(db, "competition_schedule", competition.sys.id));
        toast("Schedule Deleted! Refresh now");
      } catch (error) {
        toast.error("Delete failed! Reload page and try again, this record might be already deleted");
      }
    }
  }

  const [showEditSchedule, setshowEditSchedule] = useState(false);
  const editSchedule = () => {
    setCourtNames(Object.keys(competition.schedule).join(','));
    setshowEditSchedule(true);
  }

  const allocateTeamsToGroups = async () => {
    const teamsInEachGroup = prompt('Enter Minimum number of teams per group (e.g. 4)');
    if (!teamsInEachGroup || parseInt(teamsInEachGroup) <= 1) {
      alert('Please enter a number larger than 1');
      return;
    }

    const groups = getCompGroups(competition.appliedTeams, parseInt(teamsInEachGroup));
    await setDoc(doc(db, "competition_groups", competition.sys.id), groups);
    alert('Groups created, please reload this page again in 15 seconds');

    window.location.reload();
  }

  if (!router.isFallback && !competition) {
    return <ErrorPage statusCode={404} />;
  }

  useEffect(async () => {
    if (user) {
      const docSnap = await getDoc(doc(db, "user_roles", user.uid));
      if (docSnap.exists()) {
        setUserRoles(docSnap.data());
      }
    } else {
      setUserRoles(null)
    }
  }, [user]);

  useEffect(async () => {
    if (competition) {
      // get list of interested players
      const querySnapshot = await getDocs(query(collection(db, "competition_interested_players"), where("competitionId", "==", competition?.sys?.id)));
      const interestedPlayers = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setLookingPartners(interestedPlayers);
    }
  }, [competition, reloadToken]);

  useEffect(() => {
    setTimeout(() => {
      window.FB?.XFBML && FB.XFBML.parse();
    }, 500);
  }, []);

  const hasResults = competition?.matchScores?.length > 0;
  const teamJoined = competition?.appliedTeams?.length || competition?.teams?.length || 0;

  const viewTeams = () => {
    const teams = document.getElementById("teams");
    teams && teams.scrollIntoView();
    setActiveTab(2);
    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?view=teams';
    window.history.pushState({ path: newurl }, '', newurl);
  };

  const viewLooking = () => {
    const teams = document.getElementById("lookingForPartner");
    teams && teams.scrollIntoView();
  };

  const removeMe = async (player) => {
    if (confirm('Are you sure?')) {
      console.log('removing player', player);
      await removeRegisteredPlayer(competition, player);
      toast("Your registration has been removed");
      setReloadToken(new Date());
    }
  };

  const viewChat = () => {
    const chatWindow = document.getElementById("fb-comments");
    chatWindow && chatWindow.scrollIntoView();
  };

  const saveSchedule = async (data) => {
    await setDoc(doc(db, "competition_schedule", competition.sys.id), data);
    alert('Schedule created, please reload this page again in 15 seconds');

    window.location.reload();
  }

  const editTeam = async (team) => {
    router.push(`/competitions/${router.query.slug}/editteam?teamId=${team.id}`);
  }

  const viewProfile = (player) => {
    router.push(`/players/${player.sys.id}`);
  }

  const ConfigureSchedule = () => (
    <>
      {competition?.schedule ?
        <div>
          {
            userRoles?.superuser
              ? <div className='py-6'>
                <button
                  tupe="button"
                  onClick={deleteSchedule}
                  className="bg-red-500 active:bg-red-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
                  Delete Schedule
                </button>
                <button
                  tupe="button"
                  onClick={editSchedule}
                  className="bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
                  Edit Schedule
                </button>
              </div>
              : null
          }
          <div className='hidden md:block'>
            <MatchScheduleGrid
              schedule={competition.schedule}
              is_superuser={userRoles?.superuser}
              editTeam={editTeam}
            />

            {
              courtNames && showEditSchedule &&
              <div className=' mt-20'>
                <div className='py-10 text-5xl'>New Schedule</div>
                <MatchScheduler
                  courts={courtNames}
                  groupsAllocation={competition.groupsAllocation}
                  saveSchedule={saveSchedule}
                  editMode={true}
                  cancelEdit={() => setshowEditSchedule(false)}
                  schedule={competition.schedule}
                ></MatchScheduler>
              </div>
            }
          </div>
          <div className='md:hidden mt-4 '>
            <MatchScheduleCard
              schedule={competition.schedule}
              is_superuser={userRoles?.superuser}
              editTeam={editTeam}
            />
          </div>
        </div> :
        <section>
          {
            userRoles?.superuser
            && <div className='py-8 text-center'>
              <button
                tupe="button"
                onClick={editMatchSchedule}
                className="bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
                Configure Schedule
              </button>
            </div>
          }
          {
            courtNames &&
            <div className='mt-5'>
              <MatchScheduler courts={courtNames} groupsAllocation={competition.groupsAllocation}
                saveSchedule={saveSchedule}
              ></MatchScheduler>
            </div>
          }
        </section>}
    </>);

  if (view) {
    setTimeout(() => {
      switch (view) {
        case 'teams':
          viewTeams();
          break;
        default:
          break;
      }
    }, 100);
  }

  const totalPoints = competition?.appliedTeams?.reduce((previousTotal, team) => {
    return (
      previousTotal +
      team.player1.avtaPoint +
      team.player2.avtaPoint
    );
  }, 0)
    || competition?.teams?.reduce((previousTotal, team) => {
      return (
        previousTotal +
        team.players[0].avtaPoint +
        team.players[1].avtaPoint
      );
    }, 0);

  return (
    <Layout preview={preview}>
      <ToastContainer />
      <Navbar transparent />

      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <>


          <article>
            <Head>
              <title>
                {competition.title} - {competition.maxPoint === 9999 ? 'Open ' : 'Max ' + competition.maxPoint + ' pt. '}
                | AVTA.
              </title>
              <meta
                name='description'
                content={`Australia Vietnamese Tennis Association - ${competition.title} - Max ${competition.maxPoint} - Date: ${competition.date} - ${competition.excerpt}`}
              />
              <meta
                property='og:image'
                content={competition.heroImage?.url}
              />
            </Head>
          </article>

          <main className='profile-page'>
            <main className='profile-page'>
              <section className='relative block h-500-px'>
                <div
                  className='absolute top-0 w-full h-full bg-center bg-cover'
                  style={{
                    backgroundImage:
                      "url('" +
                      (competition.heroImage?.url ||
                        'https://unsplash.com/photos/HkN64BISuQA/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjM2OTU1MTkw&force=true&w=1920') +
                      "')",
                  }}
                >
                  <span
                    id='blackOverlay'
                    className='w-full h-full absolute opacity-50 bg-black'
                  ></span>
                </div>
                <div
                  className='top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px'
                  style={{ transform: 'translateZ(0)' }}
                >
                  <svg
                    className='absolute bottom-0 overflow-hidden'
                    xmlns='http://www.w3.org/2000/svg'
                    preserveAspectRatio='none'
                    version='1.1'
                    viewBox='0 0 2560 100'
                    x='0'
                    y='0'
                  >
                    <polygon
                      className='text-gray-200 fill-current'
                      points='2560 0 2560 100 0 100'
                    ></polygon>
                  </svg>
                </div>
              </section>
              <section className='relative py-16 bg-gray-200'>
                <div className='container mx-auto px-0 sm:px-4'>
                  <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64'>
                    <div className='px-6'>
                      <div className='flex flex-wrap justify-center'>
                        <div className='w-full lg:w-3/12 px-4 lg:order-2 flex justify-center'>
                          <div className='relative'>
                            <div className='rounded-full shadow-xl text-green-900 bg-gray-100 h-auto align-middle border border-gray-300 absolute -m-20 -ml-20 lg:-ml-16 max-w-300-px text-4xl p-6 text-center'>
                              <i className='fas fa-trophy text-6xl text-yellow-400'></i>
                              {
                                competition.maxPoint === 9999 ? 'Open' : competition.maxPoint
                              }
                            </div>
                          </div>
                        </div>

                        <div className='w-full lg:w-4/12 px-4 lg:order-3 lg:text-right text-center lg:self-center'>
                          <div className='py-6 mt-24 sm:mt-0 flex flex-col sm:flex-row justify-end'>
                            {
                              competition.active
                                ?
                                <>
                                  <Link href={`/competitions/${competition.slug}/apply`}><a
                                    className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                                  >
                                    Apply Now
                                  </a></Link>
                                  {
                                    !lookingPartners?.find(x => x.playerId === fullProfile?.playerId)
                                    && !competition.appliedTeams?.find(x => x.player1Id === fullProfile?.playerId || x.player2Id === fullProfile?.playerId)
                                    &&
                                    <Link href={`/competitions/${competition.slug}/findpartner`}><a
                                      className='bg-indigo-500 active:bg-indigo-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                                    >
                                      Find a partner
                                    </a></Link>
                                  }

                                </>
                                : <span className='text-gray-500'>Tournament Completed</span>
                            }

                            {
                              competition.active && userRoles?.superuser && competition?.groupsAllocation
                                ?
                                <Link href={`/competitions/${competition.slug}/submitscore`}><a
                                  className='bg-gray-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                                >
                                  Submit Score
                                </a>
                                </Link>
                                :
                                competition.active && userRoles?.superuser && !competition.groupsAllocation && competition.appliedTeams?.length > 0 && <button
                                  className='bg-gray-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                                  onClick={allocateTeamsToGroups}
                                  type='button'
                                >
                                  Create Schedule
                                </button>
                            }
                          </div>
                        </div>

                        <div className='w-full lg:w-4/12 px-4 lg:order-1'>
                          <div className='flex justify-center py-4 lg:pt-4 pt-8'>
                            <div className='mr-4 p-3 text-center'>
                              <span className='text-xl font-bold block uppercase tracking-wide text-gray-600'>
                                {teamJoined}
                              </span>
                              <a className='text-sm text-gray-400 underline hover:cursor-pointer' onClick={viewTeams}>
                                {competition?.schedule ? "Schedule" : "Teams"}
                              </a>
                            </div>

                            {
                              lookingPartners?.length > 0
                              && <div className='mr-4 p-3 text-center'>
                                <span className='text-xl font-bold block uppercase tracking-wide text-green-600'>
                                  {lookingPartners?.length}
                                </span>
                                <a className='text-sm text-gray-400 underline hover:cursor-pointer' onClick={viewLooking}>
                                  Interested
                                </a>
                              </div>
                            }

                            <div className='mr-4 p-3 text-center'>
                              <span className='text-xl font-bold block uppercase tracking-wide text-green-700'>
                                {teamJoined > 0
                                  ? (
                                    totalPoints /
                                    teamJoined
                                  ).toFixed(
                                    0
                                  )
                                  : '-'}
                              </span>
                              <span className='text-sm text-gray-400'>
                                Avg Point
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='text-sm leading-normal mt-0 mb-2 text-gray-400 font-bold uppercase'>
                          <a href={`https://maps.google.com/?q=${competition.location?.lat},${competition.location?.lon}`} target='_blank' className='hover:underline'>
                            <i className='fas fa-map-marker-alt mb-4 mr-2 text-lg text-gray-400'></i>{' '}
                            {competition.club},{' '}
                            <DateComponent
                              dateString={
                                competition.date
                              }
                            />
                          </a>

                          {
                            new Date() < new Date(competition.date)
                              ? <div className='text-gray-600'><Countdown date={new Date(competition.date)}
                                renderer={CountDownTimer} />
                              </div>
                              : null
                          }
                        </div>
                      </div>

                      <div className='mx-0 md:mx-4'>
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-10">
                          <h3 className='text-2xl md:text-3xl font-bold tracking-tighter leading-tight'>
                            {competition.title}
                          </h3>
                          {
                            competition.discussionUrl
                              ?
                              <div className="py-6 sm:py-0">
                                <a title="View Chat"
                                  href={competition.discussionUrl}
                                  target="_blank"
                                  className="text-gray-500 hover:underline cursor-pointer whitespace-nowrap" onClick={viewChat}><i className="text-blue-500 fab fa-facebook-messenger hover:underline cursor-pointer" ></i> Discuss &amp; Find Partners
                                </a>
                              </div>
                              : null
                          }
                        </div>

                        {
                          userRoles?.superuser
                          && <div className='mx-0 py-4'>
                            <div className='flex space-x-2 items-center'>
                              <Link href={`/competitions/${competition.slug}/sendsms`}>
                                <a className='hover:cursor-pointer border-t-0 px-2 rounded py-1 align-middle border-l-0 border-r-0 hover:bg-gray-400 whitespace-nowrap p-4 cursor-pointer bg-gray-100'>
                                  Send SMS
                                </a>
                              </Link>
                              <a className='hover:cursor-pointer border-t-0 px-2 rounded py-1 align-middle border-l-0 hover:bg-gray-400 border-r-0 whitespace-nowrap p-4 cursor-pointer bg-gray-100' onClick={refreshData}>
                                Refresh data
                              </a>
                            </div>
                          </div>
                        }

                        {hasResults ?
                          <>
                            {/* has results */}
                            {/* tabs */}
                            <div className='border-b-2 border-gray-300 mt-10'>
                              <ul className='flex cursor-pointer justify-around'>
                                <li className={cn(
                                  'py-2 px-8 flex-grow text-center rounded-t-lg',
                                  {
                                    'bg-gray-200':
                                      activeTab === 0
                                  }
                                )}
                                  onClick={(e) => setActiveTab(0)}
                                >Ranking</li>
                                <li className={cn(
                                  'py-2 px-8 flex-grow text-center rounded-t-lg',
                                  {
                                    'bg-gray-200':
                                      activeTab === 1
                                  }
                                )}
                                  onClick={(e) => setActiveTab(1)}
                                >Results</li>
                                <li className={cn(
                                  'py-2 px-8 flex-grow text-center rounded-t-lg',
                                  {
                                    'bg-gray-200':
                                      activeTab === 2
                                  }
                                )}
                                  onClick={(e) => setActiveTab(2)}
                                >Schedule</li>
                              </ul>
                            </div>

                            {/* tabs content */}
                            <div className="mx-auto mb-20">
                              {
                                activeTab === 0 &&
                                (
                                  <>
                                    {!competition.groupResult || Object.keys(competition.groupResult).length === 0 ? <div className='text-center py-5 italic'>Waiting for first result</div> :
                                      <section>
                                        <div>
                                          <div className='hidden container md:block'>
                                            <TeamRankingTable
                                              groups={
                                                competition.groupResult
                                              }
                                            />
                                          </div>
                                          <div className='md:hidden mt-4 '>
                                            <GroupRankingsCard
                                              groups={competition.groupResult}
                                            />
                                          </div>
                                        </div>
                                      </section>
                                    }
                                  </>)
                              }

                              {
                                activeTab === 1
                                && (
                                  <>
                                    {!competition.matchScores?.length ? <div className='text-center py-5 italic'>Waiting for first result</div> :
                                      <div>
                                        <div className='hidden container md:block'>
                                          <MatchResultsTable
                                            is_superuser={userRoles?.superuser}
                                            deleteMatch={deleteResult}
                                            results={
                                              competition.matchScores
                                            }
                                          />
                                        </div>
                                        <div className='md:hidden mt-4 '>
                                          <MatchResultsCard
                                            is_superuser={userRoles?.superuser}
                                            deleteMatch={deleteResult}
                                            results={competition.matchScores}
                                          />
                                        </div>
                                      </div>
                                    }
                                  </>)
                              }

                              {
                                activeTab === 2
                                && (
                                  <ConfigureSchedule></ConfigureSchedule>
                                )
                              }
                            </div>

                            <div className='prose text-lg my-10 max-w-none'>
                              {documentToReactComponents(
                                competition.description
                                  .json
                              )}
                            </div>

                            {
                              userRoles?.superuser
                              && <div className='mx-0 py-4'>
                                <div>Admin Information:</div>
                                <div className='flex space-x-2 items-center'>
                                  <span className='text-sm text-gray-500 ml-3'>- Competition Id: {competition?.sys?.id}</span>
                                </div>
                              </div>
                            }

                            <div className="py-5">
                              <ToggleContactDetails competition={competition} />
                              <ToggleTournamentRule competition={competition} />
                            </div>
                          </>
                          :
                          <>
                            {/* has no result */}
                            <div className='prose text-lg mt-10 max-w-none'>
                              {documentToReactComponents(
                                competition.description
                                  .json
                              )}
                            </div>

                            {
                              userRoles?.superuser
                              && <div className='mx-0 py-4'>
                                <div>Admin Information:</div>
                                <div className='flex space-x-2 items-center'>
                                  <span className='text-sm text-gray-500 ml-3'>- Competition Id: {competition?.sys?.id}</span>
                                </div>
                              </div>
                            }

                            <div className="py-5">
                              <ToggleContactDetails competition={competition} />
                              <ToggleTournamentRule competition={competition} />
                            </div>

                            {/* show list of players */}

                            {lookingPartners?.length > 0 &&
                              < section >
                                <div id="lookingForPartner" className="text-3xl pt-6">Looking for partner</div>
                                <p className="mt-3 mb-16">
                                  Joining our <a href="https://www.facebook.com/groups/464135091348911" className="underline text-blue-600" target="_blank">Facebook</a> group to contact these players
                                </p>
                                <div className='mt-10 grid grid-cols-2 md:grid-cols-5 md:gap-x-10 lg:gap-x-16 gap-y-20 my-8'>
                                  {lookingPartners.map((player) => (
                                    <PlayerCard player={player.player} key={player.playerId} size="md" showSelect
                                      buttonColor={player.playerId === fullProfile?.playerId || userRoles?.superuser ? "bg-red-500" : "bg-blue-500"}
                                      buttonText={player.playerId === fullProfile?.playerId || userRoles?.superuser ? "Remove" : "View"} onSelect={(player) => player.playerId === fullProfile?.playerId || userRoles?.superuser ? removeMe(player) : viewProfile(player)} />
                                  ))}
                                </div>
                              </section>}

                            {competition.appliedTeams?.length > 0 && !competition?.groupsAllocation &&
                              <section>
                                <div id="teams" className="text-3xl pt-6">Registered Teams</div>
                                <div className='mt-10'>
                                  <TeamsCard
                                    is_superuser={userRoles?.superuser}
                                    uid={user?.uid}
                                    competition={competition}
                                    teams={
                                      competition.appliedTeams
                                    }
                                  />
                                </div>
                              </section>}

                            {competition?.groupsAllocation &&
                              <section>
                                {competition?.schedule &&
                                  <div id="teams" className="text-3xl pt-6">Match Schedule</div>
                                }
                                <ConfigureSchedule></ConfigureSchedule>

                                <div id="teams" className="text-3xl pt-6">Registered Teams</div>
                                <div className="pt-5">
                                  <div className='hidden container md:block'>
                                    <TeamRankingTable
                                      is_superuser={userRoles?.superuser}
                                      editTeam={editTeam}
                                      groups={
                                        competition.groupsAllocation
                                      }
                                    />
                                  </div>
                                  <div className='md:hidden mt-4 '>
                                    <GroupRankingsCard
                                      is_superuser={userRoles?.superuser}
                                      editTeam={editTeam}
                                      groups={competition.groupsAllocation}
                                    />
                                  </div>
                                </div>
                              </section>
                            }
                          </>}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </main>
        </>
      )
      }
    </Layout >
  );
}

export async function getStaticProps({ params, preview = false }) {
  console.log(`${(new Date()).toISOString()} - rebuilt STARTED for comp ${params.slud}`);
  let data = await getCompetitionBySlug(params.slug, preview);

  const matchScores = await getCompResults(data.sys.id);
  const appliedTeams = await getAppliedTeams(data.sys.id);
  const schedule = await getCompSchedule(data.sys.id);
  const groupsAllocation = await getCompGroupsAllocation(data.sys.id);
  const rule = await getRulebyId(data.ruleId || process.env.DEFAULT_RULE, preview);

  data = {
    ...data,
    matchScores,
    schedule,
    appliedTeams,
    rule: rule[0].rule,
    groupsAllocation: groupsAllocation,
    groupResult: getGroupStageStanding(matchScores || [], groupsAllocation || {})
  };
  console.log(`${(new Date()).toISOString()} - rebuilt COMPLETED for comp ${params.slud}`);

  return {
    props: {
      preview,
      competition: data,
    },
    revalidate: 600
  };
}

export async function getStaticPaths() {
  const all = await getAllCompetitionsForHome();
  return {
    paths: all?.map(({ slug }) => `/competitions/${slug}`) ?? [],
    fallback: true,
  };
}

import { useRouter } from 'next/router';
import Countdown from 'react-countdown';
import cn from 'classnames';
import Link from 'next/link';
import Head from 'next/head';
import { Fragment, useState, useEffect } from 'react';
import ErrorPage from 'next/error';
import DateComponent from '../../../components/date';
import CountDownTimer from '../../../components/countdowntimer';
import LadderMatches from '../../../components/ladderMatches';
import Layout from '../../../components/layout';
import { GetMergedPlayers, getLadderDetails, getAllLadders } from '../../../lib/backendapi';
import { RevalidatePath, getFilteredLadderMatches } from '../../../lib/browserapi';
import { highlight, getLadderNotificationObject } from '../../../lib/utils';
import PostTitle from '../../../components/post-title';
import PlayersSelection from '../../../components/playersSelection';
import LadderMatchResultsCard from '../../../components/Cards/LadderMatchResultsCard';
import Navbar from '../../../components/Navbars/AuthNavbar.js';
import { useFirebaseAuth } from '../../../components/authhook2';
import PlayersCard from '../../../components/Cards/PlayersCard';
import LadderRankingsCard from '../../../components/Cards/LadderRankingsCard';
import LadderRankingTable from '../../../components/Cards/LadderRankingTable';
import LadderResultsTable from '../../../components/Cards/LadderResultsTable';
import { deleteDoc, doc } from "firebase/firestore";
import { db } from '../../../lib/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendEmailDeleteLadderResult } from '../../../lib/notificationservice';
import { format } from 'date-fns'


export default function Competition({ ladder, allPlayers, preview }) {
  const { user, fullProfile, loading } = useFirebaseAuth({});
  const router = useRouter();
  const { view } = router.query;
  const [activeTab, setActiveTab] = useState(0);
  const [showOrder, setShowOrder] = useState(false);
  const [filter, setFilter] = useState(null);
  // search and highlight
  useEffect(() => {
    highlight(filter);
  }, [filter]);

  if (!router.isFallback && !ladder) {
    return <ErrorPage statusCode={404} />;
  }

  const registeredPlayersUid = ladder?.players.map(u => u.playerId) || [];
  const registeredPlayersWithLadderPoint = ladder?.players?.filter(x => !!x.ladderPoint).map(u => ({ uid: u.playerId, ladderPoint: u.ladderPoint })) || [];
  const _registeredPlayers = allPlayers?.filter(x => registeredPlayersUid.indexOf(x.uid) !== -1) || [];

  const registeredPlayers = _registeredPlayers.map(x => {
    const playerWithLadderPoint = registeredPlayersWithLadderPoint.filter(p => p.uid === x.uid);
    if (playerWithLadderPoint.length > 0) {
      return {
        ...x,
        avtaPoint: playerWithLadderPoint[0].ladderPoint,
        hasLadderPoint: true
      };
    }
    return x;
  });

  const totalPoints = registeredPlayers.reduce((previousTotal, player) => {
    return (
      previousTotal +
      player?.avtaPoint
    );
  }, 0)

  const viewPlayers = () => {
    const teams = document.getElementById("players");
    teams && teams.scrollIntoView();
    setActiveTab(2);
    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?view=players';
    window.history.pushState({ path: newurl }, '', newurl);
  };

  const viewChat = () => {
    window.FB?.XFBML && FB.XFBML.parse();
    const chatWindow = document.getElementById("fb-comments");
    chatWindow && chatWindow.scrollIntoView();
  };

  useEffect(() => {
    setTimeout(() => {
      window.FB?.XFBML && FB.XFBML.parse();
    }, 500);
  }, []);

  const refreshData = async () => {
    toast("Refreshing. Please wait...");
    await RevalidatePath(user, `/ladders/${ladder.id}`);
    window.location.reload();
  }

  const deleteResult = async (record) => {
    if (!fullProfile?.roles?.superuser) return;

    if (confirm('Are you sure you want to delete?\nNote: All players will get notification via email')) {
      try {
        await deleteDoc(doc(db, "ladder_results", record.id));
        toast("Deleted!, click on Refresh Data link to see updated results!");

        // send email
        let notification = getLadderNotificationObject(ladder, record, registeredPlayers);
        notification.date = format(new Date(record.timestamp), 'E, LLL d, h:mmaa');
        notification.deletedBy = user.displayName;
        await sendEmailDeleteLadderResult(user, notification);
        return;
      } catch (error) {
        toast.error("Delete failed! Reload page and try again, this record might be already deleted");
      }
    }
  }

  const userIsLadderMember = () => ladder.players.map(player => player.playerId).indexOf(fullProfile?.uid) >= 0

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
                {ladder.name} - {ladder.homeClub} | AVTA.
              </title>
              <meta
                name='description'
                content={`Australia Vietnamese Tennis Association - ${ladder.name} - ${ladder.homeClub}`}
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
                      (ladder.heroImage?.url ||
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
                    <div className='px-6 pb-20'>
                      <div className='flex flex-wrap justify-center'>
                        <div className='w-full lg:w-3/12 px-4 lg:order-2 flex justify-center'>
                          <div className='relative'>
                            <div className='rounded-full shadow-xl text-green-900 bg-gray-100 h-auto align-middle border border-gray-300 absolute -m-20 -ml-20 lg:-ml-16 max-w-300-px text-4xl p-6 text-center'>
                              <i className='fas fa-award text-6xl text-yellow-400'></i>
                              ${ladder.joiningFee}
                            </div>
                          </div>
                        </div>

                        <div className='w-full lg:w-4/12 px-4 lg:order-3 lg:text-right text-center lg:self-center'>
                          <div className='py-6 mt-24 sm:mt-0 flex flex-col sm:flex-row justify-end'>
                            {
                              !userIsLadderMember() && ladder.open
                                ? <Link href={`/ladders/${ladder.id}/apply`}><a
                                  className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                                >
                                  Join Now
                                </a></Link> :
                                (new Date() >= new Date(ladder.startDate) ?
                                  <>
                                    {
                                      ladder.open
                                        ? <Link href={`/ladders/${ladder.id}/submitscore`}>
                                          <a
                                            className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                                          >
                                            Submit Score
                                          </a>
                                        </Link>
                                        : null
                                    }
                                  </>
                                  :

                                  <span className="bg-gray-500 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"><i className="fas fa-sign-in-alt"></i>&nbsp;You Joined</span>)
                            }
                          </div>
                        </div>

                        <div className='w-full lg:w-4/12 px-4 lg:order-1'>
                          <div className='flex justify-center py-4 lg:pt-4 pt-8'>
                            <div className='mr-4 p-3 text-center'>
                              <span className='text-xl font-bold block uppercase tracking-wide text-gray-600'>
                                {ladder.players.length}
                              </span>
                              <a className='text-sm text-gray-400 underline hover:cursor-pointer' onClick={viewPlayers}>
                                Players
                              </a>
                            </div>
                            <div className='mr-4 p-3 text-center'>
                              <span className='text-xl font-bold block uppercase tracking-wide text-green-700'>
                                {registeredPlayers?.length > 0
                                  ? (
                                    totalPoints /
                                    registeredPlayers?.length
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
                        <div className='text-sm leading-normal mt-0 mb-2  font-bold uppercase'>
                          <a href={`https://maps.google.com/?q=${ladder.homeClub}`} target='_blank' className='hover:underline'>
                            <i className='fas fa-map-marker-alt mr-2 text-lg '></i>{' '}
                            {ladder.homeClub}
                          </a>
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='text-sm leading-normal mt-0 mb-2 '>
                          <a href={`https://maps.google.com/?q=${ladder.homeClub}`} target='_blank' className='hover:underline'>
                            {
                              new Date() < new Date(ladder.startDate) || new Date() > new Date(ladder.endDate)
                                ? <>
                                  <DateComponent
                                    dateString={
                                      ladder.startDate
                                    }
                                  />
                                  {' - '}
                                  <DateComponent
                                    dateString={
                                      ladder.endDate
                                    }
                                  />
                                </>
                                : <span className=' text-md'><Countdown date={new Date(ladder.endDate)}
                                  renderer={CountDownTimer} /> left</span>
                            }
                          </a>
                        </div>
                      </div>

                      <div className='mx-0 md:mx-4 pt-8'>
                        <div className="flex justify-between items-center mt-10 flex-col sm:flex-row">
                          <h3 className='text-2xl md:text-3xl font-bold tracking-tighter leading-tight'>
                            {ladder.name}
                          </h3>
                          <div className="pt-6 sm:pt-0">
                            <a title="View Chat" className="text-gray-500 hover:underline cursor-pointer whitespace-nowrap" onClick={viewChat}><i className="text-blue-500 far fa-comments hover:underline cursor-pointer" ></i> Comments</a>
                          </div>
                        </div>
                      </div>

                      <div className='mx-0 md:mx-4 mt-10' dangerouslySetInnerHTML={{ __html: ladder?.rule?.replace(/\\n/g, '<br />') }}>
                      </div>

                      <div className='mx-0 md:mx-4 mt-10'>
                        <div className='py-3'>
                          <button className='bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-3 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150
                            disabled:cursor-wait whitespace-nowrap cursor-pointer
                                     disabled:bg-gray-200' onClick={refreshData}>
                            <i className="fas fa-sync"></i> Refresh
                          </button>
                          {
                            ladder?.ownerId === user?.uid
                              ?
                              <a className='bg-gray-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-3 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150
                            disabled:cursor-wait whitespace-nowrap cursor-pointer
                                     disabled:bg-gray-200'
                                href={`/ladders/edit/${ladder.id}`}
                              >
                                <i className="fas fa-edit"></i> Edit
                              </a>
                              : null
                          }
                        </div>

                      </div>

                      <div id="fb-comments" className="fb-comments" data-href={`https://avtatour.com/ladders/${ladder.id}`} data-width="100%" data-numposts="5"></div>


                      {ladder.scores?.length > 0 &&
                        <section className="mx-0 md:mx-4 mt-10">
                          {/* tabs - with search filter score */}
                          {
                            activeTab === 1
                              ? <div className='hidden sticky py-2 mb-6 rounded-lg shadow-lg opacity-95 bg-gray-200 md:flex space-x-1 justify-center items-center max-w-xl mx-auto'>
                                <input type="text"
                                  className="border px-2 py-1 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full mx-3 ease-linear transition-all duration-150"
                                  placeholder="Filter by multiple player names"
                                  value={filter} onChange={(e) => { setFilter(e.target.value) }}
                                />
                              </div>
                              : null
                          }
                          <div className='border-b-2 border-gray-300'>
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
                              >Players</li>
                            </ul>
                          </div>

                          {/* tabs content */}
                          <div className="mx-auto mb-20">
                            {
                              activeTab === 0 &&
                              (
                                <>
                                  <div className='hidden container md:block'>
                                    <LadderRankingTable players={ladder.players} ranking={ladder.ranking} ladder={ladder}></LadderRankingTable>
                                  </div>
                                  <div className='md:hidden mt-4'>
                                    <LadderRankingsCard players={ladder.players} ranking={ladder.ranking} ladder={ladder}></LadderRankingsCard>
                                  </div>
                                </>
                              )
                            }

                            {
                              activeTab === 1
                              && (
                                <>
                                  <div className='hidden container md:block'>
                                    <LadderResultsTable results={getFilteredLadderMatches(ladder.scores || [], filter)}
                                      deleteResult={deleteResult}
                                      is_owner={ladder.ownerId === user?.uid}
                                      is_member={userIsLadderMember()}
                                      is_superuser={fullProfile?.roles?.superuser}></LadderResultsTable>
                                  </div>
                                  <div className='md:hidden mt-4'>
                                    <LadderMatchResultsCard
                                      results={ladder.scores}
                                      deleteResult={deleteResult}
                                      is_member={userIsLadderMember()}
                                      is_owner={ladder.ownerId === user?.uid}
                                      is_superuser={fullProfile?.roles?.superuser}></LadderMatchResultsCard>
                                  </div>
                                </>
                              )
                            }

                            {
                              activeTab === 2
                              && <>
                                <div className='w-full text-center py-3 pt-5'>
                                  {
                                    !showOrder && ladder.tonightMatches?.tonightMatches && <div>
                                      <LadderMatches matchUps={ladder.tonightMatches.tonightMatches}></LadderMatches></div>
                                  }
                                  <div className="py-5">
                                    <button
                                      className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                                      onClick={() => setShowOrder(!showOrder)}
                                      className={cn(
                                        ' active:bg-blue-600 uppercase  font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150',
                                        {
                                          'bg-gray-300 text-black': showOrder,
                                          'bg-blue-500 text-white': !showOrder,
                                        }
                                      )}
                                    >
                                      {showOrder ? 'Cancel' : 'Create play order'}
                                    </button>
                                  </div>
                                  {
                                    showOrder
                                    && <div className="py-8">
                                      <PlayersSelection results={ladder.scores} user={user} registered={registeredPlayers} ladderId={ladder.id}></PlayersSelection>
                                    </div>
                                  }
                                </div>
                                <PlayersCard allPlayers={registeredPlayers} hideSearch />
                              </>
                            }
                          </div>


                        </section>}

                      {!ladder.scores?.length && ladder.players?.length > 0 &&
                        <section className="mx-0 md:mx-4">
                          {/* no match played yet */}
                          {
                            !showOrder && ladder.tonightMatches?.tonightMatches && <div>
                              <LadderMatches matchUps={ladder.tonightMatches.tonightMatches}></LadderMatches></div>
                          }
                          <div className="py-5 mx-auto w-full flex items-center justify-center">
                            <button
                              className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                              onClick={() => setShowOrder(!showOrder)}
                              className={cn(
                                ' active:bg-blue-600 uppercase  font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150',
                                {
                                  'bg-gray-300 text-black': showOrder,
                                  'bg-blue-500 text-white': !showOrder,
                                }
                              )}
                            >
                              {showOrder ? 'Cancel' : 'Create play order'}
                            </button>
                          </div>
                          {
                            showOrder
                            &&
                            <div className="py-8 mx-auto flex justify-center">
                              <PlayersSelection results={[]} user={user} registered={registeredPlayers} ladderId={ladder.id}></PlayersSelection>
                            </div>
                          }
                          <div id="players" className="text-2xl pt-10">Registered Players</div>
                          <PlayersCard allPlayers={registeredPlayers} hideSearch />
                        </section>}
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
  const allPlayers = await GetMergedPlayers()

  console.log(`${(new Date()).toISOString()} - rebuilt STARTED for ladder ${params.id}`);
  const data = await getLadderDetails(params.id, allPlayers);
  console.log(`${(new Date()).toISOString()} - Get data from Firebase done`);

  console.log(`${(new Date()).toISOString()} - rebuilt FINISHED for ladder ${params.id}`);
  return {
    props: {
      preview,
      ladder: data,
      allPlayers
    },
  };
}

export async function getStaticPaths() {
  const all = await getAllLadders();
  return {
    paths: all?.map(({ id }) => `/ladders/${id}`) ?? [],
    fallback: true,
  };
}
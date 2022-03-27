import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';
import ErrorPage from 'next/error';
import DateComponent from '../../../components/date';
import Layout from '../../../components/layout';
import { getLadderDetails, mergeUsersAndPlayersData, getAllLadders } from '../../../lib/backendapi';
import PostTitle from '../../../components/post-title';
import Navbar from '../../../components/Navbars/AuthNavbar.js';
import { useFirebaseAuth } from '../../../components/authhook2';
import PlayersCard from '../../../components/Cards/PlayersCard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllPlayers } from '../../../lib/api';

export default function Competition({ ladder, allPlayers, preview }) {
  const { fullProfile, loading } = useFirebaseAuth({});
  const router = useRouter();
  const { view } = router.query;
  const [activeTab, setActiveTab] = useState(0);

  if (!router.isFallback && !ladder) {
    return <ErrorPage statusCode={404} />;
  }

  const registeredPlayersUid = ladder?.players.map(u => u.playerId) || [];
  const registeredPlayers = allPlayers?.filter(x => registeredPlayersUid.indexOf(x.uid) !== -1) || [];
  const totalPoints = registeredPlayers.reduce((previousTotal, player) => {
    return (
      previousTotal +
      player.avtaPoint
    );
  }, 0)

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
                {ladder.name} - {ladder.homeGroup} | AVTA.
              </title>
              <meta
                name='description'
                content={`Australia Vietnamese Tennis Association - ${ladder.name} - ${ladder.homeGroup}`}
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
                              {registeredPlayers.length > 0 ? <>
                                ${registeredPlayers.length * ladder.joiningFee}
                              </> : <><i className="fas fa-baseball-ball text-6xl block text-green-400"></i></>}
                            </div>
                          </div>
                        </div>

                        <div className='w-full lg:w-4/12 px-4 lg:order-3 lg:text-right text-center lg:self-center'>
                          <div className='py-6 mt-24 sm:mt-0 flex flex-col sm:flex-row justify-end'>
                            {
                              ladder.players.map(player => player.playerId).indexOf(fullProfile?.uid) < 0
                                ? <Link href={`/ladders/${ladder.id}/apply`}><a
                                  className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                                >
                                  Join Now
                                </a></Link> :
                                <span className="bg-gray-500 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"><i class="fas fa-sign-in-alt"></i>&nbsp;You Joined</span>
                            }
                          </div>
                        </div>

                        <div className='w-full lg:w-4/12 px-4 lg:order-1'>
                          <div className='flex justify-center py-4 lg:pt-4 pt-8'>
                            <div className='mr-4 p-3 text-center'>
                              <span className='text-xl font-bold block uppercase tracking-wide text-gray-600'>
                                {ladder.players.length}
                              </span>
                              <a className='text-sm text-gray-400 underline hover:cursor-pointer'>
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
                            />{' '}
                            {ladder.joiningFee && <>, Fee ${ladder.joiningFee}.00</>}
                          </a>
                        </div>
                      </div>

                      <div className='mx-0 md:mx-4 pt-8'>
                        <h3 className='mt-10 text-3xl pt-6 mx-auto'>
                          {ladder.name}
                        </h3>
                      </div>

                      <div className='mx-0 md:mx-4 mt-10'>
                        {ladder.rule}
                      </div>

                      {ladder.players?.length > 0 &&
                        <section className="mx-0 md:mx-4">
                          <div id="teams" className="text-2xl pt-6">Registered Players</div>
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
  const data = await getLadderDetails(params.id, preview);

  let allPlayers = (await getAllPlayers(preview)) ?? [];
  allPlayers = await mergeUsersAndPlayersData(allPlayers);

  return {
    props: {
      preview,
      ladder: data,
      allPlayers
    },
    revalidate: 1
  };
}

export async function getStaticPaths() {
  const all = await getAllLadders();
  return {
    paths: all?.map(({ id }) => `/ladders/${id}`) ?? [],
    fallback: true,
  };
}

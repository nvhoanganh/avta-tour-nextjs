import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'classnames';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import ErrorPage from 'next/error';
import ContentfulImage from '../../../components/contentful-image';
import DateComponent from '../../../components/date';
import Container from '../../../components/container';
import PostBody from '../../../components/post-body';
import MoreStories from '../../../components/more-stories';
import MatchResultsTable from '../../../components/Cards/MatchResultsTableFb';
import Header from '../../../components/header';
import PostHeader from '../../../components/post-header';
import Layout from '../../../components/layout';
import { downloadTournamentRankingResults, downloadTournamentResults, getAllCompetitionsForHome, getCompetitionBySlug, getGroupStageStanding } from '../../../lib/api';
import { getCompResults } from '../../../lib/backendapi';
import { db } from '../../../lib/firebase';
import PostTitle from '../../../components/post-title';
import Intro from '../../../components/intro';
import IndexNavbar from '../../../components/Navbars/IndexNavbar.js';
import Navbar from '../../../components/Navbars/AuthNavbar.js';
import TeamsCard from '../../../components/Cards/TeamsCard2.js';
import MatchResultsCard from '../../../components/Cards/MatchResultsCardFb';
import GroupRankingsCard from '../../../components/Cards/GroupRankingsCard';
import TeamRankingTable from '../../../components/Cards/TeamRankingTable';
import { useFirebaseAuth } from '../../../components/authhook';
import { query, collection, doc, getDocs, getDoc, where, setDoc } from "firebase/firestore";

export default function Competition({ competition, preview }) {
  const { user, loadingAuth } = useFirebaseAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [userRoles, setUserRoles] = useState(null);

  console.log(competition.groupResult);

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

  const hasResults = competition?.matchResults?.length > 0 || competition?.matchScores?.length > 0;
  const teamJoined = competition?.teams?.length || 0;

  const totalPoints = competition?.teams?.reduce((previousTotal, team) => {
    return (
      previousTotal +
      team.players[0].avtaPoint +
      team.players[1].avtaPoint
    );
  }, 0);

  return (
    <Layout preview={preview}>
      <Navbar transparent />

      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <>
          <article>
            <Head>
              <title>
                {competition.title} - Max {competition.maxPoint}{' '}
                Point | AVTA.
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
                                competition.maxPoint
                              }
                            </div>
                          </div>
                        </div>

                        <div className='w-full lg:w-4/12 px-4 lg:order-3 lg:text-right text-center lg:self-center'>
                          <div className='py-6 mt-24 sm:mt-0 flex flex-col sm:flex-row justify-end'>
                            {
                              competition.active
                                ? <a
                                  href={
                                    competition.applicationGForm
                                  }
                                  target='_blank'
                                  className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                                >
                                  Apply Now
                                </a>
                                : <span className='text-gray-500'>Tournament Completed</span>
                            }
                            {
                              competition.active && userRoles?.superuser
                              &&
                              <Link href={`/competitions/${competition.slug}/submitscore`}><a
                                className='bg-gray-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                              >
                                Submit Score
                              </a>
                              </Link>
                            }
                          </div>
                        </div>

                        <div className='w-full lg:w-4/12 px-4 lg:order-1'>
                          <div className='flex justify-center py-4 lg:pt-4 pt-8'>
                            <div className='mr-4 p-3 text-center'>
                              <span className='text-xl font-bold block uppercase tracking-wide text-gray-600'>
                                {teamJoined}
                              </span>
                              <span className='text-sm text-gray-400'>
                                Teams Applied
                              </span>
                            </div>
                            <div className='mr-4 p-3 text-center'>
                              <span className='text-xl font-bold block uppercase tracking-wide text-green-700'>
                                {teamJoined > 0
                                  ? (
                                    totalPoints /
                                    teamJoined
                                  ).toFixed(
                                    1
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
                            <i className='fas fa-map-marker-alt mr-2 text-lg text-gray-400'></i>{' '}
                            {competition.club},{' '}
                            <DateComponent
                              dateString={
                                competition.date
                              }
                            />
                          </a>
                        </div>
                      </div>

                      <div className='mx-0 md:mx-4'>
                        <h3 className='mt-10 text-2xl md:text-3xl font-bold tracking-tighter leading-tight mx-auto'>
                          {competition.title}
                        </h3>
                        <div className='prose text-lg mt-10'>
                          {documentToReactComponents(
                            competition.description
                              .json
                          )}
                        </div>

                        {hasResults ? <>
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
                              >Groups</li>
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
                              >Teams</li>
                            </ul>
                          </div>

                          {/* tabs content */}
                          <div className="mx-auto mb-20">
                            {
                              activeTab === 0 &&
                              (
                                <>
                                  {!competition.groupRanking || Object.keys(competition.groupRanking).length === 0 ? <div className='text-center py-5 italic'>Waiting for first result</div> :
                                    <section>
                                      <div>
                                        <div className='hidden container md:block'>
                                          <TeamRankingTable
                                            groups={
                                              competition.groupRanking
                                            }
                                          />
                                        </div>
                                        <div className='md:hidden mt-4 '>
                                          <GroupRankingsCard
                                            groups={competition.groupRanking}
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
                                    <section>
                                      <div>
                                        <div className='hidden container md:block'>
                                          <MatchResultsTable
                                            results={
                                              competition.matchScores
                                            }
                                          />
                                        </div>
                                        <div className='md:hidden mt-4 '>
                                          <MatchResultsCard
                                            results={competition.matchScores}
                                          />
                                        </div>
                                      </div>
                                    </section>}
                                </>)
                            }

                            {
                              activeTab === 2
                              && (
                                <>
                                  {!competition.teams?.length ? <div className='text-center py-5 italic'>No record found</div> :
                                    <section>
                                      <div className='mt-10 '>
                                        <TeamsCard
                                          teams={
                                            competition.teams
                                          }
                                        />
                                      </div>
                                    </section>}
                                </>)
                            }
                          </div></> :
                          <>
                            {competition.teams?.length &&
                              <section>
                                <div className="text-3xl pt-6">Registered Teams</div>
                                <div className='mt-10'>
                                  <TeamsCard
                                    teams={
                                      competition.teams
                                    }
                                  />
                                </div>
                              </section>}
                          </>}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </main>
        </>
      )}
    </Layout>
  );
}

export async function getStaticProps({ params, preview = false }) {
  let data = await getCompetitionBySlug(params.slug, preview);
  if (data?.resultSheets) {
    const matchResults = await downloadTournamentResults(data.resultSheets);
    data = {
      ...data,
      matchResults
    };
  }

  const matchScores = await getCompResults(data.sys.id);
  data = {
    ...data,
    matchScores,
    groupResult: getGroupStageStanding(matchScores)
  };


  if (data?.rankingSheet) {
    const groupRanking = await downloadTournamentRankingResults(data.rankingSheet);
    data = {
      ...data,
      groupRanking
    };
  }


  return {
    props: {
      preview,
      competition: data,
    },
    revalidate: 10
  };
}

export async function getStaticPaths() {
  const all = await getAllCompetitionsForHome();
  return {
    paths: all?.map(({ slug }) => `/competitions/${slug}`) ?? [],
    fallback: true,
  };
}

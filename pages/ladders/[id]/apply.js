import { useRouter } from 'next/router';
import { useState, Fragment, useEffect } from 'react'
import Link from 'next/link';
import Head from 'next/head';
import Spinner from '../../../components/spinner';
import Layout from '../../../components/layout';
import PostTitle from '../../../components/post-title';
import Navbar from '../../../components/Navbars/AuthNavbar.js';
import JoinAndPay from '../../../components/Cards/JoinAndPay';
import { useFirebaseAuth } from '../../../components/authhook2';
import { getLadderBasicDetails, getAllLadders } from '../../../lib/backendapi';
import {
  getPlayerById,
} from '../../../lib/browserapi';

export default function Apply({ ladder, preview }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const { fullProfile } = useFirebaseAuth({ protectedRoute: true, reason: 'apply' });
  useEffect(async () => {
    if (fullProfile) {
      const contentfuldata = await getPlayerById(fullProfile.playerId, false);
      setProfile({
        ...fullProfile,
        ...contentfuldata
      })
    }
  }, [fullProfile]);

  if (!router.isFallback && !ladder) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout preview={false}>
      <Navbar transparent />

      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <>
          <article>
            <Head>
              <title>Apply - {ladder.name} - Starting {ladder.startDate} | AVTA.</title>
            </Head>
          </article>

          <main className='profile-page'>
            <section className='relative block h-500-px'>
              <div
                className='absolute top-0 w-full h-full bg-center bg-cover'
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
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
              <div className='container mx-auto px-4'>
                <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64'>
                  <div className='px-6'>
                    <div className='flex flex-wrap justify-center'>
                      <div className='w-full lg:w-3/12 px-4 lg:order-2 flex justify-center'>
                        <div className='relative'>
                          <div className='rounded-full shadow-xl text-green-900 bg-gray-100 h-auto align-middle border border-gray-300 absolute -m-20 -ml-20 -ml-16 max-w-300-px text-4xl p-6 text-center'>
                            <i className='fas fa-award text-6xl text-yellow-400'></i>
                            ${ladder.joiningFee}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='mt-24'>
                      {
                        !profile
                          ?
                          <div className='text-center py-28'><Spinner color="blue"></Spinner> Loading...</div> :
                          <div>
                            {fullProfile?.playerId ?
                              <div>
                                {
                                  ladder.players.map(player => player.playerId).indexOf(fullProfile?.uid) >= 0 ?
                                    <div className="text-center py-8">You already joined this ladder
                                      <div className="py-10">
                                        <Link href={`/ladders/${ladder.id}`}><a
                                          className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                                        >
                                          Go Back
                                        </a></Link>
                                      </div>
                                    </div> :
                                    <div>
                                      <JoinAndPay ladder={ladder} fullProfile={profile}></JoinAndPay>
                                    </div>
                                }
                              </div> :
                              <div className="text-red-600 text-center py-8">
                                Please link your player profile before joining this ladder
                                <p className="py-8">
                                  <Link href={`/editmyprofile`}><a
                                    className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150'
                                  >
                                    View my profile
                                  </a></Link>
                                </p>
                              </div>
                            }
                          </div>
                      }
                    </div>

                  </div>
                </div>
              </div>
            </section>
          </main>
        </>)}
    </Layout >
  );
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getLadderBasicDetails(params.id, []);

  return {
    props: {
      preview,
      ladder: data,
    },
    revalidate: 60
  };
}

export async function getStaticPaths() {
  const all = await getAllLadders();
  return {
    paths: all?.map(({ id }) => `/ladders/${id}/apply`) ?? [],
    fallback: true,
  };
}

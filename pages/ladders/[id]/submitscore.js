import { useRouter } from 'next/router';
import { format } from 'date-fns'
import Link from 'next/link';
import Head from 'next/head';
import Spinner from '../../../components/spinner';
import Layout from '../../../components/layout';
import PostTitle from '../../../components/post-title';
import Navbar from '../../../components/Navbars/AuthNavbar.js';
import SubmitLadderScore from '../../../components/Cards/SubmitLadderScore';
import { useFirebaseAuth } from '../../../components/authhook2';
import { useEffect } from 'react';
import { GetMergedPlayersWithNoAvatar, getLadderBasicDetails, getAllLadders } from '../../../lib/backendapi';


export default function SubmitScore({ ladder, allPlayers, preview }) {
  const router = useRouter();
  const { user, fullProfile, loading } = useFirebaseAuth({ protectedRoute: true, reason: 'apply' });

  useEffect(() => {
    if (fullProfile
      && ladder.players.map(player => player.playerId).indexOf(fullProfile?.uid) < 0
      && new Date() >= new Date(ladder.startDate)) {
      router.push(`/ladders/${ladder.id}`);
    }
  }, [ladder, fullProfile]);

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
              <title>Submit Score - {ladder.name} - Starting format {format(new Date(ladder.startDate), 'LLLL	d, yyyy')} | AVTA.</title>
            </Head>
          </article>

          <main className='profile-page'>
            <section className='relative block h-500-px'>
              <div
                className='absolute top-0 w-full h-full bg-center bg-cover'
                style={{
                  backgroundImage:
                    "url('https://unsplash.com/photos/HkN64BISuQA/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjM2OTU1MTkw&force=true&w=1920')",
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
                          <div className='rounded-full shadow-xl text-green-900 bg-gray-100 h-auto align-middle border border-gray-300 absolute -m-20 -ml-20 lg:-ml-16 max-w-300-px text-4xl p-6 text-center'>
                            <i className='fas fa-award text-6xl text-yellow-400'></i>
                            ${ladder.joiningFee}
                          </div>
                        </div>
                      </div>

                      <div className='w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center'>
                        <div className='py-6 px-3 mt-32 sm:mt-0 w-full text-center md:text-right'>
                          <Link href={`/ladders/${router.query.id}`}>
                            <a
                              className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none 
                            focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150 cursor-pointer'
                            >
                              Go Back
                            </a>
                          </Link>
                        </div>
                      </div>
                      <div className='w-full lg:w-4/12 px-4 lg:order-1'>
                        <div className='flex justify-center py-4 lg:pt-4 pt-8'>
                        </div>
                      </div>
                    </div>
                    <div className='mt-12'>
                      {
                        loading
                          ?
                          <div className='text-center py-28'><Spinner color="blue"></Spinner> Loading...</div> :
                          <SubmitLadderScore ladder={ladder} allPlayers={allPlayers} user={user}></SubmitLadderScore>
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
  const allPlayers = await GetMergedPlayersWithNoAvatar()
  const data = await getLadderBasicDetails(params.id, allPlayers);

  return {
    props: {
      preview,
      ladder: data,
      allPlayers
    },
    revalidate: 60
  };
}

export async function getStaticPaths() {
  const all = await getAllLadders();
  return {
    paths: all?.map(({ id }) => `/ladders/${id}/submitscore`) ?? [],
    fallback: true,
  };
}

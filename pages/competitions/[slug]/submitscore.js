import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import ErrorPage from 'next/error';
import ContentfulImage from '../../../components/contentful-image';
import Container from '../../../components/container';
import Spinner from '../../../components/spinner';
import PostBody from '../../../components/post-body';
import MoreStories from '../../../components/more-stories';
import Header from '../../../components/header';
import PostHeader from '../../../components/post-header';
import Layout from '../../../components/layout';
import PostTitle from '../../../components/post-title';
import Intro from '../../../components/intro';
import IndexNavbar from '../../../components/Navbars/IndexNavbar.js';
import Navbar from '../../../components/Navbars/AuthNavbar.js';
import SubmitScoreForm from '../../../components/Cards/SubmitScore';
import SendOtp from '../../../components/sendotp';
import { useFirebaseAuth } from '../../../components/authhook';
import { useEffect, useState } from 'react'
import { db } from '../../../lib/firebase';
import { query, collection, doc, getDocs, getDoc, where } from "firebase/firestore";
import { downloadTournamentRankingResults, downloadTournamentResults, getAllCompetitionsForHome, getCompetitionBySlug } from '../../../lib/api';


export default function SubmitScore({ competition, preview }) {
  const router = useRouter();
  const { user, loadingAuth } = useFirebaseAuth();

  const goback = () => {
    router.push(`/competitions/${router.query.slug}`);
  }

  useEffect(async () => {
    if (!loadingAuth) {
      if (!user) {
        goback();
        return;
      }

      const docRef = doc(db, "user_roles", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userRoles = docSnap.data();
        if (!userRoles?.superuser) goback();
      } else {
        goback();
      }
    }
  }, [user, loadingAuth]);

  return (
    <Layout preview={false}>
      <Navbar transparent />

      <article>
        <Head>
          <title>Submit Score - {competition.title} - Max {competition.maxPoint}{' '}
            Point | AVTA.</title>
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
                      <div className='rounded-full shadow-xl text-green-900 bg-gray-100 h-auto align-middle border border-gray-300 absolute -m-20 -ml-20 lg:-ml-16 max-w-300-px text-4xl p-6 text-center'>
                        <i className='fas fa-trophy text-6xl text-yellow-400'></i>
                        {
                          competition.maxPoint
                        }
                      </div>
                    </div>
                  </div>

                  <div className='w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center'>
                    <div className='py-6 px-3 mt-32 sm:mt-0 w-full text-center md:text-right'>
                      <a
                        className='bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none 
                            focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150 cursor-pointer'
                        onClick={goback}
                      >
                        Go Back
                      </a>
                    </div>
                  </div>
                  <div className='w-full lg:w-4/12 px-4 lg:order-1'>
                    <div className='flex justify-center py-4 lg:pt-4 pt-8'>
                    </div>
                  </div>
                </div>
                <div className='mt-12'>
                  {
                    loadingAuth
                      ?
                      <div className='text-center py-28'><Spinner color="blue"></Spinner> Loading...</div> :
                      <SubmitScoreForm competition={competition}></SubmitScoreForm>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export async function getStaticProps({ params, preview = false }) {
  let data = await getCompetitionBySlug(params.slug, preview);

  return {
    props: {
      preview,
      competition: data,
    },
    revalidate: 60
  };
}

export async function getStaticPaths() {
  const all = await getAllCompetitionsForHome();
  return {
    paths: all?.map(({ slug }) => `/competitions/${slug}/submitscore`) ?? [],
    fallback: true,
  };
}

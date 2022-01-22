import { useRouter } from 'next/router';
import Head from 'next/head';
import ErrorPage from 'next/error';
import ContentfulImage from '../../components/contentful-image';
import Container from '../../components/container';
import PostBody from '../../components/post-body';
import MoreStories from '../../components/more-stories';
import Header from '../../components/header';
import PostHeader from '../../components/post-header';
import Layout from '../../components/layout';
import PostTitle from '../../components/post-title';
import Intro from '../../components/intro';
import IndexNavbar from '../../components/Navbars/IndexNavbar.js';
import Navbar from '../../components/Navbars/AuthNavbar.js';
import ProfileSettings from '../../components/Cards/UserProfile';
import SendOtp from '../../components/sendotp';
import { useFirebaseAuth } from '../../components/authhook';
import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase';
import { query, collection, doc, getDocs, getDoc, where } from "firebase/firestore";


export default function EditMyProfile() {
  const router = useRouter();
  const player = null;
  const { user } = useFirebaseAuth();

  return (
    <Layout preview={false}>
      <Navbar transparent />

      <article>
        <Head>
          <title>Edit Profile | AVTA.</title>
          {/* <meta
            property='og:image'
            content={player.coverImage?.url}
          /> */}
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
                      {player?.coverImage?.url ? (
                        <div className='rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px'>
                          <ContentfulImage
                            width={250}
                            height={250}
                            className='rounded-full'
                            src={
                              player
                                .coverImage
                                .url
                            }
                          />
                        </div>
                      ) : (
                        <img
                          alt={player?.fullName}
                          src='https://via.placeholder.com/150'
                          className='rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px'
                        />
                      )}
                    </div>
                  </div>
                  <div className='w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center'>
                    <div className='py-6 px-3 mt-32 sm:mt-0'>
                    </div>
                  </div>
                  <div className='w-full lg:w-4/12 px-4 lg:order-1'>
                    <div className='flex justify-center py-4 lg:pt-4 pt-8'>
                    </div>
                  </div>
                </div>
                <div className='mt-12'>
                  <ProfileSettings></ProfileSettings>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
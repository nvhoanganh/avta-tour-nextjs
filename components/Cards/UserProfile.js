import React from "react";
import Link from 'next/link'
import PostTitle from '../../components/post-title';
import { useRouter } from 'next/router';
import { useFirebaseAuth } from '../authhook';
import { useState, useEffect } from 'react'
import {
  getPlayerById,
} from '../../lib/browserapi';
import { db } from '../../lib/firebase';
import { query, collection, doc, getDocs, getDoc, where, setDoc } from "firebase/firestore";

import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserProfile() {
  const { user, loadingAuth } = useFirebaseAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const onSubmit = async data => {
    setSaving(true)
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    let updated = docSnap.exists() ? { ...docSnap.data(), ...data } : { ...data, uid: user.uid };
    updated = { ...updated, photoURL: user.photoURL };
    await setDoc(docRef, updated);

    if (updated.playerId) {
      // need to load this twice for Vercel to rebuild the app
      await fetch(`/players/${updated.playerId}`);
      setTimeout(() => {
        fetch(`/players/${updated.playerId}`);
      }, 1100);
    } else {
      console.log('no linked player');
    }

    toast("Profile Updated");
    setSaving(false)
  };

  useEffect(async () => {
    if (!loadingAuth && !user) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push('/auth/login');
      return;
    }

    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      let formData = docSnap.exists() ? { ...user, ...docSnap.data() } : { ...user, allowContact: true };
      if (formData.playerId) {
        const contentfuldata = await getPlayerById(formData.playerId, false);
        formData = {
          ...formData, ...contentfuldata,
          displayName: contentfuldata.fullName,
          homeClub: formData.homeClub,
          nickName: formData.nickName,
        };
      }

      setUserProfile(formData);
    }
  }, [user, loadingAuth]);

  return (
    <>
      <ToastContainer />
      {
        loadingAuth || !userProfile
          ? <div className="text-center text-xl py-24">Fetching information. Please wait...</div> :
          <UserForm onSubmit={onSubmit} userProfile={userProfile} saving={saving} />
      }
    </>
  );
}

function UserForm({ onSubmit, userProfile, saving }) {
  const [showHowToGetPoint, setShowHowToGetPoint] = useState(false);
  const { displayName, email, mobileNumber, suburb,
    allowContact, aboutMe, homeClub, nickName, avtaPoint } = userProfile;

  const { register, reset, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      displayName, email, mobileNumber,
      suburb, allowContact, aboutMe, homeClub, nickName
    }
  });

  return (<form onSubmit={handleSubmit(onSubmit)}>
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6  border-0">
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
          User Information
        </h6>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                Display Name
              </label>
              <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("displayName", { required: true })} />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                Nick Name
              </label>
              <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("nickName", { required: true })} />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                AVTA Score
              </label>
              {avtaPoint ? <span className="px-3 py-3 text-gray-600 text-4xl text-green-600">{avtaPoint} Pt.</span> :
                <span className="py-3  text-red-600">Not Yet Assigned.
                  <a className="underline cursor-pointer text-gray-600 mx-2" onClick={() => setShowHowToGetPoint(true)}>How do I get one?</a>
                </span>
              }

              {showHowToGetPoint &&
                <div className="py-3 my-4 border rounded shadow-xl px-3 bg-gray-50">
                  <p>
                    If you believe a player profile has been created for you. You can find and link it <Link href={`/players`}>
                      <a target='_blank' className="underline cursor-pointer text-gray-600 mx-1">here</a>
                    </Link>.
                  </p>

                  <p className="pt-5">
                    Otherwise, contact one of our members
                    <Link href={`/players`}>
                      <a target='_blank' className="underline cursor-pointer text-gray-600 mx-1">here</a>
                    </Link>
                    to organize a skill check match. You will be given a preliminary AVTA Point when you participate in one of our upcoming
                    <Link href={`/competitions`}>
                      <a target='_blank' className="underline cursor-pointer text-gray-600 mx-1">competitions</a>
                    </Link>
                    . Your official AVTA point will be given to you by AVTA Skill Review Panel

                    <p className="pt-5">
                      <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" type="button"
                        onClick={() => setShowHowToGetPoint(false)}
                      >
                        Got it!
                      </button>
                    </p>
                  </p>
                </div>}
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                Home Club
              </label>
              <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                {...register("homeClub", { required: true })} />
            </div>
          </div>
        </div>

        <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Contact Information
        </h6>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                Mobile
              </label>
              <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("mobileNumber", {
                pattern: /\+614\d{8}/
              })}
                placeholder="+61412345678" />
              {errors.mobileNumber && <span className="text-red-500">Australian Mobile, e.g +614XXXXXXXX</span>}
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                Suburb
              </label>
              <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                {...register("suburb", { required: true })} />
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                Email
              </label>
              <input type="text" {...register("email")} readOnly className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-gray-100 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
          </div>
          <div className="w-full lg:w-12/12 px-4 py-3">
            <div className="relative w-full mb-3">
              <label className="inline-flex items-center cursor-pointer">
                <input id="customCheckLogin" type="checkbox" className="form-checkbox border rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150" {...register("allowContact")} />
                <span className="ml-2 text-sm font-semibold text-blueGray-600">Show my contact details to other logged in users</span>
              </label>
            </div>
          </div>
        </div>

        <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
          About Me
        </h6>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-12/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                About me
              </label>
              <textarea type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="4" {...register("aboutMe")}></textarea>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap pt-5">
          <div className="w-full lg:w-12/12 px-4">
            <div className="relative w-full mb-3 text-center">
              <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-8 py-4 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 disabled:bg-gray-200" type="submit"
                disabled={saving}
              >
                {!saving ? 'Save Changes' : 'Saving...'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form >);
}

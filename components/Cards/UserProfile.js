import React from "react";
import PostTitle from '../../components/post-title';
import { useRouter } from 'next/router';
import { useFirebaseAuth } from '../authhook';
import { useState, useEffect } from 'react'
import {
  getPlayerById,
} from '../../lib/browserapi';
import { db } from '../../lib/firebase';
import { query, collection, doc, getDocs, getDoc, where } from "firebase/firestore";

import { useForm } from "react-hook-form";


export default function CardSettings() {
  const { user, loadingAuth } = useFirebaseAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);

  const onSubmit = data => console.log('form value', data);

  useEffect(async () => {
    if (!loadingAuth && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      let formData = docSnap.exists ? { ...user, ...docSnap.data() } : user;
      if (formData.playerId) {
        const contentfuldata = await getPlayerById(formData.playerId, false);
        formData = { ...formData, ...contentfuldata, displayName: contentfuldata.fullName };
      }
      setUserProfile(formData);
    }
  }, [user, loadingAuth]);

  return (
    <>
      {
        loadingAuth || !userProfile
          ? <div className="text-center text-xl py-24">Loading…</div> :
          <UserForm onSubmit={onSubmit} userProfile={userProfile} />
      }
    </>
  );
}

function UserForm({ onSubmit, userProfile }) {
  const { displayName, email, postcode, mobileNumber, suburb,
    allowContact, aboutMe, homeClub, nickName, avtaPoint } = userProfile;

  const { register, reset, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      displayName, email, postcode, mobileNumber,
      suburb, allowContact, aboutMe, homeClub, nickName, avtaPoint
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
              <input type="text" className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("displayName", { required: true })} />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                Nick Name
              </label>
              <input type="text" className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("nickName", { required: true })} />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                AVTA Score
              </label>
              <input type="text" readOnly className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-gray-100 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("avtaPoint")} />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                Home Club
              </label>
              <input type="text" className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("homeClub")} />
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
              <input type="text" className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("mobileNumber", {
                pattern: /\+614\d{8}/
              })}
              placeholder="+61412345678"/>
              {errors.mobileNumber && <span className="text-red-500">Australian Mobile, e.g +614XXXXXXXX</span>}
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                Suburb
              </label>
              <input type="text" className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("suburb")} />
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                Email
              </label>
              <input type="text" {...register("email")} readOnly className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-gray-100 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
          </div>
          <div className="w-full lg:w-12/12 px-4 py-3">
            <div className="relative w-full mb-3">
              <label className="inline-flex items-center cursor-pointer">
                <input id="customCheckLogin" type="checkbox" className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150" {...register("allowContact")} />
                <span className="ml-2 text-sm font-semibold text-blueGray-600">Allow other members can contact me via SMS</span>
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
              <textarea type="text" className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="4" {...register("aboutMe")}></textarea>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap pt-5">
          <div className="w-full lg:w-12/12 px-4">
            <div className="relative w-full mb-3 text-center">
              <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-8 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" type="submit">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>);
}

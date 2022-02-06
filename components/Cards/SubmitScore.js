import React from "react";
import { format } from 'date-fns'
import Link from 'next/link'
import PostTitle from '../../components/post-title';
import SaveButton from '../../components/savebutton';
import { useRouter } from 'next/router';
import { useFirebaseAuth } from '../authhook';
import { useState, useEffect } from 'react'
import Spinner from '../../components/spinner';
import {
  getPlayerById,
} from '../../lib/browserapi';
import { db } from '../../lib/firebase';
import { query, collection, doc, getDocs, getDoc, where, setDoc } from "firebase/firestore";

import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserProfile({ competition }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const onSubmit = async data => {
    setSaving(true)
    console.log('saving now');
    toast("Profile Updated");
    setSaving(false)
  };

  return (
    <>
      <ToastContainer />

      {
        saving
          ? <><div className="text-center py-24"><Spinner size="lg" color="blue" /> Loading...</div> :</>
          : <SubmitScoreForm onSubmit={onSubmit} saving={saving} competition={competition} />
      }

    </>
  );
}

function SubmitScoreForm({ onSubmit, competition, saving }) {
  const { register, reset, handleSubmit, watch, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6  border-0">
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Submit Result for {competition.maxPoint} - {format(new Date(competition.date), 'LLLL	d, yyyy')} - {competition.club}
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Winning Team
                </label>
                <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("displayName", { required: true })} />
              </div>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Losing Team
                </label>
                <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("nickName", { required: true })} />
              </div>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Games won by losing team
                </label>
                <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" {...register("nickName", { required: true })} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap pt-5">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3 text-center">
                <SaveButton saving={saving}
                  type="submit">Submit Score</SaveButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form >);
}

import React, { useState } from "react";
import Link from 'next/link';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import TeamAvatar from '../TeamAvatarFb';
import { GroupsColours, getSchedules } from '../../lib/browserapi';
import { format } from 'date-fns'

export default function MatchScheduleCard({ schedule }) {
  const [filter, setFilter] = useState(null);

  return (
    <>
      <div className='sticky py-2 mb-5 rounded-lg shadow-lg opacity-95 bg-gray-200 flex space-x-1 justify-center items-center'>
        <input type="text"
          className="border px-2 py-1 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full mx-3 ease-linear transition-all duration-150"
          placeholder="Search by name/nickname"
          value={filter} onChange={(e) => { setFilter(e.target.value) }}
        />
      </div>

      {Object.keys(schedule).sort().map((court) => (
        <div className='flex flex-wrap'>
          <div className="text-bold text-xl text-center py-3">{court}</div>
          <div className='w-full lg:w-6/12 xl:w-3/12'>
            {getSchedules(schedule[court], filter).map((match, index) => (
              <div key={match.id} className={`relative flex min-w-0 break-words rounded mb-3 xl:mb-0 shadow bg-${GroupsColours[match.group]}-50`}>
                <div className={`flex pl-2 pt-1 font-bold tex-xl text-${GroupsColours[match.group]}-600`} >{match.group}
                  <span className="text-sm">{index + 1}</span>
                </div>
                <div className="flex-auto py-2">
                  <div className="flex flex-wrap">
                    <div className="relative w-auto pl-1 flex-initial flex items-center">
                      <TeamAvatar team={match.between[0]} />
                      <span className="ml-2">{match.between[0].players[0]?.fullName} + {match.between[0].players[1]?.fullName}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap">
                    <div className="relative w-auto pl-1 flex-initial flex items-center">
                      <TeamAvatar team={match.between[1]} />
                      <span className="ml-2">{match.between[1].players[0]?.fullName} + {match.between[1].players[1]?.fullName}</span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

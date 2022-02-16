import React from "react";
import Link from 'next/link';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import TeamAvatar from '../TeamAvatarFb';
import { format } from 'date-fns'

export default function MatchScheduleCard({ schedule }) {
  return (
    <>
      {Object.keys(schedule).sort().map((court) => (
        <div className='flex flex-wrap'>
          <div className="text-bold text-xl text-center py-3">{court}</div>
          <div className='w-full lg:w-6/12 xl:w-3/12'>
            {schedule[court].map((match, index) => (
              <div key={match.id} className="relative flex min-w-0 break-words  bg-white rounded mb-3 xl:mb-0 shadow-lg">
                <div className="flex pl-2 pt-1 font-bold tex-xl">{match.group}</div>
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

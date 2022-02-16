import React from "react";
import Link from 'next/link';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import TeamAvatar from '../TeamAvatarFb';
import { format } from 'date-fns'

export default function MatchScheduleGrid({ schedule }) {
  return (
    <div className="flex space-x-4">
      {Object.keys(schedule).sort().map((court) => (
        <div>
          <div className="text-bold text-xl text-center py-3">{court}</div>
          <div className=' border border-solid border-gray-200 rounded flex flex-col space-y-2 p-2 py-4' style={{ width: 270 }}>
            {schedule[court].map((match) => (
              <div key={match.id} className="relative flex min-w-0 break-words  bg-white rounded mb-3 xl:mb-0 shadow-lg">
                <div className="flex pl-1 font-bold tex-xl">{match.group}</div>
                <div className="flex-auto py-2">
                  <div className="flex flex-wrap">
                    <div className="relative w-auto pl-1 flex-initial flex items-center">
                      <TeamAvatar team={match.between[0]} />
                      <span className="ml-1 text-sm">{match.between[0].players[0]?.nickName} + {match.between[0].players[1]?.nickName}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap">
                    <div className="relative w-auto pl-1 flex-initial flex items-center">
                      <TeamAvatar team={match.between[1]} />
                      <span className="ml-1 text-sm">{match.between[1].players[0]?.nickName} + {match.between[1].players[1]?.nickName}</span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

import React from "react";
import Link from 'next/link';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import TeamAvatar from '../TeamAvatarFb';
import { format } from 'date-fns'
import { GroupsColours, getPlayer } from '../../lib/browserapi';

export default function MatchScheduleGrid({ schedule, is_superuser, editTeam }) {

  return (
    <div className="flex space-x-4">
      {Object.keys(schedule).sort().map((court) => (
        <div key={court}>
          <div className="text-bold text-xl text-center py-3">{court}</div>
          <div className=' border border-solid border-gray-200 rounded flex flex-col space-y-2 p-2 py-4' style={{ width: 270 }}>
            {schedule[court].map((match, index) => (
              <div key={match.id} className={`relative flex min-w-0 break-words bg-${GroupsColours[match.group]}-50 rounded mb-3 xl:mb-0 shadow-lg h-32 ${match.isPlaceholder ? 'bg-gray-300' : ''}`}>
                <div className={`flex pl-2 pt-1 font-bold tex-xl text-${GroupsColours[match.group]}-600`} >{match.group}
                  <span className="text-sm">{index + 1}</span>
                </div>
                {
                  !match.isPlaceholder
                    ?
                    <div className="flex-auto py-2">
                      <div className="flex flex-wrap">
                        <div className="relative w-auto pl-1 flex-initial flex">
                          <TeamAvatar team={match.between[0]} />
                          <div>
                            <div className="ml-3 text-sm text-left">{getPlayer(match.between[0], 0)?.fullName} +</div>
                            <div className="ml-3 text-sm text-left">{getPlayer(match.between[0], 1)?.fullName}
                              {is_superuser &&
                                <button type="button" onClick={() => editTeam(match.between[0])} className="ml-3 text-black cursor-pointer underline text-sm">
                                  Edit
                                </button>
                              }
                            </div>

                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap">
                        <div className="relative w-auto pl-1 flex-initial flex items-center">
                          <TeamAvatar team={match.between[1]} />
                          <div>
                            <div className="ml-3 text-sm text-left">{getPlayer(match.between[1], 0)?.fullName}</div>
                            <div className="ml-3 text-sm text-left">{getPlayer(match.between[1], 1)?.fullName}
                              {is_superuser &&
                                <button type="button" onClick={() => editTeam(match.between[1])} className="ml-3 text-black cursor-pointer underline text-sm">
                                  Edit
                                </button>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    :
                    <div className="flex justify-end items-center py-2">
                      <div className="flex flex-col mx-auto">
                        <div className="ml-3 text-left font-bold uppercase">Court </div>
                        <div className="ml-3 text-left font-bold uppercase">Not Available</div>
                      </div>
                    </div>
                }
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

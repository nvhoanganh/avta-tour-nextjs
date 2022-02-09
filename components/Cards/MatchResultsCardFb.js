import React from "react";
import Link from 'next/link';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import TeamAvatar from '../TeamAvatarFb';
import { format } from 'date-fns'

export default function MatchResultsCard({ results }) {
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full lg:w-6/12 xl:w-3/12'>
          {(results || []).map((result) => (
            <div key={result.timestamp} className="relative flex flex-col min-w-0 break-words  bg-white rounded mb-6 xl:mb-0 shadow-lg">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap ">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <div
                      className=
                      'font-bold  text-gray-600 '
                    >
                      {result.winners.players[0]?.nickName} + {result.winners.players[1]?.nickName}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {result.stage === 'Group Stage' ? 'Group ' + result.group + ' Round Robin' : result.knockoutRound}, {format(new Date(result.timestamp), 'h:mm a')}
                    </div>
                  </div>

                  <div className="relative w-auto pl-4 flex-initial flex">
                    <TeamAvatar team={result.winners} />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className=' text-gray-600 text-lg align-center p-1 shadow px-4 border rounded border-gray-200'>
                    6-{result.gameWonByLoser}
                  </div>
                </div>

                <div className="flex flex-wrap mt-2">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <div
                      className=
                      'font-bold  text-gray-600 '
                    >
                      {result.losers.players[0]?.nickName} + {result.losers.players[1]?.nickName}
                    </div>
                    <div className='text-sm text-gray-600'>
                    </div>
                  </div>

                  <div className="relative w-auto pl-4 flex-initial flex">
                    <TeamAvatar team={result.losers} />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

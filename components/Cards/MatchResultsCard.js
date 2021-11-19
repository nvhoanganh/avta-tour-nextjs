import React from "react";
import Link from 'next/link';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import TeamAvatar from '../TeamAvatar';
import { format } from 'date-fns'

export default function MatchResultsCard({ results }) {
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full lg:w-6/12 xl:w-3/12'>
          {(results || []).map((result) => (
            <div key={result.datetime} className="relative flex flex-col min-w-0 break-words  bg-white rounded mb-6 xl:mb-0 shadow-lg">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap ">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <div
                      className=
                      'font-bold  text-gray-600 '
                    >
                      {result.winners.player1.nickName} + {result.winners.player2.nickName}
                    </div>
                    <div className='text-sm text-gray-600'>
                      GROUP {result.winners.groupName} - {format(new Date(result.datetime), 'h:mm a')}
                    </div>
                  </div>

                  <div className="relative w-auto pl-4 flex-initial flex">
                    <TeamAvatar team={result.winners} />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className=' text-gray-600 text-lg align-center p-1 shadow px-4 border rounded border-gray-200'>
                    6-{result.score}
                  </div>
                </div>

                <div className="flex flex-wrap mt-2">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <div
                      className=
                      'font-bold  text-gray-600 '
                    >
                      {result.losers.player1.nickName} + {result.losers.player2.nickName}
                    </div>
                    <div className='text-sm text-gray-600'>
                      GROUP {result.losers.groupName}
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

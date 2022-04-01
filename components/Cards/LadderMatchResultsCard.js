import React, { useState } from "react";
import Link from 'next/link';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import TeamAvatar from '../TeamAvatarFb';
import { getFilteredLadderMatches } from '../../lib/browserapi';
import { format } from 'date-fns'

export default function LadderMatchResultsCard({ results, is_superuser, deleteResult }) {
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

      <div className='flex flex-wrap'>
        <div className='w-full lg:w-6/12 xl:w-3/12'>
          {getFilteredLadderMatches(results || [], filter).map((result) => (
            <div key={result.timestamp} className="relative flex flex-col min-w-0 break-words  bg-white rounded mb-6 xl:mb-0 shadow-lg">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <div
                      className=
                      'font-bold  text-gray-600'
                    >
                      {result.winnerUser1?.fullName} + {result.winnerUser2?.fullName}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {format(new Date(result.timestamp), 'd/M h:mm a')}
                    </div>
                  </div>

                  <div className="relative w-auto pl-4 flex-initial flex">
                    <TeamAvatar team={{ player1: result.winnerUser1, player2: result.winnerUser2 }} />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className=' text-gray-600 text-lg align-center shadow px-4 border rounded border-gray-200'
                    onClick={() => deleteResult && deleteResult(result)}
                  >
                    {result.gameWonByWinners}-{result.gameWonByLosers}
                    {is_superuser &&
                      <span
                        className="ml-3 text-red-500 cursor-pointer"
                      >
                        Delete
                      </span>
                    }
                  </div>
                </div>

                <div className="flex flex-wrap mt-2">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <div
                      className=
                      'font-bold  text-gray-600 '
                    >
                      {result.loserUser1?.fullName} + {result.loserUser2?.fullName}
                    </div>
                    <div className='text-sm text-gray-600'>
                    </div>
                  </div>

                  <div className="relative w-auto pl-4 flex-initial flex">
                    <TeamAvatar team={{ player1: result.loserUser1, player2: result.loserUser2 }} />
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

import React, { useState } from "react";
import Link from 'next/link';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import TeamAvatar from '../TeamAvatarFb';
import { getFilteredMatches, getWinningScoreForComp } from '../../lib/browserapi';
import { format } from 'date-fns'

export default function MatchResultsCard({ results, is_superuser, deleteMatch }) {
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
          {getFilteredMatches(results || [], filter).map((result) => {
            const w1 = result.winners.player1 || result.winners.players[0];
            const w2 = result.winners.player2 || result.winners.players[1];

            const l1 = result.losers.player1 || result.losers.players[0];
            const l2 = result.losers.player2 || result.losers.players[1];

            return <div key={result.timestamp} className="relative flex flex-col min-w-0 break-words  bg-white rounded mb-6 xl:mb-0 shadow-lg">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap ">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <div
                      className=
                      ' text-gray-600 '
                    >
                      {w1.fullName} + {w2.fullName}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {result.stage === 'Knockout Stage' && result.knockoutRound === 'Final' ? <i class="fas fa-trophy text-yellow-400 pr-1"></i> : ''}
                      {result.stage === 'Knockout Stage' && result.knockoutRound === '3rdPlace' ? <i className='fas fa-medal text-yellow-700'></i> : ''}
                      {result.stage === 'Group Stage' ? 'Group ' + result.group + ' Round Robin' : result.knockoutRound}, {format(new Date(result.timestamp), 'h:mm a')}
                    </div>
                  </div>

                  <div className="relative w-auto pl-4 flex-initial flex">
                    <TeamAvatar team={result.winners} />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className=' text-gray-600 text-lg align-center p-1 shadow px-4 border rounded border-gray-200'
                    onClick={() => deleteMatch && deleteMatch(result)}
                  >
                    {getWinningScoreForComp(result)}-{result.gameWonByLoser}
                    {is_superuser &&
                      <span className="ml-3 text-red-500 cursor-pointer">
                        Delete
                      </span>
                    }
                  </div>
                </div>

                <div className="flex flex-wrap mt-2">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <div
                      className=
                      ' text-gray-600 '
                    >
                      {l1.fullName} + {l2.fullName}
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
          })}
        </div>
      </div>
    </>
  );
}

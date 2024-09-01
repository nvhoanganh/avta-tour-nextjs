import React, { useState, useEffect } from "react";
import Link from 'next/link';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import TeamAvatar from '../TeamAvatarFb';
import DropDown from '../dropdown';
import { getFilteredLadderMatches } from '../../lib/browserapi';
import { highlight } from '../../lib/utils';
import { format } from 'date-fns'

export default function LadderMatchResultsCard({ results, is_superuser, deleteResult, is_owner, is_member }) {
  const [filter, setFilter] = useState(null);
  useEffect(() => {
    highlight(filter);
  }, [filter]);

  return (
    <>
      <div className='sticky py-2 mb-5 rounded-lg shadow-lg opacity-95 bg-gray-200 flex space-x-1 justify-center items-center'>
        <input type="text"
          className="border px-2 py-1 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full mx-3 ease-linear transition-all duration-150"
          placeholder="Filter multiple player names"
          value={filter} onChange={(e) => { setFilter(e.target.value) }}
        />
      </div>

      <div className='flex flex-wrap'>
        <div className='w-full lg:w-6/12 xl:w-3/12'>
          {getFilteredLadderMatches(results || [], filter).map((result) => (
            <div key={result.timestamp} className="relative flex flex-col min-w-0 break-words  bg-white rounded mb-6 xl:mb-0 shadow-lg">
              <div className="flex flex-row items-center justify-between w-full p-4">
                <div>
                  <div className="flex flex-wrap">
                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <div
                        className=
                        'font-bold  text-gray-600'
                      >
                        <span className='highlightable'>{result.winnerUser1?.displayName || result.winnerUser1?.fullName} + {result.winnerUser2?.displayName || result.winnerUser2?.fullName}</span>
                        

                        <span className='font-normal mb-2 ml-1 text-green-600'>[{result.winnerUser1?.avtaPoint + result.winnerUser2?.avtaPoint}]</span>
                      </div>
                      <div className='text-sm text-gray-600'>
                        {format(new Date(result.timestamp), 'd/M h:mm a')}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-2">
                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <div
                        className=
                        'font-bold  text-gray-600 '
                      >
                        <span className='highlightable'>{result.loserUser1?.displayName || result.loserUser1?.fullName} + {result.loserUser2?.displayName || result.loserUser2?.fullName}</span>
                        
                        <span className='font-normal mb-2 ml-1 text-green-600'>[{result.loserUser1?.avtaPoint + result.loserUser2?.avtaPoint}]</span>
                      </div>
                      <div className='text-sm text-gray-600 italic'>
                        Submitted by: {result.submittedByFullName}
                      </div>
                    </div>

                  </div>
                </div>


                <div className="">
                  {!is_member && !is_owner ?
                    (<div className=' text-gray-600 text-lg align-center shadow px-4 border rounded border-gray-200'
                      onClick={() => deleteResult(result)}
                    >
                      {result.gameWonByWinners}-{result.gameWonByLosers}
                    </div>) :
                    <DropDown buttonText={
                      <span>{result.gameWonByWinners}-{result.gameWonByLosers}</span>
                    }
                      items={[
                        <a onClick={() => deleteResult(result)} className="text-gray-700 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm" role="menuitem">Delete</a>,
                      ]}
                    >
                    </DropDown>
                  }
                </div>



              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

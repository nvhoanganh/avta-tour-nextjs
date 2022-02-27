import React from "react";
import TeamAvatar from "../TeamAvatar";
export default function TeamCard({
  team, is_superuser
}) {
  return <div className="relative flex flex-col min-w-0 break-words  bg-white rounded mb-3 xl:mb-0 shadow-lg">
    <div className="flex-auto p-4">
      <div className="flex flex-wrap ">
        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
          <div className='font-bold flex space-x-1 text-gray-600 '>
            <span>{team.player1.fullName} &amp; {team.player2.fullName} </span>
            {team.paidOn &&
              <i className="fas fa-money-bill text-green-600" title={`Paid on ${team.paidOn}`}></i>}
          </div>
          <div className='text-gray-600 '>
            {team.player1.homeClub || team.player2.homeClub || 'Unknown Club'}
          </div>
          <div className='text-sm text-gray-600 flex space-x-2'>
            <span className='text-green-600'>{team.player1.avtaPoint + team.player2.avtaPoint} pt.</span>

          </div>
        </div>
        <div className="relative w-auto pl-4 flex-initial flex">
          <TeamAvatar team={team} />
        </div>
      </div>
    </div>
  </div>;
}

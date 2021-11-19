import React from "react";
import Link from 'next/link';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import { format } from 'date-fns'
import CardStats from './CardStats.js';
import TeamRankingCard from './TeamRankingCard';

export default function GroupRankingsCard({ groups }) {
  const sortTeams = (teams) => {
    return teams.sort((a, b) => {
      if (Number(a.SetWon) === Number(b.SetWon)) {
        return Number(b.Difference) - Number(a.Difference);
      }
      return Number(b.SetWon) > Number(a.SetWon) ? 1 : -1;
    })
  };

  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full lg:w-6/12 xl:w-3/12'>
          {(Object.keys(groups || {})).map((group) => (
            <div key={group}>
              <h2 className='text-2xl md:text-3xl font-bold tracking-tighter leading-tight mx-auto text-gray-500'>
                Group {group}
              </h2>
              {sortTeams(groups[group]).map((team, index) =>
              (
                <TeamRankingCard
                  key={index}
                  team={team}
                  index={index}
                />
              )
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

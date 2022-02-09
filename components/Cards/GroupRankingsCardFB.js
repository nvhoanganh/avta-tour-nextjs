import React from "react";
import Link from 'next/link';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import { format } from 'date-fns'
import CardStats from './CardStats.js';
import TeamRankingCard from './TeamRankingCardFB';

export default function GroupRankingsCard({ groups }) {
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full lg:w-6/12 xl:w-3/12'>
          {(Object.keys(groups)).map((group) => (
            <div key={group}>
              <h2 className='text-xl pt-5 md:text-3xl font-bold tracking-tighter leading-tight mx-auto text-gray-500'>
                Group {group}
              </h2>
              {groups[group].map((team, index) =>
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

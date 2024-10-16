import React, { useEffect, useState } from "react";
import Link from 'next/link';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import { format } from 'date-fns'
import CardStats from './CardStats.js';
import TeamRankingCard from './TeamRankingCardFB';
import TeamRankingCardEmpty from './TeamRankingCardFBEmpty';

export default function GroupRankingsCard({ groups, is_superuser, editTeam, competition, fullWidth }) {
  const [currentIndex, setCurrentIndex] = useState(null);
  useEffect(() => {
    const groupNames = (Object.keys(groups)).sort();
    let foundGroup = '';
    let foundIndex = 0;
    for (let index = 0; index < groupNames.length; index++) {
      const groupName = groupNames[index];
      let found = false;
      for (let u = 0; u < groups[groupName].length; u++) {
        const currentteam = groups[groupName][u];
        if (typeof currentteam === 'number') {
          foundGroup = groupName;
          foundIndex = u;
          found = true;
          break;
        }
      }
      if (found) break;
    }
    setCurrentIndex({ foundGroup, foundIndex })
  }, [groups]);

  return (
    <>
      <div className='flex flex-wrap'>
        <div className={`w-full ${fullWidth ? '' : ' lg:w-6/12 xl:w-3/12'}`}>
          {(Object.keys(groups)).sort().map((group) => (
            <div key={group}>
              <h2 className='text-xl pt-5 md:text-3xl font-bold tracking-tighter leading-tight mx-auto text-gray-500 whitespace-nowrap'>
                Group {group}
              </h2>
              {groups[group].map((team, index) =>
              (
                <>
                  {
                    typeof team !== 'number'
                      ? <TeamRankingCard
                        key={index}
                        is_superuser={is_superuser}
                        competition={competition}
                        editTeam={editTeam}
                        team={team}
                        index={index}
                      />
                      :
                      <TeamRankingCardEmpty
                        key={index}
                        isCurrent={group === currentIndex?.foundGroup && index === currentIndex?.foundIndex}
                        index={index}
                      />
                  }
                </>
              )
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

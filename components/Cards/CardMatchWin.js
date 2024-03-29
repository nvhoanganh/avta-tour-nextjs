import React from "react";
import { useState, useEffect } from "react";
import { uniqBy, prop, path, last, take, repeat } from "ramda";
import cn from 'classnames';
import PlayerAvatar from '../Cards/PlayerAvatar';

// components

export default function CardMatchWin({ compResults, player }) {
  const [stats, setStats] = useState({});
  useEffect(() => {
    if (!player) return;
    const wins = compResults.reduce((pre, curr) => {
      return pre + curr.wins;
    }, 0);
    const losts = compResults.reduce((pre, curr) => {
      return pre + curr.losts;
    }, 0);

    let pointsHistory = compResults.reduce((pre, curr) => {
      const lastPoint = last(pre);
      if (curr.avtaPoint !== lastPoint) {
        pre = [...pre, curr.avtaPoint];
        return pre;
      }
      return pre;
    }, []);

    if (player.avtaPoint !== last(pointsHistory)) {
      pointsHistory = [
        ...pointsHistory,
        player.avtaPoint
      ]
    }

    const partners = compResults.map(x => x.partner);
    const uniquePartners = uniqBy(path(['sys', 'id']), partners);
    setStats({
      wins,
      losts,
      tourWon: compResults.filter(x => !!x.wonLastMatch && x.reached === 'Final').length,
      runnerUp: compResults.filter(x => !x.wonLastMatch && x.reached === 'Final').length,
      semi: compResults.filter(x => !x.wonLastMatch && x.reached === 'Semi').length,
      quarter: compResults.filter(x => !x.wonLastMatch && x.reached === 'Quarter').length,
      third: compResults.filter(x => !!x.wonLastMatch && x.reached === '3rdPlace').length,
      uniquePartners,
      pointsHistory: pointsHistory,
      winPercent: Math.round((wins / (wins + losts)) * 100)
    })
  }, [compResults, player]);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full ">
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <tbody>
              <tr>
                <th className="border-t-0  align-middle border-l-0 border-r-0  whitespace-nowrap p-4 text-left text-sm">
                  Comps
                </th>
                <td className="border-t-0  align-middle border-l-0 border-r-0  whitespace-nowrap p-4">
                  <div className='flex items-center space-x-2'>
                    <div>
                      {compResults.length}
                    </div>
                    {
                      (stats.tourWon > 0 ||
                        stats.runnerUp > 0 ||
                        stats.semi > 0 ||
                        stats.third > 0 ||
                        stats.quarter > 0)
                        ?
                        <div className="flex space-x-1 text-sm">
                          {stats.tourWon > 0 && <span className='bg-yellow-200 text-black  px-1 rounded outline-none'>{stats.tourWon} <i className="fas fa-trophy text-yellow-400 pr-1"></i></span>}
                          {stats.runnerUp > 0 && <span className='bg-gray-200 text-black  px-1 rounded outline-none'>{stats.runnerUp} <i className="fas fa-medal text-gray-400 pr-1"></i></span>}
                          {stats.third > 0 && <span className='bg-yellow-200 text-black  px-1 rounded outline-none'>{stats.third} <i className="fas fa-medal text-yellow-800 pr-1"></i></span>}
                          {stats.semi > 0 && <span className='bg-blue-500 text-white  px-1 rounded outline-none'>{stats.semi} SM</span>}
                          {stats.quarter > 0 && <span className='bg-blue-500 text-white  px-1 rounded outline-none'>{stats.quarter} QF</span>}
                        </div>
                        : null
                    }
                  </div>
                </td>
              </tr>

              <tr>
                <th className="border-t-0  align-middle border-l-0 border-r-0  whitespace-nowrap p-4 text-left text-sm">
                  Matches
                </th>
                <td className="border-t-0  align-middle border-l-0 border-r-0  whitespace-nowrap p-4">

                  <div className="flex items-center">
                    <span className="mr-2 text-sm">{stats.wins + stats.losts}, Won {stats.winPercent}%</span>
                    <div className="relative w-full">
                      <div className="overflow-hidden h-2  flex rounded bg-green-200">
                        <div
                          style={{ width: `${stats.winPercent}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th className="border-t-0  align-middle border-l-0 border-r-0  whitespace-nowrap p-4 text-left text-sm">
                  Points
                </th>
                <td className="border-t-0  align-middle border-l-0 border-r-0  whitespace-nowrap p-4">
                  <div className='flex flex-wrap '>
                    {stats.pointsHistory?.map((x, index) => (
                      <div className="flex space-x-1 my-1 mx-1">

                        <span className={` text-white text-center text-sm font-bold rounded px-1 outline-none  ${index === 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {
                            index > 0
                              ? <>
                                <i className="fas fa-angle-right text-gray-400 font-normal"></i> {stats.pointsHistory[index] > stats.pointsHistory[index - 1] ? <i className="fas text-xs fa-arrow-up text-green-500 mr-1"></i> : <i className="fas text-xs fa-arrow-down text-red-500 mr-1"></i>}
                              </>
                              : <span></span>
                          }
                          {x}</span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="border-t-0  align-middle border-l-0 border-r-0  whitespace-nowrap p-4 text-left text-sm">
                  Partners
                </th>
                <td className="border-t-0  align-middle border-l-0 border-r-0  whitespace-nowrap p-4">
                  <div className=''>
                    <div className='flex flex-wrap '>
                      {stats.uniquePartners?.map(x => (
                        <div className='my-1 mx-1'>
                          <PlayerAvatar key={x.sys.id} player={x} />
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

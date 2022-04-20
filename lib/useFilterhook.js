import React, { useEffect, useState } from 'react';
import { getPlayers } from './browserapi';

export default function useFilterPlayers(allPlayers) {
  const [sortBy, setSortBy] = useState('Point');
  const [filter, setFilter] = useState(null);
  const [avgPoint, setAvgPoint] = useState(0);
  const [filteredPlayers, setfilteredPlayers] = useState(allPlayers);

  useEffect(() => {
    const foundPlayers = getPlayers(allPlayers, sortBy, filter);
    setfilteredPlayers(foundPlayers)

    if (foundPlayers.length === 0) {
      setAvgPoint(0);
    } else {
      const total = foundPlayers.reduce((previousTotal, player) => {
        return (
          previousTotal +
          player?.avtaPoint
        );
      }, 0);
      setAvgPoint((total / foundPlayers.length).toFixed(0));
    }
  }, [allPlayers, sortBy, filter]);
  return { sortBy, setSortBy, filter, setFilter, avgPoint, filteredPlayers };
}
import React from "react";
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from "prop-types";
import PlayerAvatar from './Cards/PlayerAvatar';
import { format } from 'date-fns'
import PlayerPoint from './PlayerPoint';

export default function TeamAvatar({ team }) {
  const players = team.players ? team.players : [team.player1, team.player2];
  return (
    <>
      <Link href={`/players/${players[0]?.sys?.id}`}>
        <div className="flex flex-col">
          <PlayerAvatar player={players[0]} />
          <PlayerPoint player={players[0]} />
        </div>
      </Link>
      <Link href={`/players/${players[1]?.sys?.id}`}>
        <div className="flex flex-col -ml-2">
          <PlayerAvatar player={players[1]} />
          <PlayerPoint player={players[1]} />
        </div>
      </Link>
    </>
  );
}

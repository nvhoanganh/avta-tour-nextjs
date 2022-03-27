import PlayerPoint from './PlayerPoint';
import PlayerAvatar from './Cards/PlayerAvatar';
import React from "react";
import Link from 'next/link';
import cn from 'classnames';
import { format } from 'date-fns'

export default function TeamAvatar({ team }) {
  return (
    <>
      <Link href={`/players/${team.player1.sys?.id}`}>
        <div className="flex flex-col">
          <PlayerAvatar player={team.player1} />
          <PlayerPoint player={team.player1} />
        </div>
      </Link>
      <Link href={`/players/${team.player2.sys?.id}`}>
        <div className="flex flex-col -ml-2">
          <PlayerAvatar player={team.player2} />
          <PlayerPoint player={team.player2} />
        </div>
      </Link>
    </>
  );
}

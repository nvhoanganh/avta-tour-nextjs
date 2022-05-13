import React from "react";
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from "prop-types";
import { format } from 'date-fns'
import PlayerAvatar from './Cards/PlayerAvatar';
import PlayerPoint from './PlayerPoint';

export default function TeamAvatar({ team }) {
  return (
    <>
      <div className="flex flex-col">
        <PlayerAvatar player={team.player1} />
        <PlayerPoint player={team.player1} />
      </div>
      <div className="flex flex-col -ml-2">
        <PlayerAvatar player={team.player2} />
        <PlayerPoint player={team.player2} />
      </div>
    </>
  );
}

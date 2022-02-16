import React from "react";
import cn from 'classnames';

export default function PlayerPoint({
  player,
  className
}) {
  return <div className={cn(` text-green-600 text-xs text-center ${className}`, {
    'text-red-600': player.unofficialPoint
  })}>
    { player.avtaPoint }
  </div >;
}

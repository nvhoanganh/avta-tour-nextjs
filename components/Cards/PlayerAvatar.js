import React from "react";
import Link from 'next/link';

export default function PlayerAvatar({ player, className }) {
  return (
    <Link href={`/players/${player.sys?.id}`}>
      {
        player.photoURL || player.coverImage?.url
          ? <img src={player.photoURL || player.coverImage?.url} alt='...' className={`w-10 h-10 hover:cursor-pointer hover:shadow-xl hover:border-gray-700  rounded-full border-2 border-gray-50 shadow `}></img>
          : <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-400 hover:border-gray-700 hover:shadow-xl hover:cursor-pointer">
            <span className=" text-sm leading-none text-white">{player.fullName.split(" ").map((n) => n[0]).join("")}</span>
          </span>
      }
    </Link>
  );
}


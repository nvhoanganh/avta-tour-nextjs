import React from "react";

export default function PlayerAvatar({ player, className }) {
  return (
    <img src={player.photoURL || player.coverImage?.url || 'https://via.placeholder.com/64'} alt='...' className={`w-10 h-10 hover:cursor-pointer hover:shadow-xl hover:border-gray-700  rounded-full border-2 border-gray-50 shadow ${className}`}></img>
  );
}


import React from "react";
import Link from 'next/link';
import cn from 'classnames';
import PropTypes from "prop-types";
import DateWithTimeComponent from '../dateWithTime';
import TeamAvatar from '../TeamAvatarFb';
import { format } from 'date-fns'
import { getPriceId } from '../../lib/browserapi'

export default function TeamRankingCard({ index }) {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words  bg-white rounded mb-3 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap ">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
              <div
                className=
                'flex space-x-1 text-gray-600 '
              >
                <span>{index + 1}.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

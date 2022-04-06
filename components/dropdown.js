import React, { useState } from 'react';
import cn from 'classnames';

export default function DropDown({ buttonText, items, align }) {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-blue-600 text-white text-sm font-medium  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 items-center" id="menu-button"
          onClick={toggleShow}
          aria-expanded="true" aria-haspopup="true">
          {buttonText}
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {show &&
        <div
          className={cn('origin-top-right absolute  mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10', {
            'left-0': align === 'left',
            'right-0': align === 'right' || !align,
          })}
          role="menu" ariaOrientation="vertical" ariaLabelledby="menu-button" tabindex="-1">
          <div className="py-1" role="none">
            {items.map((item, index) => (<div onClick={() => setShow(false)} key={index}>
              {item}
            </div>))}
          </div>
        </div>
      }
    </div>

  )
}

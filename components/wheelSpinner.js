import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import Spinner from './spinner';
import { arrayShuffle } from '../lib/browserapi';
import { Wheel } from 'spin-wheel';
import TeamRankingCard from './Cards/TeamRankingCardFB';
import Countdown from "react-countdown";

export default function WheelSpinner({ teams, onTeamSelected }) {
  const [wheel, setWheel] = useState(null);
  const [modifier, setModifier] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [selectedTeam, setselectedTeam] = useState(null);
  const wheelRef = useRef(null);
  const imgRef = useRef(null);
  const img2Ref = useRef(null);
  
  const props = {
    name: 'Workout',
    radius: 0.84,
    isInteractive: false,
    itemLabelRadius: 0.93,
    itemLabelRadiusMax: 0.30,
    itemLabelRotation: 180,
    itemLabelAlign: 'left',
    itemLabelColors: ['#fff'],
    itemLabelBaselineOffset: -0.07,
    // itemLabelFont: 'Amatic SC',
    itemLabelFontSizeMax: 200,
    itemBackgroundColors: ['#ffc93c', '#66bfbf', '#a2d5f2', '#515070', '#43658b', '#ed6663', '#d54062'],
    rotationSpeedMax: 500,
    rotationResistance: -100,
    lineWidth: 0.4,
    lineColor: '#fff',
    image: imgRef.current,
    overlayImage: img2Ref.current,
  }

  const spinNow = () => {
    const { duration, winningItemRotaion } = calcSpinToValues();
    wheel.spinTo(winningItemRotaion, duration);
    setClickCount(v => v + 1);
    // calcSpinToItem();
  }

  function calcSpinToValues() {
    const duration = 3000;
    const winningItemRotaion = getRandomInt(360, 360 * 1.75) + modifier;
    modifier += 360 * 1.75;
    setModifier(modifier);
    return { duration, winningItemRotaion };
  }

  function calcSpinToItem() {
    const winningItemIndex = getRandomInt(0, teams.length);
    const duration = 2600;
    const spinDirection = 1;
    const revolutions = 3;
    wheel.spinToItem(winningItemIndex, duration, true, revolutions, spinDirection, null);
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      return null;
    } else {
      // Render a countdown
      return (
        <span className="font-bold">
          {seconds}
        </span>
      );
    }
  };

  useEffect(() => {
    console.log('initializing wheel');
    setWheel(new Wheel(wheelRef.current));
  }, []);

  useEffect(() => {
    if (wheel) {
      setClickCount(0);
      console.log('configuring wheel again...');
      setselectedTeam(null);
      // 1. Configure the wheel's properties:
      let _props = {
        ...props,
        rotation: wheel.rotation,
        items: teams.map(x => ({
          label: `${x.player1.fullName} + ${x.player2.fullName}`,
          backgroundColor: x.backgroundColor
        }))
      }
      wheel.init(_props);
      wheel.onRest = e => {
        console.log(`Wheel stopped`, e);
        const _team = teams[e.currentIndex];
        setselectedTeam(_team);
        setTimeout(() => {
          if (onTeamSelected) onTeamSelected(_team);
        }, 1000);
      };
    }
  }, [teams, wheel]);

  return (
    <div className="flex flex-col">
      <img
        className="hidden"
        ref={imgRef}
        src='/assets/img/example-0-image.svg'
      />
      <img
        className="hidden"
        ref={img2Ref}
        src='/assets/img/example-0-overlay.svg'
      />
      <div ref={wheelRef} className="wheel">
      </div>
      <div className="text-center pt-3">
        {
          !selectedTeam
            ?
            <>
              <button className="bg-blue-500 text-white hover:bg-blue-600 uppercase text-xs px-8 py-5 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" type="button"
                onClick={() => spinNow()}
              >
                Spin Now
              </button>
              {
                clickCount > 0
                  ? <div className="italic text-xs text-gray-600 pt-2">{clickCount} clicks</div>
                  : <div className="italic text-xs text-gray-600 pt-2">{teams.length} teams remaining</div>
              }
            </>
            :
            <div className="">
              {/* <TeamRankingCard
                team={selectedTeam}
                index={0}
              /> */}
              {/* <div className="pt-2">Adding in <Countdown date={Date.now() + 1000} renderer={renderer} /> seconnds</div> */}
            </div>
        }
      </div>
    </div>
  )
}

import PostBody from './post-body';
import React from "react";
export default function ToggleTournamentRule({
  competition
}) {
  const [hideRules, setHideRules] = React.useState(false);
  const toogleRules = () => setHideRules(!hideRules);

  return (
    <div className="py-5">
      <div>
        <a className='text-sm underline uppercase hover:cursor-pointer font-bold' onClick={toogleRules}>
          {hideRules ? <><i className="fas fa-angle-double-down"></i> Hide </> : <><i className="fas fa-angle-double-right"></i> Show </>}
          REGULATIONS AND CODE OF BEHAVIOUR
        </a></div>
      {hideRules && <div className='py-6'><PostBody content={competition.rule} /></div>}
    </div>
  )
}

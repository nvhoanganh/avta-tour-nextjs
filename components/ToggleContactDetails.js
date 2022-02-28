import React from "react";
export default function ToggleContactDetails({
  competition
}) {
  const [hideContacts, setHideContacts] = React.useState(false);
  const toogleContacts = () => setHideContacts(!hideContacts);

  return (
    <div>
      <div>
        <a className='text-sm underline uppercase hover:cursor-pointer font-bold' onClick={toogleContacts}>
          {hideContacts ? <><i className="fas fa-angle-double-down"></i> Hide </> : <><i className="fas fa-angle-double-right"></i> Show </>}
          Organizer Contact Details
        </a></div>
      {hideContacts && <div className='py-6'>{competition.organizerContactDetails}</div>}
    </div>
  )
}

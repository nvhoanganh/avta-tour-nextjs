import cn from 'classnames';
export default function PlayerProfileStatus({ player }) {
  return (
    <>
      {player.allowContact && player.mobileNumber && <span className='ml-1'><i title='You can contact this person on mobile' className="fas fa-sms text-blue-500"></i></span>}
      {player.playerId && player.uid && <span className='ml-1'><i title='Profile claimed' className="far text-blue-500 fa-id-badge"></i></span>}
    </>
  )
}

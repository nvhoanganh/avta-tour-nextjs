import cn from 'classnames';
export default function PlayerProfileStatus({ player }) {
  return (
    <>
      {
        !player.mobileNumber && <span className='ml-1'><i title='Missing mobile number' className="fas fa-mobile-alt text-red-500 text-sm"></i></span>
      }
      {player.allowContact && player.mobileNumber && <span className='ml-1'><i title='You can contact this person on mobile' className="fas fa-sms text-blue-500"></i></span>}
      {player.playerId && player.uid && <span className='ml-1'><i title='Profile claimed' className="far text-blue-500 fa-id-badge"></i></span>}
    </>
  )
}

import { useFirebaseAuth } from './authhook';
import { useState } from 'react'

export default function SendOtp({ mobileNumber }) {
  const [otp, setOtp] = useState(null);
  const { user } = useFirebaseAuth();

  const sendOtpNow = () => {
    user.getIdToken().then(idtoken => {
      const otp = Math.floor(100000 + Math.random() * 900000);
      setOtp(otp);
      console.log('sending ..', otp, idtoken, user);
    })
  }

  return (
    <div className='flex items-center justify-center flex-col py-8'>
      <p className="py-2 text-center">To claim this profile, a verification code will be sent to this mobile number
        <span className=" bold text-2xl mx-3">
          {mobileNumber.replace(/\d(?=\d{4})/g, "*")}
        </span>
      </p>
      <p className="py-2">Click Send when you're ready</p>
      <p className="py-6">
        {
          !otp
            ?
            <button className='get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'
              onClick={sendOtpNow}
            >
              Send Verification Code
            </button>
            : (
              <div className='flex items-center justify-center py-8 space-x-2'>
                <input
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 border-gray-700"
                  placeholder="Enter Code"
                />
                <button className='get-started text-white font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150'
                >
                  Verify
                </button>
              </div>)
        }
      </p>
    </div>
  )
}

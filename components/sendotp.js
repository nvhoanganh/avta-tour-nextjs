import { useFirebaseAuth } from './authhook';
import { useState } from 'react'

export default function SendOtp({ mobileNumber, playerId, done }) {
  const [otp, setOtp] = useState(false);
  const [otpValue, setOtpValue] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { user } = useFirebaseAuth();

  const handleChange = (event) => {
    setOtpValue(event.target.value);
  }

  const sendOtpNow = () => {
    user.getIdToken().then(idtoken => {
      setOtp(true);
      return fetch(
        `/api/sendotp?mobile=${encodeURIComponent(mobileNumber)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${idtoken}`,
          },
        }
      )
        .then(response => response.json())
        .then((rsp) => {
          console.log('response', rsp);
        });
    })
  }

  const verifyOtpNow = () => {
    user.getIdToken().then(idtoken => {
      return fetch(
        `/api/verifyotp?otp=${otpValue}&playerId=${playerId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${idtoken}`,
          },
        }
      )
        .then(response => response.json())
        .then((rsp) => {
          if (rsp.success) {
            setErrorMsg(null);
            done();
          } else {
            setErrorMsg(rsp.message);
          }
        })
        .catch((err) => {
          console.log('error', err);
        });
    })
  }

  return (
    <div className='flex items-center justify-center flex-col py-8'>
      {
        !otp
          ? <p className="py-2 text-center">To claim this profile, a verification code will be sent to this mobile number
            <span className=" bold text-2xl mx-3">
              {mobileNumber.replace(/\d(?=\d{4})/g, "*")}
            </span>
          </p>
          : <p className="py-2 text-center">Enter verification code that was sent to this mobile number
            <span className=" bold text-2xl mx-3">
              {mobileNumber.replace(/\d(?=\d{4})/g, "*")}
            </span>
          </p>
      }
      <p className="py-6">
        {
          !otp
          && <button className='get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150' type="button"
            onClick={sendOtpNow}
          >
            Send Verification Code
          </button>
        }
      </p>

      {
        otp
        && <div className='flex items-center justify-center py-8 space-x-2'>
          <input
            type="text"
            className="border-1 px-3 py-3 text-gray-600 bg-gray-100 rounded text-sm shadow-lg focus:outline-none focus:ring w-full border-red-900"
            placeholder="Enter Code"
            length="6"
            value={otpValue} onChange={handleChange}
          />
          <button className='get-started text-white font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150' type="button"
            onClick={verifyOtpNow}
          >
            Verify
          </button>
        </div>
      }

      {
        errorMsg
        && <div className='flex items-center justify-center space-x-2 text-red-700'>
          {errorMsg}
        </div>
      }

    </div>
  )
}

import { useFirebaseAuth } from './authhook';
import SaveButton from './savebutton';
import { useState } from 'react'

export default function SendOtp({ mobileNumber, playerId, done }) {
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const { user } = useFirebaseAuth();

  const handleChange = (event) => {
    setOtpValue(event.target.value);
  }

  const sendOtpNow = () => {
    setSendingOtp(true);
    user.getIdToken().then(idtoken => {
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
          setOtpSent(true);
          setSendingOtp(false);
          console.log('response', rsp);
        }).catch((err) => {
          setOtpSent(false);
          setSendingOtp(false);
          setErrorMsg('Something went wrong, please try again');
        });
    })
  }

  const verifyOtpNow = () => {
    setVerifying(true);
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
            setVerifying(false);
            setErrorMsg(rsp.message);
          }
        })
        .catch((err) => {
          setVerifying(false);
          setErrorMsg('Something went wrong, please try again later');
          console.log('error', err);
        });
    })
  }

  return (
    <div className='flex items-center justify-center flex-col py-8'>
      {
        !otpSent
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
          !otpSent
          &&
          <SaveButton onClick={sendOtpNow} saving={sendingOtp}
            type="button">Send Verification Code</SaveButton>
        }
      </p>

      {
        otpSent
        &&
        <div className='flex items-center justify-center py-8 space-x-2'>
          <input
            type="text"
            className="border-1 px-3 py-3 text-gray-600 bg-gray-100 rounded text-sm shadow-lg focus:outline-none focus:ring w-full border-red-900"
            placeholder="Enter Code"
            length="6"
            value={otpValue} onChange={handleChange}
          />

          <SaveButton onClick={verifyOtpNow} saving={verifying}
            type="button">Verify</SaveButton>
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

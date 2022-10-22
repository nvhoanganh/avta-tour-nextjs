import { useForm } from "react-hook-form";
import Link from 'next/link'
import SaveButton from './savebutton';
import { useState } from 'react'

export default function EditLadderForm({ onSubmit, currentValue, saving }) {
  const [showHelp, setShowHelp] = useState(false);
  const { register, reset, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      ...currentValue,
      ...(!!currentValue && { startDate: currentValue?.startDate?.split('T')[0] }),
      ...(!!currentValue && { endDate: currentValue?.endDate?.split('T')[0] }),
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border-0">
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <h6 className="text-gray-600 text-sm mt-3 mb-3 font-bold uppercase">
            Ladder Details
          </h6>
          <div className="text-gray-400 text-sm mb-6">
            All fields are mandatory
          </div>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Name
                </label>
                <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  {...register("name", { required: true })} />
              </div>
            </div>
            <div className="w-full lg:w-6/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Home Club
                </label>
                <input type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  {...register("homeClub", { required: true })} />
              </div>
            </div>
            <div className="w-full lg:w-6/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Start Date
                </label>
                <input type="date" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  {...register("startDate", { required: true })} />
              </div>
            </div>
            <div className="w-full lg:w-6/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  End Date
                </label>
                <input type="date" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  {...register("endDate", { required: true })} />
              </div>
            </div>
            <div className="w-full lg:w-6/12 sm:px-4 py-3">
              <div className="relative w-full mb-3">
                <label className="inline-flex items-center cursor-pointer">
                  <input id="customCheckLogin" type="checkbox" className="form-checkbox border rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150" {...register("open")} />
                  <span className="ml-2 text-sm font-semibold text-blueGray-600">Open for registration</span>
                </label>
              </div>
            </div>

            <div className="w-full lg:w-6/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Rank Players Based on
                </label>
                <select className="appearance-none
        border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" aria-label="Default select example"
                  {...register("orderRule", { required: true })}
                >
                  <option value='GAMEWON'>Game Won %</option>
                  <option value='SETWON'>Match Won %</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Ladder Rule
                </label>
                <textarea type="text" className="border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="4"
                  {...register("rule", { required: true })}></textarea>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-6/12 sm:px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                Joining Fee (AUD)
                <span className="underline cursor-pointer" onClick={() => setShowHelp(!showHelp)}><i className="far fa-question-circle ml-2 text-lg" ></i> What is this joining fee?</span>
              </label>
              <select className="appearance-none
        border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" aria-label="Default select example"
                {...register("joiningFee", { required: true })}
              >
                <option value={10}>$10</option>
                <option value={20}>$20</option>
                <option value={30}>$30</option>
                <option value={40}>$40</option>
                <option value={50}>$50</option>
              </select>

              {showHelp &&
                <div className="py-3 my-4 border rounded shadow-xl px-3 bg-gray-50">
                  <p>
                    To join the ladder, player will pay the amount above using <a
                      className='text-blue-600 hover:text-gray-800 font-semibold'
                      href='https://stripe.com'
                    >
                      Stripe.com
                    </a>. At the end of the ladder, <a
                      className='text-blue-600 hover:text-gray-800 font-semibold'
                      href='mailto:nvhoanganh1909@gmail.com'
                    >
                      email us
                    </a> and provide your Australian Bank Account details and we will transfer the total registration amount less <strong>3% total + 30c per joined user</strong> platform fee.
                  </p>

                  <p className='pt-5'><strong>Note:</strong> Your email is used to identify the ladder you created. Make sure you use the same email address you used to sign up with AVTATour.com.</p>

                  <p className='pt-5'>How you spend the fund is up to you. For example, you can use it to purchase Trorphies for Ladder winners</p>

                  <p className="pt-5">
                    For example, if joining fee is $50 and you have 10 people joined. Total amount you will receive will be

                    <p className="pt-5 italic">
                      $500 - (3% * $500 + $0.30*10)  = $482.00.
                    </p>

                    <p className="pt-5">
                      <button className="bg-gray-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" type="button"
                        onClick={() => setShowHelp(false)}
                      >
                        Got it!
                      </button>
                    </p>
                  </p>
                </div>}
            </div>
          </div>

          <div className="flex flex-wrap pt-5">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3 text-center">
                <SaveButton saving={saving}
                  type="submit">Save</SaveButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form >
  );
}

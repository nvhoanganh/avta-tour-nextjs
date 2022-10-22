import { useForm } from "react-hook-form";
import SaveButton from './savebutton';

export default function EditLadderForm({ onSubmit, currentValue, saving }) {
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
            <div className="w-full lg:w-6/12 sm:px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                  Joining Fee
                </label>
                <select className="appearance-none
        border px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" aria-label="Default select example"
                  {...register("joiningFee", { required: true })}
                >
                  <option value={0}>$0 - No joining fee</option>
                  <option value={10}>$10</option>
                  <option value={20}>$20</option>
                  <option value={30}>$30</option>
                  <option value={40}>$40</option>
                  <option value={50}>$50</option>
                </select>
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

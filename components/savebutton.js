import cn from 'classnames';
import Spinner from './spinner';

export default function SaveButton({ saving, type, onClick, children, className }) {
  return (
    <button onClick={onClick} className={`bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-8 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150
    disabled:cursor-wait whitespace-nowrap
             disabled:bg-gray-200 ${className}`}
      type={type}
      disabled={saving}
    >
      {saving && <Spinner size="sm" color="blue" />}{children}
    </button>
  )
}

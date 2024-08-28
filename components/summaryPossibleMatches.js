import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { getSummaryMatchup } from '../lib/browserapi';
import { useForm } from "react-hook-form";

export default function SummaryPossibleMatches({ matches, onSelectedChange }) {
	const data = getSummaryMatchup(matches);
	const { register, watch, setValue, getValues } = useForm({ mode: "onBlur" });
	const onChanged = () => {
		const selected = getValues('selected');
		if (onSelectedChange) {
			onSelectedChange(selected)
		}
	}

	const keys = Object.keys({ ...data, ':Played': true, ':Not Played': true });
	return (
		<form>
			{
				keys.length > 2
					? <div className='grid grid-cols-3 gap-x-5 md:grid-cols-5 md:gap-x-10 lg:gap-x-16 gap-y-3 lg:gap-y-10 mb-6'>
						{keys.map((k, i) => (
							<div
								className='flex'
								key={k}>
								<div class="flex">
									<input type="checkbox" name={"withIndex." + i * 2} id={k.trim()} className="peer hidden"
										value={k.trim()}

										{...register("selected", {
											required: true,
											onChange: (e) => onChanged()
										})}
									/>
									<label htmlFor={k.trim()}
										className={cn('select-none cursor-pointer rounded-lg border border-gray-200 bg-gray-100 shadow-lg px-2 py-1 text-gray-600 w-32 transition-colors duration-200 ease-in-out peer-checked:bg-green-300 peer-checked:text-gray-900 peer-checked:border-gray-200 text-sm text-center whitespace-nowrap', {
											'peer-checked:bg-indigo-300 peer-checked:text-gray-900 peer-checked:border-gray-200 text-blue-600': k === ':Played' || k === ':Not Played',
										})}>
										<span className='font-semibold'>{k.trim()}</span>
									</label>

								</div>
							</div>))}
					</div>
					: null
			}
		</form>
	);
}

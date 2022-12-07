import Container from './container';
import cn from 'classnames';
import { EXAMPLE_PATH } from '../lib/constants';

export default function JoinOurFacebook() {
	return (
		<div className="relative bg-white py-16">
			<div className="absolute inset-x-0 top-0 hidden h-1/2 bg-gray-50 lg:block" aria-hidden="true" />
			<div className="mx-auto max-w-7xl bg-gray-200 lg:bg-transparent lg:px-8">
				<div className="lg:grid lg:grid-cols-12">
					<div className="relative z-10 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:bg-transparent lg:py-16">
						<div className="absolute inset-x-0 h-1/2 bg-gray-50 lg:hidden" aria-hidden="true" />
						<div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-none lg:p-0">
							<div className="aspect-w-10 aspect-h-6 sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1">
								<img
									className="rounded-3xl object-cover object-center shadow-2xl"
									src="https://images.ctfassets.net/012zf22jz69j/HnKoycYeEd48H24x4ngQt/7469cfdc6d6ac147d456edf5ca19a6a0/AvtaMetaImgResize.png?w=3840&q=75"
									alt=""
								/>
							</div>
						</div>
					</div>

					<div className="relative bg-gradient-to-r from-red-500 via-purple-500 to-green-500 lg:col-span-10 lg:col-start-3 lg:row-start-1 lg:grid lg:grid-cols-10 lg:items-center lg:rounded-3xl">
						<div className="absolute inset-0 hidden overflow-hidden rounded-3xl lg:block" aria-hidden="true">
							<svg
								className="absolute bottom-full left-full translate-y-1/3 -translate-x-2/3 transform xl:bottom-auto xl:top-0 xl:translate-y-0"
								width={404}
								height={384}
								fill="none"
								viewBox="0 0 404 384"
								aria-hidden="true"
							>
								<defs>
									<pattern
										id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
										x={0}
										y={0}
										width={20}
										height={20}
										patternUnits="userSpaceOnUse"
									>
										<rect x={0} y={0} width={4} height={4} className="text-green-300" fill="currentColor" />
									</pattern>
								</defs>
								<rect width={404} height={384} fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)" />
							</svg>
							<svg
								className="absolute top-full -translate-y-1/3 -translate-x-1/3 transform xl:-translate-y-1/2"
								width={404}
								height={384}
								fill="none"
								viewBox="0 0 404 384"
								aria-hidden="true"
							>
								<defs>
									<pattern
										id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
										x={0}
										y={0}
										width={20}
										height={20}
										patternUnits="userSpaceOnUse"
									>
										<rect x={0} y={0} width={4} height={4} className="text-green-300" fill="currentColor" />
									</pattern>
								</defs>
								<rect width={404} height={384} fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)" />
							</svg>
						</div>
						<div className="relative mx-auto max-w-md space-y-6 py-12 px-4 sm:max-w-3xl sm:py-16 sm:px-6 lg:col-span-6 lg:col-start-4 lg:max-w-none lg:p-0">
							<h2 className="text-3xl font-bold tracking-tight text-white" id="join-heading">
								AVTATour Facebook Group
							</h2>
							<p className="text-lg text-white">
								Join largest Vietnamese tennis community in Australia.
							</p>
							<a
								className="block w-full rounded-md border border-transparent bg-blue-600 py-3 px-5 text-center text-base font-medium text-white shadow-md hover:bg-gray-50 sm:inline-block sm:w-auto"
								href="https://www.facebook.com/groups/464135091348911"
								target="_blank"
							>
								<i className='lg:text-gray-200 text-white fab fa-facebook text-xl leading-lg  mr-2' />
								Join Our Facebook Group
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

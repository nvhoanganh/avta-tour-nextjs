import Link from 'next/link';

export default function Intro() {
	return (
		<section className='flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12'>
			<h1 className='text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8'>
				<Link href='/'>
					<img
						src='/favicon/Logo.png'
            className='shadow-2xl'
						alt='AVTA Tour'
						height='50'
						width='150'
					/>
				</Link>
			</h1>
			<h4 className='text-center md:text-left text-xl mt-5 md:pl-8'>
				Australia Vietnamese Tennis Association
			</h4>
		</section>
	);
}

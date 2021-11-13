import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/favicon/AppImages/ios/512.png';

export default function Header() {
	return (
		<h2 className='text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8'>
			<Link href='/'>
				<img
					src='/favicon/Logo.png'
					alt='AVTA Tour'
					className='shadow-lg'
					height='150'
				/>
			</Link>
		</h2>
	);
}

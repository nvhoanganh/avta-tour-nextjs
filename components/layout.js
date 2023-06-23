import Alert from '../components/alert';
import Footer from '../components/footer';
import Meta from '../components/meta';
import { useFirebaseAuth } from '../components/authhook';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Layout({ preview, children }) {
	const { user } = useFirebaseAuth();
	const router = useRouter();
	useEffect(() => {
		const handleRouteChange = (url, { shallow }) => {
			if (window.dataLayer) {
				window.dataLayer.push({
					event: 'route_changed',
					newUrl: url
				});
			}
		};

		router.events.on('routeChangeStart', handleRouteChange);

		return () => {
			router.events.off('routeChangeStart', handleRouteChange);
		};
	}, [router]);

	useEffect(() => {
		if (user && window.dataLayer) {
			window.dataLayer.push({
				email: user.email,
				displayName: user.displayName,
				uid: user.uid,
				createdAt: user.metadata?.creationTime,
				lastLogin: user.metadata?.lastSignInTime,
			});

			window.dataLayer.push({
				event: 'user_loaded'
			});
		}
	}, [user]);

	return (
		<>
			<Meta />
			{preview && <Alert preview={preview} />}
			{children}
			<Footer />
		</>
	);
}

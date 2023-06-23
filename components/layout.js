import Alert from '../components/alert';
import Footer from '../components/footer';
import Meta from '../components/meta';
import { useFirebaseAuth } from '../components/authhook';
import { useEffect } from 'react';

export default function Layout({ preview, children }) {
	const { user } = useFirebaseAuth();
	useEffect(() => {
		if (user && window.dataLayer) {
			window.dataLayer.push({
				event: 'user_loaded'
			});

			window.dataLayer.push({
				email: user.email,
				displayName: user.displayName,
				uid: user.uid,
				createdAt: user.metadata?.creationTime,
				lastLogin: user.metadata?.lastSignInTime,
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

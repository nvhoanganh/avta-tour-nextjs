import {
	GoogleAuthProvider,
	signInWithPopup,
	signInWithRedirect,
	onAuthStateChanged,
	signOut,
} from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../lib/firebase';

export function useFirebaseAuth() {
	const [user, setUser] = useState(null);
	const [loadingAuth, setLoadingAuth] = useState(true);

	try {
		onAuthStateChanged(auth, (user) => {
			setUser(user);
			if (user) {
				if (window.newrelic) {
					console.log(`setting user Id in New Relic: ${user.uid}`);
					window.newrelic.setUserId(user.uid);
					window.newrelic.setCustomAttribute('user_name', user.displayName);
				}
			}
			// let New Relic now
			setLoadingAuth(false);
		});
	} catch (error) {
		console.error(error);
	}


	const login = async (redirect = true) => {
		// Sign in using a redirect.
		const provider = new GoogleAuthProvider();
		// Start a sign in process for an unauthenticated user.
		provider.addScope('profile');
		provider.addScope('email');

		if (window.newrelic) {
			window.newrelic.addPageAction('user_login', { result: 'success' });
		}
		return redirect
			? await signInWithRedirect(auth, provider)
			: await signInWithPopup(auth, provider);
	};

	const logout = async () => {
		if (window.newrelic) {
			window.newrelic.addPageAction('user_logout', { result: 'success' });
		}
		await signOut(auth);
	};

	return { user, loadingAuth, login, logout };
}

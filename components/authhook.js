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

	onAuthStateChanged(auth, (user) => {
		setUser(user);
		setLoadingAuth(false);
	});

	const login = async (redirect = true) => {
		// Sign in using a redirect.
		const provider = new GoogleAuthProvider();
		// Start a sign in process for an unauthenticated user.
		provider.addScope('profile');
		provider.addScope('email');

		return redirect
			? await signInWithRedirect(auth, provider)
			: await signInWithPopup(auth, provider);
	};

	const logout = async () => {
		await signOut(auth);
	};

	return { user, loadingAuth, login, logout };
}

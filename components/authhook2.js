import { useRouter } from 'next/router';
import {
	GoogleAuthProvider,
	signInWithPopup,
	signInWithRedirect,
	onAuthStateChanged,
	signOut,
} from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from "firebase/firestore";

export function useFirebaseAuth({ protectedRoute, reason }) {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [loadingAuth, setLoadingAuth] = useState(true);
	const [loading, setLoading] = useState(true);
	const [fullProfile, setFullProfile] = useState(null);

	onAuthStateChanged(auth, (user) => {
		setUser(user);
		setLoadingAuth(false)
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

	useEffect(async () => {
		if (!loadingAuth) {
			if (protectedRoute && !user) {
				gotoLogin();
				return;
			}

			if (user) {
				const usersSnap = await getDoc(doc(db, "users", user.uid));
				const roleSnap = await getDoc(doc(db, "user_roles", user.uid));
				if (usersSnap.exists()) {
					setFullProfile({
						...usersSnap.data(),
						...(roleSnap.exists() && { roles: roleSnap.data() })
					});
				}
			}

			setLoading(false);
		}
	}, [user, loadingAuth]);

	const logout = async () => {
		await signOut(auth);
	};

	const gotoLogin = () => {
		localStorage.setItem('redirectAfterLogin', window.location.pathname);
		router.push(`/auth/login?reason=${reason}`);
	}

	return { user, loadingAuth, loading, fullProfile, login, logout };
}

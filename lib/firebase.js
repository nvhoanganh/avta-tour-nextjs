// Firebase App (the core Firebase SDK) is always required and must be listed first
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
	apiKey: 'AIzaSyAOgiAI_6hh3NSXtNRncJdVTBoERunH8VI',
	authDomain: 'avta-tour.firebaseapp.com',
	projectId: 'avta-tour',
	storageBucket: 'avta-tour.appspot.com',
	messagingSenderId: '300769806477',
	appId: '1:300769806477:web:b0235c671a13c41b613ac4',
	measurementId: 'G-TDYG7XCL5Q',
};

const apps = getApps();

// make sure we don't create the app again
const firebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig);

// export only the things that we need to use
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
// export const analytics = getAnalytics(firebaseApp);

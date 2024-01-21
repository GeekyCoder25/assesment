import firebase_app from '../config';
import {signOut, getAuth, AuthErrorCodes} from 'firebase/auth';
import {FirebaseError} from 'firebase/app';

const auth = getAuth(firebase_app);

export default async function signout(): Promise<any> {
	let result = null,
		error = null;

	try {
		result = await signOut(auth);
	} catch (e) {
		console.log(e);
		if (e instanceof FirebaseError) {
			if (e.code === AuthErrorCodes.NETWORK_REQUEST_FAILED) {
				error = 'Please check your internet connection';
			} else if (e.code === AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER) {
				error = 'Too many attempts, try again later';
			} else {
				error = 'Sign-out failed. Please try again later.';
			}
		} else {
			error = 'Sign-in failed. Please try again later.';
		}
	}

	return {result, error};
}

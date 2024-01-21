import firebase_app from '../config';
import {
	signInWithEmailAndPassword,
	getAuth,
	AuthErrorCodes,
} from 'firebase/auth';
import {AuthResult} from './auth.types';
import {FirebaseError} from 'firebase/app';

const auth = getAuth(firebase_app);

export default async function signIn(
	email: string,
	password: string
): Promise<AuthResult> {
	let result = null,
		error = null;

	try {
		result = await signInWithEmailAndPassword(auth, email, password);
	} catch (e) {
		console.log(e);
		if (e instanceof FirebaseError) {
			if (e.code === AuthErrorCodes.NETWORK_REQUEST_FAILED) {
				error = 'Please check your internet connection';
			} else if (e.code === AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER) {
				error = 'Too many attempts, try again later';
			} else if (e.code === AuthErrorCodes.INVALID_EMAIL) {
				error = 'Invalid email';
			} else if (e.code === AuthErrorCodes.INVALID_PASSWORD) {
				error = 'Invalid password';
			} else {
				error = 'Invalid credentials';
			}
		} else {
			error = 'Sign-in failed. Please try again later.';
		}
	}

	return {result, error};
}

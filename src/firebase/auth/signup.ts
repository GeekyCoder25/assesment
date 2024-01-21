import firebase_app from '../config';
import {
	AuthErrorCodes,
	createUserWithEmailAndPassword,
	getAuth,
} from 'firebase/auth';
import {AuthResult} from './auth.types';
import {FirebaseError} from 'firebase/app';
import axios from 'axios';
import {BASE_API_URL} from '@/constants';

const auth = getAuth(firebase_app);

export default async function signUp(
	email: string,
	password: string
): Promise<AuthResult> {
	let result = null,
		error = null;
	try {
		result = await createUserWithEmailAndPassword(auth, email, password);
		await axios.post(`${BASE_API_URL}/api/v1/user`, {email});
	} catch (e) {
		if (e instanceof FirebaseError) {
			if (e.code === AuthErrorCodes.NETWORK_REQUEST_FAILED) {
				error = 'Please check your internet connection';
			} else if (e.code === AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER) {
				error = 'Too many attempts, try again later';
			} else if (e.code === AuthErrorCodes.WEAK_PASSWORD) {
				error = 'Password should be at least 6 characters';
			} else if (e.code === AuthErrorCodes.EMAIL_EXISTS) {
				error = 'Email has already been used, sign in instead';
			} else {
				error = 'Sign-up failed. Please try again later.';
			}
		} else {
			error = 'Sign-up failed. Please try again later.';
		}
	}

	return {result, error};
}

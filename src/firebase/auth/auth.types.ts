import {FirebaseError} from 'firebase/app';
import {UserCredential} from 'firebase/auth';

export interface AuthResult {
	result: UserCredential | null;
	error: string | null;
}

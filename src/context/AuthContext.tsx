import React, {FC, createContext, useContext, useEffect, useState} from 'react';
import {onAuthStateChanged, getAuth, User} from 'firebase/auth';
import firebase_app from '@/firebase/config';
import {useRouter} from 'next/navigation';
import Loading from '@/components/Loading';

interface AuthContextProps {
	user: User | null;
	email?: string | null;
}

interface AuthContextProviderProps {
	children: React.ReactNode;
}

const auth = getAuth(firebase_app);

export const AuthContext = createContext<AuthContextProps>({user: null});

export const useAuthContext = (): AuthContextProps => useContext(AuthContext);

export const AuthContextProvider: FC<AuthContextProviderProps> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [email, setEmail] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, currentUser => {
			if (currentUser) {
				setUser(currentUser);
				setEmail(currentUser.email);
			} else {
				router.replace('/signin');
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider value={{user, email}}>
			{loading ? <Loading /> : children}
		</AuthContext.Provider>
	);
};

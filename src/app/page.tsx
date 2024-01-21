'use client';
import AdminPage from '@/components/AdminPage';
import UserPage from '@/components/UserPage';
import {BASE_API_URL} from '@/constants';
import {useAuthContext} from '@/context/AuthContext';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function Home() {
	const {email} = useAuthContext();
	const [isAdmin, setIsAdmin] = useState(false);
	const [photo, setPhoto] = useState(null);

	const router = useRouter();

	useEffect(() => {
		async function getUser() {
			if (!email) {
				return router.replace('/signin');
			}
			const response = await axios.get(`${BASE_API_URL}/api/v1/user/${email}`);
			if (response.data.email !== email) {
				return router.replace('/signin');
			}
			console.log(response.data);
			if (response.data.role === 'admin') {
				setIsAdmin(true);
			}
			setPhoto(response.data.photo);
		}
		getUser();
	}, []);

	return isAdmin ? <AdminPage /> : <UserPage photo={photo} />;
}

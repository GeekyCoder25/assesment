import {useAuthContext} from '@/context/AuthContext';
import React from 'react';

const Home = () => {
	const {user} = useAuthContext();
	console.log(user);
};

export default Home;

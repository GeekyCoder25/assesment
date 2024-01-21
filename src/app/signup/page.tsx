'use client';
import React, {useState} from 'react';
import signUp from '@/firebase/auth/signup';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

function Page() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();

	const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const {error} = await signUp(email, password);
		if (error) {
			return setErrorMessage(error);
		}

		return router.push('/');
	};

	return (
		<section
			className={
				'bg-cover bg-center min-h-screen flex items-center justify-center p-[5%] font-kanit'
			}
			style={{backgroundImage: "url('/images/loginBg.png')"}}
		>
			<div className="bg-white rounded-lg shadow-md flex flex-col mx-auto w-full md:w-2/3 lg:w-1/2 xl:w-1/3 p-8 gap-6">
				<h3 className="font-kanit text-2xl">Create Account</h3>
				<p>
					Already have an account?
					<Link href="/signin" className="text-primary">
						{' '}
						Sign in{' '}
					</Link>
				</p>

				<form className="flex flex-col gap-6" onSubmit={handleForm}>
					<div className="flex flex-col gap-3">
						<label htmlFor="email" className="font-kanit">
							Email address
						</label>
						<input
							onChange={e => setEmail(e.target.value)}
							onFocus={() => setErrorMessage('')}
							required
							type="email"
							name="email"
							id="email"
							placeholder="example@mail.com"
							className="bg-gray-100 h-18 p-4"
							autoComplete="true"
						/>
					</div>
					<div className="flex flex-col gap-3">
						<label htmlFor="password" className="font-kanit">
							Password
						</label>
						<input
							onChange={e => setPassword(e.target.value)}
							onFocus={() => setErrorMessage('')}
							required
							type="password"
							name="password"
							id="password"
							placeholder="Minimum 6 characters"
							className="bg-gray-100 h-18 p-4"
							autoComplete="true"
						/>
					</div>
					<p className="text-red-500">{errorMessage}</p>
					<button
						type="submit"
						className="bg-primary text-white p-5 rounded-md"
					>
						Sign up
					</button>
					<span className="text-center">
						By creating an account, you agree to our{' '}
						<Link href="" className="text-primary">
							Privacy Policy
						</Link>{' '}
						and{' '}
						<Link href="" className="text-primary">
							Terms of Service
						</Link>
					</span>
				</form>
			</div>
		</section>
	);
}

export default Page;

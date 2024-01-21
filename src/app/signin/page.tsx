'use client';
import React, {useState} from 'react';
import signIn from '@/firebase/auth/signin';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

function Page() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();

	const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const {error} = await signIn(email, password);
		if (error) {
			return setErrorMessage(error);
		}

		return router.replace('/');
	};

	return (
		<section
			className={
				'bg-cover bg-center min-h-screen flex items-center justify-center p-[5%] font-kanit'
			}
			style={{backgroundImage: "url('/images/loginBg.png')"}}
		>
			<div className="bg-white rounded-lg shadow-md flex flex-col mx-auto w-full md:w-2/3 lg:w-1/2 xl:w-1/3 p-8 gap-6">
				<h3 className="font-kanit font-semibold text-2xl">Welcome Back</h3>
				<p>Sign in to your account</p>

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
							placeholder="Enter a password"
							className="bg-gray-100 h-18 p-4"
							autoComplete="true"
						/>
					</div>
					<div className="flex items-center justify-between">
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								id="remember"
								className="form-checkbox accent-primary"
							/>
							<span>Remember me</span>
						</label>
						<Link href="" className="text-primary">
							Forgot password?
						</Link>
					</div>
					<p className="text-red-500">{errorMessage}</p>
					<button
						type="submit"
						className="bg-primary text-white p-5 rounded-md"
					>
						Login
					</button>
					<span className="text-center">
						Don’t have an account?
						<Link href="/signup" className="text-primary">
							{' '}
							Sign up{' '}
						</Link>
					</span>
				</form>
			</div>
		</section>
	);
}

export default Page;

import {BASE_API_URL} from '@/constants';
import {useAuthContext} from '@/context/AuthContext';
import {fields} from '@/data';
import signout from '@/firebase/auth/signout';
import {FieldType} from '@/interfaces';
import axios from 'axios';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';

function UserPage({photo}: {photo: string | null}) {
	const {email} = useAuthContext();
	const [formData, setFormData] = useState({
		company: '',
		no_of_users: 0,
		no_of_products: 0,
		percentage: 0,
	});
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [isNew, setIsNew] = useState(true);
	const router = useRouter();

	useEffect(() => {
		async function getFormData() {
			if (!email) {
				return router.replace('/signin');
			}
			const response = await axios.get(`${BASE_API_URL}/api/v1/form/${email}`);
			if (response.data.email === email) {
				setFormData(response.data);
				setIsNew(false);
			}
		}
		getFormData();
	}, []);

	const handleChange = (e: ChangeEvent<HTMLInputElement>, field: FieldType) => {
		setSuccessMessage('');
		setErrorMessage('');
		if (field.name === 'no_of_users') {
			if (!e.target.value) {
				return setFormData(prev => {
					return {
						...prev,
						[field.name]: Number(e.target.value),
						percentage: 0,
					};
				});
			} else if (formData.no_of_products) {
				return setFormData(prev => {
					return {
						...prev,
						[field.name]: Number(e.target.value),
						percentage: Math.floor(
							Number(
								(
									(Number(e.target.value) / formData.no_of_products) *
									100
								).toFixed(2)
							)
						),
					};
				});
			}
			return setFormData(prev => {
				return {...prev, [field.name]: Number(e.target.value)};
			});
		} else if (field.name === 'no_of_products') {
			if (!e.target.value) {
				return setFormData(prev => {
					return {
						...prev,
						[field.name]: Number(e.target.value),
						percentage: 0,
					};
				});
			} else if (formData.no_of_users) {
				return setFormData(prev => {
					return {
						...prev,
						[field.name]: Number(e.target.value),
						percentage: Math.floor(
							Number(
								((formData.no_of_users / Number(e.target.value)) * 100).toFixed(
									2
								)
							)
						),
					};
				});
			}
			return setFormData(prev => {
				return {...prev, [field.name]: Number(e.target.value)};
			});
		} else {
			setFormData(prev => {
				return {...prev, [field.name]: e.target.value};
			});
		}
	};

	const handleForm = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorMessage('');
		if (
			Object.values(formData).includes('') ||
			Object.values(formData).includes(0)
		) {
			return setErrorMessage('Please Input all fields');
		}

		try {
			const response = isNew
				? await axios.post(`${BASE_API_URL}/api/v1/form`, {...formData, email})
				: await axios.put(`${BASE_API_URL}/api/v1/form/${email}`, formData);
			if (response.status === 200) {
				setSuccessMessage('Updated Successfully');
			} else if (response.status === 201) {
				setSuccessMessage('Submitted successfully');
				setIsNew(false);
			}
		} catch (error) {
			console.log(error);
			if (axios.isAxiosError(error)) {
				if (error.response) {
					setErrorMessage(error.response.data.message);
				} else if (error.request) {
					setErrorMessage('No response from the server');
				} else {
					setErrorMessage('An unexpected error occurred');
				}
			} else {
				setErrorMessage('An unexpected error occurred');
			}
		}
	};

	const handleLogOut = async () => {
		const {error} = await signout();
		error && setErrorMessage(error);
	};

	return (
		<section
			className={
				'bg-cover bg-center min-h-screen flex items-center justify-center p-[5%] font-kanit flex-col gap-y-16'
			}
			style={{backgroundImage: 'url("/images/loginBg.png")'}}
		>
			<h1 className="font-bold text-3xl">User A</h1>
			<div className="bg-white rounded-lg shadow-md flex flex-col mx-auto w-full md:w-2/3 lg:w-1/2 xl:w-1/3 p-8 gap-6">
				<div className="flex justify-between items-center">
					<h3 className="font-kanit font-semibold text-2xl">Input Form</h3>
					{photo && (
						<Image
							src={photo}
							width={100}
							height={100}
							alt={'user'}
							className="w-[50px] h-[50px] rounded-[50%] object-cover"
							priority
						/>
					)}
				</div>

				<form className="flex flex-col gap-6" onSubmit={handleForm}>
					{fields.map(field => (
						<div className="flex flex-col gap-3" key={field.name}>
							<label htmlFor="company" className="font-kanit">
								{field.labelTitle}
							</label>
							<input
								onChange={text => handleChange(text, field)}
								required
								name="company"
								type={field.inputMode || 'text'}
								id="company"
								className="bg-gray-100 h-18 p-4"
								autoComplete="true"
								disabled={field.disable}
								value={
									field.name === 'percentage'
										? (formData[field.name] || '') + '%'
										: formData[field.name] || ''
								}
							/>
						</div>
					))}
					<p className="text-red-500">{errorMessage}</p>
					<p className="text-green-500">{successMessage}</p>
					<button
						type="submit"
						className="bg-primary text-white p-5 rounded-md mt-8"
					>
						{isNew ? 'Submit' : 'Update'}
					</button>
				</form>
				<button
					type="submit"
					className="text-primary p-5 mt-8 underline"
					onClick={handleLogOut}
				>
					Log out
				</button>
			</div>
		</section>
	);
}

export default UserPage;

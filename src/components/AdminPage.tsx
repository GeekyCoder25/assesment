import {BASE_API_URL} from '@/constants';
import signout from '@/firebase/auth/signout';
import axios from 'axios';
import Image from 'next/image';
import React, {FC, useEffect, useState} from 'react';

interface UserType {
	email: string;
	role: string;
	photo?: string;
}
const AdminPage = () => {
	const [users, setUsers] = useState<UserType[]>([]);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		async function getUsers() {
			const response = await axios.get(`${BASE_API_URL}/api/v1/user`);
			if (response.status === 200) {
				setUsers(response.data);
			}
		}
		getUsers();
	}, []);

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
			<h1 className="font-bold text-3xl">User B</h1>
			<div className="bg-white rounded-lg shadow-md flex flex-col mx-auto w-full md:w-2/3 lg:w-1/2 xl:w-1/2 max-w-[600px] p-8 gap-6">
				<div className="flex justify-between items-center">
					<h3 className="font-semibold text-2xl">Users</h3>
				</div>

				<div>
					{users.map(user => (
						<User key={user.email} user={user} />
					))}
				</div>

				<p className="text-red-500">{errorMessage}</p>

				<button
					type="submit"
					className="text-primary p-5 underline"
					onClick={handleLogOut}
				>
					Log out
				</button>
			</div>
		</section>
	);
};

export default AdminPage;

interface UserInput {
	email: string;
	company: string;
	no_of_users: number;
	no_of_products: number;
	percentage: number;
}
const User: FC<{user: UserType}> = ({user}) => {
	const {email} = user;
	const [expanded, setExpanded] = useState(false);
	const [userInput, setUserInput] = useState<UserInput | null>();
	const [preview, setPreview] = useState('');
	const [imageFormData, setImageFormData] = useState<FormData | null>(null);
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	const handleExpand = async (email: string) => {
		if (expanded) {
			setExpanded(false);
			return setUserInput(null);
		}
		const response = await axios.get(`${BASE_API_URL}/api/v1/form/${email}`);
		if (response.status === 200) {
			setExpanded(true);
			setUserInput(response.data);
		}
	};
	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) {
			console.error('No file selected');
			return;
		}
		const file = e.target.files[0];

		// Read the file as a data URL
		const handlePictureChange = new FileReader();
		handlePictureChange.readAsDataURL(file);

		// Set the preview when the file is loaded
		handlePictureChange.onload = event => {
			if (event.target) {
				setPreview(event.target.result as string);
			}
		};

		// Create FormData and append the file
		const formData = new FormData();
		formData.append('file', file);
		setImageFormData(formData);
	};

	const handleUpload = async () => {
		try {
			const response = await axios.put(
				`${BASE_API_URL}/api/v1/user/${email}/upload`,
				imageFormData
			);

			if (response.status === 200) {
				setSuccessMessage('Uploaded Successfully');
			} else {
				const errorData = response.data;
				console.log('Image upload failed', errorData);
				setErrorMessage('Error uploading image');
			}
		} catch (error) {
			setErrorMessage('Error uploading image');
		}
	};

	return (
		<div>
			<div className="flex flex-col md:flex-row justify-between md:items-center gap-x-16 gap-y-4 mb-5">
				<div className="flex items-center gap-3">
					<b className="">•</b>
					<h2>{email}</h2>
				</div>
				<button
					className="bg-primary text-white p-3 py-2 cursor-pointer rounded-md hover:scale-95"
					onClick={() => handleExpand(email)}
				>
					{expanded ? 'Hide' : 'View'} user input details
				</button>
			</div>
			{expanded && userInput && (
				<>
					<div className="md:mx-5 my-8">
						<div className="flex gap-x-8 md:gap-x-16">
							<p className="w-28">Company</p>
							----
							<h3 className="font-semibold">{userInput.company}</h3>
						</div>
						<div className="flex gap-x-8 md:gap-x-16">
							<p className="w-28">No of Users</p>
							----
							<h3 className="font-semibold">{userInput.no_of_users}</h3>
						</div>
						<div className="flex gap-x-8 md:gap-x-16">
							<p className="w-28">No of Products </p>
							----
							<h3 className="font-semibold">{userInput.no_of_products}</h3>
						</div>
						<div className="flex gap-x-8 md:gap-x-16">
							<p className="w-28">Percentage</p>
							----
							<h3 className="font-semibold">{userInput.percentage}</h3>
						</div>

						<p className="w-28 mt-4">Upload Photo</p>
						{preview && (
							<Image
								src={preview}
								alt="image"
								width={100}
								height={100}
								className="rounded-full"
							/>
						)}
						<div className="flex gap-x-8 md:gap-x-16 mt-5 items-center">
							<input
								type="file"
								name="photo"
								id="photo"
								onChange={handleImageSelect}
							/>
							{preview && (
								<button
									className="bg-primary text-white p-3 py-2 cursor-pointer rounded-md hover:scale-95"
									onClick={handleUpload}
								>
									Upload
								</button>
							)}
						</div>
						<p className="text-green-500 mt-5">{errorMessage}</p>
						<p className="text-green-500 mt-5">{successMessage}</p>
					</div>
				</>
			)}
		</div>
	);
};

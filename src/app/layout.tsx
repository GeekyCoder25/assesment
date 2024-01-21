'use client';
import type {Metadata} from 'next';
import './globals.css';
import React from 'react';
import {AuthContextProvider} from '@/context/AuthContext';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<AuthContextProvider>{children}</AuthContextProvider>
			</body>
		</html>
	);
}

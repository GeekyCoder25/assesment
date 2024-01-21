import {FieldType} from '@/interfaces';

export const fields: FieldType[] = [
	{
		name: 'company',
		labelTitle: 'Company Name',
	},
	{
		name: 'no_of_users',
		labelTitle: 'Number of Users',
		inputMode: 'number',
	},
	{
		name: 'no_of_products',
		labelTitle: 'Number of Products',
		inputMode: 'number',
	},
	{
		name: 'percentage',
		labelTitle: 'Percentage',
		disable: true,
	},
];

import {HTMLInputTypeAttribute} from 'react';

export interface FieldType {
	name: 'company' | 'no_of_users' | 'no_of_products' | 'percentage';
	labelTitle: string;
	inputMode?: HTMLInputTypeAttribute;
	disable?: boolean;
}

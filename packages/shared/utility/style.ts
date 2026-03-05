import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

type ClassNameValue = string | number | null | undefined | false | { [key: string]: any };

export const cn = (...inputs: ClassNameValue[]) => {
    return twMerge(clsx(inputs));
};
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import React from 'react';

import { NextPage } from 'next';

export interface ButtonOwnProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    typeButton?: 'primary' | '' | 'secondary' | 'tertiary';
    loading?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    avatar: string;
    username: string;
    numLike: number;
    numFollow: number;
}

export interface IToken {
    accessToken: string;
    refreshToken: string;
}

export interface IRes<T> {
    message: string;
    data: T;
}

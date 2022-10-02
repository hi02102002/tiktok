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
    followers: Array<string>;
    following: Array<string>;
    bio: string;
}

export interface IToken {
    accessToken: string;
    refreshToken: string;
}

export interface IRes<T> {
    message: string;
    data: T;
}

export interface IFile {
    id: string;
    url: string;
}

export interface IPost {
    caption: string;
    user: IUser;
    type: string;
    video: IFile;
    allowComment: boolean;
    numLike: number;
    totalComment: number;
    _id: string;
    usersLiked: Array<string>;
    createdAt: string;
    updatedAt: string;
    width: number;
    height: number;
    cover: IFile;
}

export type IPostInput = Pick<
    IPost,
    'allowComment' | 'caption' | 'video' | 'width' | 'height' | 'type' | 'cover'
>;

export enum TypeFollow {
    FOLLOW,
    UNFOLLOW,
}

export enum TypeLike {
    UNLIKE,
    LIKE,
}

export type onFollow = (
    type: TypeFollow,
    userId: string,
    receiverId: string,
) => void;

export interface IComment {
    user: IUser;
    _id: string;
    content: string;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
    usersLiked: Array<string>;
    postId: string;
    numChildren: number;
}

import { GetServerSidePropsContext } from 'next';

import { ROUTES } from '@/constants';
import { setUser } from '@/features/user';
import { wrapper } from '@/store';
import { IUser } from '@/types';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { getSession } from 'next-auth/react';

interface IOptions {
    isProtected: boolean;
}

export const withRoute =
    (options: IOptions) =>
    (
        gssp?: (
            ctx: GetServerSidePropsContext,
            dispatch: Dispatch<AnyAction>,
        ) => any,
    ) =>
        wrapper.getServerSideProps(
            ({ dispatch }) =>
                async (ctx: GetServerSidePropsContext) => {
                    const session = await getSession(ctx);

                    // neu user chua login va no la route protect
                    if (!session && options.isProtected) {
                        return {
                            redirect: {
                                destination: ROUTES.LOGIN,
                                permanent: false,
                            },
                        };
                    }

                    // neu ma login r ma o trong route login wa register
                    if (
                        session &&
                        (ctx.resolvedUrl === ROUTES.LOGIN ||
                            ctx.resolvedUrl === ROUTES.REGISTER ||
                            ctx.resolvedUrl === ROUTES.FORGET_PASSWORD ||
                            ctx.resolvedUrl === ROUTES.RESET_PASSWORD)
                    ) {
                        return {
                            redirect: {
                                destination: ROUTES.HOME,
                                permanent: false,
                            },
                        };
                    }

                    const sessionUser = session?.user as IUser;

                    if (session?.user) {
                        const user: IUser = {
                            _id: sessionUser._id,
                            firstName: sessionUser.firstName,
                            lastName: sessionUser.lastName,
                            email: sessionUser.email,
                            createdAt: sessionUser.createdAt,
                            updatedAt: sessionUser.updatedAt,
                            username: sessionUser.username,
                            numLike: sessionUser.numLike,
                            numFollow: sessionUser.numFollow,
                            avatar: sessionUser.avatar,
                        };

                        dispatch(setUser(user));
                    } else {
                        dispatch(setUser(null));
                    }

                    if (!gssp) {
                        return {
                            props: {},
                        };
                    }

                    const gsspData = await gssp(ctx, dispatch);

                    if (gsspData && gsspData.hasOwnProperty('props')) {
                        return {
                            props: {
                                ...gsspData.props,
                            },
                        };
                    }

                    return {
                        props: {},
                    };
                },
        );

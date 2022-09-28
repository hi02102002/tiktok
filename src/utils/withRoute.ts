import { GetServerSidePropsContext } from 'next';

import axios from '@/axios';
import { ROUTES } from '@/constants';
import { setUser } from '@/features/user';
import { wrapper } from '@/store';
import { IRes, IUser } from '@/types';
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
                    const session = await getSession({ req: ctx.req });

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

                    axios.defaults.headers.common.authorization = `Bearer ${session?.accessToken}`;
                    const sessionUser = session?.user as IUser;

                    if (sessionUser) {
                        const user = await axios
                            .get<
                                IRes<{
                                    user: IUser;
                                }>
                            >(`/users/${sessionUser._id}`)
                            .then((value) => value.data.data.user);

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

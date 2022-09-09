import { ERROR_TOKEN, ROUTES } from '@/constants';
import { IRes, IToken, IUser } from '@/types';
import axios from 'axios';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

const handleRefreshToken = async (token: JWT) => {
    try {
        const tokenData = await axios
            .post<
                IRes<{
                    token: IToken;
                }>
            >(`${process.env.NEXT_PUBLIC_API_URL}/refreshToken`, {
                refreshToken: token.refreshToken,
            })
            .then((value) => value.data.data.token);

        const { accessToken, refreshToken } = tokenData;

        const accessTokenExpirationTime =
            (jwt_decode<JwtPayload>(accessToken as string).exp as number) *
                1000 -
            10;

        return {
            ...token,
            accessToken,
            accessTokenExpires: accessTokenExpirationTime,
            refreshToken: refreshToken ?? token.refreshToken, // Fall back to old refresh token
        };
    } catch (error) {
        console.dir(error);
        return {
            ...token,
            error: ERROR_TOKEN,
        };
    }
};

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'email@domain.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                try {
                    const data = await axios
                        .post<
                            IRes<{
                                user: IUser;
                                token: IToken;
                            }>
                        >(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                            email: credentials?.email,
                            password: credentials?.password,
                        })
                        .then((value) => {
                            return value.data.data;
                        });

                    if (data) {
                        const { accessToken, refreshToken }: IToken =
                            data.token;

                        const accessTokenExpirationTime =
                            (jwt_decode<JwtPayload>(accessToken)
                                .exp as number) *
                                1000 -
                            10;
                        //minus 10 seconds before expiration time to prevent token expiration error in the browser side unit ms

                        return {
                            ...data.user,
                            accessToken,
                            accessTokenExpires: accessTokenExpirationTime,
                            refreshToken,
                        };
                        //return new object user contain token
                    }
                    return null; //if the data is null, return null
                } catch (e: any) {
                    throw new Error(e.response.data.message); //if the server response is an error, throw an error with the message from the server
                }
            },
        }),
    ],
    callbacks: {
        //The jwt() callback is called when a new token is created.
        async jwt({ token, user, account }) {
            if (user && account) {
                return {
                    accessToken: user.accessToken,
                    accessTokenExpires: user.accessTokenExpires,
                    refreshToken: user.refreshToken,
                    user,
                };
            }

            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            return handleRefreshToken(token);
        },
        //The session() callback is called when a user logs in or log out
        async session({ session, token }) {
            //@ts-ignore
            session.user = token.user;
            session.accessToken = token.accessToken;
            session.error = token.error;
            return session;
        },
    },
    //The signIn page is the page that the user is redirected to when they are not logged in.
    pages: {
        signIn: ROUTES.LOGIN,
    },
    secret: process.env.NEXTAUTH_SECRET,
});

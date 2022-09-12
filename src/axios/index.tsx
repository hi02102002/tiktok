import axios from 'axios';
import { getSession } from 'next-auth/react';

export const cancelToken = axios.CancelToken.source();

const ApiClient = () => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        cancelToken: cancelToken.token,
    });

    instance.interceptors.request.use(
        async (request) => {
            const session = await getSession();
            if (session && request.headers) {
                request.headers.Authorization = `Bearer ${session.accessToken}`;
            }
            return request;
        },
        function (error) {
            return Promise.reject(error);
        },
    );

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    return instance;
};

export default ApiClient();

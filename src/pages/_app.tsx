import { useEffect } from 'react';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { Auth } from '@/components';
import { wrapper } from '@/store';
import '@/styles/globals.scss';
import { NextPageWithLayout } from '@/types';
import { SessionProvider } from 'next-auth/react';
import nProgress from 'nprogress';
import { Toaster } from 'react-hot-toast';

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};
function MyApp({
    Component,
    pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
    const router = useRouter();

    useEffect(() => {
        const handleStart = (url: string) => {
            nProgress.start();
        };
        const handleStop = () => {
            nProgress.done();
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleStop);
        router.events.on('routeChangeError', handleStop);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleStop);
            router.events.off('routeChangeError', handleStop);
        };
    }, [router]);
    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <SessionProvider session={session}>
            <Auth>
                <div>
                    <Toaster />
                </div>
                {getLayout(<Component {...pageProps} />)}
            </Auth>
        </SessionProvider>
    );
}

export default wrapper.withRedux(MyApp);

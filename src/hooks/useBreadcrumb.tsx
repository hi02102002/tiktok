import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { IBreadcrumb } from '@/types';

export const useBreadcrumb = (defaultHome?: IBreadcrumb) => {
    const router = useRouter();
    const [breadcrumbs, setBreadcrumbs] = useState<Array<IBreadcrumb>>([]);

    useEffect(() => {
        const pathWithoutQuery = router.asPath.split('?')[0];
        const pathArray = pathWithoutQuery
            .split('/')
            .filter((path) => path !== '');

        const breadcrumbs: Array<IBreadcrumb> = pathArray.map((path, index) => {
            const href = '/' + pathArray.slice(0, index + 1).join('/');

            if (path.includes('-') || path.includes('_')) {
                path = path.replaceAll(/_|-/g, ' ');
            }

            return {
                href,
                name: path,
            };
        });
        setBreadcrumbs(breadcrumbs);
    }, [router.asPath]);

    return breadcrumbs;
};

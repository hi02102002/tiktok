import { DefaultLayout } from '@/components/Layout';
import { NextPageWithLayout } from '@/types';

const Following: NextPageWithLayout = () => {
    return <div>Following</div>;
};

Following.getLayout = function (page) {
    return <DefaultLayout>{page}</DefaultLayout>;
};

export default Following;

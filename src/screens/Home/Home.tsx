import { DefaultLayout } from '@/components/Layout';
import { NextPageWithLayout } from '@/types';

const Home: NextPageWithLayout = () => {
    return <div>Home</div>;
};

Home.getLayout = function (page) {
    return <DefaultLayout>{page}</DefaultLayout>;
};

export default Home;

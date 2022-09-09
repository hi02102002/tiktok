import { Header } from '@/components';
import { NextPageWithLayout } from '@/types';
import { withRoute } from '@/utils';

const Home: NextPageWithLayout = () => {
    return (
        <div>
            <Header />
        </div>
    );
};

export const getServerSideProps = withRoute({ isProtected: true })();

export default Home;

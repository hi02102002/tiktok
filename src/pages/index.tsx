import Home from '@/screens/Home';
import { withRoute } from '@/utils';

export const getServerSideProps = withRoute({ isProtected: false })();

export default Home;

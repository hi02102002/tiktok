import Following from '@/screens/Following';
import { withRoute } from '@/utils';

export const getServerSideProps = withRoute({ isProtected: true })();

export default Following;

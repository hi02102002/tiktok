import { Register } from '@/screens/Auth';
import { withRoute } from '@/utils';

export const getServerSideProps = withRoute({ isProtected: false })();

export default Register;

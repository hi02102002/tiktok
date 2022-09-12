import Upload from '@/screens/Upload';
import { withRoute } from '@/utils';

export const getServerSideProps = withRoute({ isProtected: true })();

export default Upload;

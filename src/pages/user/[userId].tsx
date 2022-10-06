import Profile from '@/screens/Profile';
import usersServices from '@/services/users.services';
import { withRoute } from '@/utils';

export const getServerSideProps = withRoute({ isProtected: false })(
    async (ctx) => {
        const userId = ctx.params?.userId as string;

        const user = await usersServices.getUser(userId);

        return {
            props: {
                user,
            },
        };
    },
);

export default Profile;

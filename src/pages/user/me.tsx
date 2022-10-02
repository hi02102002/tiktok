import Profile from '@/screens/Profile';
import postServices from '@/services/post.services';
import usersServices from '@/services/users.services';
import { IUser } from '@/types';
import { withRoute } from '@/utils';
import { getSession } from 'next-auth/react';

const LIMIT = 10;

export const getServerSideProps = withRoute({ isProtected: true })(
    async (ctx) => {
        const session = await getSession({ req: ctx.req });
        const sessionUser = session?.user as IUser;
        const user = await usersServices.getUser(sessionUser._id);
        const posts = await postServices.fetchOwnPosts(1, LIMIT);

        return {
            props: {
                user,
                posts,
                hasMore: posts.length >= LIMIT ? true : false,
            },
        };
    },
);

export default Profile;

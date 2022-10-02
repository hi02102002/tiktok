import Profile from '@/screens/Profile';
import postServices from '@/services/post.services';
import usersServices from '@/services/users.services';
import { withRoute } from '@/utils';

const LIMIT = 10;

export const getServerSideProps = withRoute({ isProtected: false })(
    async (ctx) => {
        const userId = ctx.params?.userId as string;

        const user = await usersServices.getUser(userId);
        const posts = await postServices.fetchUserPosts(userId, 1, LIMIT);

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

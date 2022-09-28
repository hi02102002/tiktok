import { fetchPosts, unmountPosts } from '@/features/post';
import Following from '@/screens/Following';
import postServices from '@/services/post.services';
import { withRoute } from '@/utils';

export const getServerSideProps = withRoute({ isProtected: true })(
    async (ctx, dispatch) => {
        const posts = await postServices.fetchFollowingPosts(1, 10);
        dispatch(unmountPosts());
        dispatch(fetchPosts({ posts, page: 1 }));
        return {
            props: {},
        };
    },
);

export default Following;

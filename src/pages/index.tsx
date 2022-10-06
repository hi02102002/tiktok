import { fetchPosts, unmountPosts } from '@/features/post';
import Home from '@/screens/Home';
import postServices from '@/services/post.services';
import { withRoute } from '@/utils';

export const getServerSideProps = withRoute({ isProtected: false })(
    async (ctx, dispatch) => {
        const posts = await postServices.fetchPostsHome(1, 10);
        dispatch(unmountPosts());
        dispatch(fetchPosts({ posts }));

        return {
            props: {},
        };
    },
);

export default Home;

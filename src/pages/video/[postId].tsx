import { fetchComments, unmountComments } from '@/features/comments';
import { fetchPosts, unmountPosts } from '@/features/post';
import { PostDetail } from '@/screens/PostDetail';
import postServices from '@/services/post.services';
import { withRoute } from '@/utils';

export default PostDetail;

export const getServerSideProps = withRoute({ isProtected: false })(
    async (ctx, dispatch) => {
        const postId = ctx.params?.postId as string;
        const post = await postServices.getOnePost(postId);
        const comments = await postServices.getComments(postId, 1, 10);
        dispatch(unmountPosts());
        dispatch(unmountComments());
        dispatch(fetchPosts({ posts: [post] }));
        dispatch(fetchComments({ comments, page: 1 }));
        return {
            props: {},
        };
    },
);

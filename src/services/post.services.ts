import axiosClient from '@/axios';
import { IPost, IPostInput, IRes } from '@/types';

class PostService {
    public async addPost(post: IPostInput) {
        return await axiosClient
            .post<
                IRes<{
                    post: IPost;
                }>
            >('/posts', {
                ...post,
            })
            .then((value) => value.data.data.post);
    }

    public async fetchPostsHome(page = 1, limit = 10) {
        return await axiosClient
            .get<
                IRes<{
                    posts: Array<IPost>;
                }>
            >('/posts', {
                params: {
                    limit,
                    page,
                },
            })
            .then((value) => value.data.data.posts);
    }

    public async fetchFollowingPosts(page = 1, limit = 10) {
        return await axiosClient
            .get<
                IRes<{
                    posts: Array<IPost>;
                }>
            >('/posts/following', {
                params: {
                    limit,
                    page,
                },
            })
            .then((value) => value.data.data.posts);
    }
}

export default new PostService();

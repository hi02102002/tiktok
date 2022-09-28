import axiosClient from '@/axios';
import { IComment, IPost, IPostInput, IRes } from '@/types';

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

    public async likePost(postId: string) {
        return await axiosClient.patch(`/posts/${postId}/like`);
    }
    public async unlikePost(postId: string) {
        return await axiosClient.patch(`/posts/${postId}/unlike`);
    }

    public async getOnePost(postId: string) {
        return await axiosClient
            .get<
                IRes<{
                    post: IPost;
                }>
            >(`/posts/${postId}`)
            .then((value) => value.data.data.post);
    }

    public async getComments(postId: string) {
        return await axiosClient
            .get<
                IRes<{
                    comments: Array<IComment>;
                }>
            >(`/posts/${postId}/comments`)
            .then((value) => value.data.data.comments);
    }

    public async getChildComments(
        postId: string,
        parentId: string,
        page: number,
        limit: number,
    ) {
        return await axiosClient
            .get<
                IRes<{
                    comments: Array<IComment>;
                }>
            >(`/posts/${postId}/comments/children`, {
                params: {
                    parentId,
                    page,
                    limit,
                },
            })
            .then((value) => value.data.data.comments);
    }

    public async addComment(
        postId: string,
        content: string,
        parentId?: string,
    ) {
        return await axiosClient
            .post<
                IRes<{
                    comment: IComment;
                }>
            >(`posts/${postId}/comments`, {
                content,
                parentId,
            })
            .then((value) => value.data.data.comment);
    }

    public async removeComment(postId: string, commentId: string) {
        return await axiosClient
            .delete<IRes<null>>(`posts/${postId}/comments/${commentId}`)
            .then((value) => value.data.data);
    }

    public async likeComment(commentId: string, postId: string) {
        return await axiosClient
            .patch<
                IRes<{
                    comment: IComment;
                }>
            >(`/posts/${postId}/comments/${commentId}/like`)
            .then((value) => value.data.data.comment);
    }

    public async unlikeComment(commentId: string, postId: string) {
        return await axiosClient
            .patch<
                IRes<{
                    comment: IComment;
                }>
            >(`/posts/${postId}/comments/${commentId}/unlike`)
            .then((value) => value.data.data.comment);
    }
}

export default new PostService();

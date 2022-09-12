import axios from '@/axios';
import { IPost, IPostInput, IRes } from '@/types';

class PostService {
    public async addPost(post: IPostInput) {
        return await axios
            .post<
                IRes<{
                    post: IPost;
                }>
            >('/posts', {
                ...post,
            })
            .then((value) => value.data.data.post);
    }
}

export default new PostService();

import { Post, Spiner } from '@/components';
import { selectPost } from '@/features/post';
import { useAppSelector } from '@/hooks';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
    onGetMore: () => void;
}

const ScrollInfinityPosts = ({ onGetMore }: Props) => {
    const { hasMore, posts } = useAppSelector(selectPost);

    return (
        <InfiniteScroll
            next={onGetMore}
            hasMore={hasMore}
            dataLength={posts.length}
            loader={<Spiner />}
        >
            {posts.map((post) => {
                return (
                    <div key={post._id} className="mb-6 last:mb-0">
                        <Post post={post} />
                    </div>
                );
            })}
        </InfiniteScroll>
    );
};

export default ScrollInfinityPosts;

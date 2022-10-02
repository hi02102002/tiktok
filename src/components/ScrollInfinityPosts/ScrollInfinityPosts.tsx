import { Post, Spiner } from '@/components';
import { selectPost } from '@/features/post';
import { useAppSelector } from '@/hooks';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
    onGetMore: () => void;
    type: 'FOLLOWING' | 'HOME';
}

const ScrollInfinityPosts = ({ onGetMore, type }: Props) => {
    const { hasMore, posts } = useAppSelector(selectPost);

    return (
        <InfiniteScroll
            next={onGetMore}
            hasMore={hasMore}
            dataLength={posts.length}
            loader={<Spiner />}
            style={{
                overflow: 'hidden',
            }}
        >
            {posts.map((post) => {
                return (
                    <div key={post._id} className="mb-6 last:mb-0">
                        <Post post={post} type={type} />
                    </div>
                );
            })}
        </InfiniteScroll>
    );
};

export default ScrollInfinityPosts;

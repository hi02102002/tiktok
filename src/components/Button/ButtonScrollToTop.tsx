import { useScrollToTop } from '@/hooks';
import { AiOutlineArrowUp } from 'react-icons/ai';

export const ButtonScrollToTop = () => {
    const { handleScrollToTop, showButton } = useScrollToTop();
    return showButton ? (
        <button
            className="fixed right-6 bottom-6 bg-primary w-8 h-8 flex items-center justify-center rounded-full"
            onClick={handleScrollToTop}
        >
            <AiOutlineArrowUp className="icon-16 text-white" />
        </button>
    ) : null;
};

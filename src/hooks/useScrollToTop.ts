import { useCallback, useEffect, useState } from 'react';

export const useScrollToTop = () => {
    const [showButton, setShowButton] = useState<boolean>(false);

    const handleScrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 500) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
    }, []);

    return { showButton, handleScrollToTop };
};

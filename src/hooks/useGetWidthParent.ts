import { MutableRefObject, useEffect, useRef, useState } from 'react';

export const useGetWidthParent = <T extends HTMLElement = any>(): {
    width: number;
    parentRef: MutableRefObject<T | null>;
} => {
    const parentRef = useRef<T | null>(null);
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        const handleResize = () => {
            setWidth(parentRef.current?.offsetWidth as number);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return { width, parentRef };
};

import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';

const useElementOnScreen = <T extends Element = Element>(
    targetRef: RefObject<T>,
    options: IntersectionObserverInit,
) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const callbackFunction: IntersectionObserverCallback = useCallback(
        (entries) => {
            const [entry] = entries; //const entry = entries[0]
            setIsVisible(entry.isIntersecting);
        },
        [],
    );
    const optionsMemo = useMemo(() => {
        return options;
    }, [options]);
    useEffect(() => {
        const observer = new IntersectionObserver(
            callbackFunction,
            optionsMemo,
        );
        const currentTarget = targetRef.current;
        if (currentTarget) observer.observe(currentTarget);

        return () => {
            if (currentTarget) observer.unobserve(currentTarget);
        };
    }, [targetRef, optionsMemo, callbackFunction]);
    return isVisible;
};
export default useElementOnScreen;

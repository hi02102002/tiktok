import { useCallback, useEffect, useRef, useState } from 'react';

export const useTogglePassword = () => {
    const ref = useRef<HTMLInputElement | null>(null);
    const [hidden, setHidden] = useState(true);

    const handelToggle = useCallback(() => {
        setHidden(!hidden);
    }, [hidden]);

    useEffect(() => {
        if (ref.current) {
            if (hidden) {
                ref.current.type = 'password';
            } else {
                ref.current.type = 'text';
            }
        }
    }, [hidden]);

    return {
        ref,
        hidden,
        onToggle: handelToggle,
    };
};

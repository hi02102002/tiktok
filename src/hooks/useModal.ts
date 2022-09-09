import { useCallback, useMemo, useState } from 'react';

export const useModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleOpen = useCallback(() => {
        setIsOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);
    const handleToggle = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    return useMemo(() => {
        return { isOpen, handleOpen, handleClose, handleToggle };
    }, [isOpen, handleOpen, handleClose, handleToggle]);
};

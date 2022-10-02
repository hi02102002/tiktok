import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useClickOutSide } from '@/hooks';
import { createPortal } from 'react-dom';

interface Props {
    children: React.ReactNode;
    haveBackDrop?: boolean;
    onClose: () => void;
    width?: number;
}

const Modal = ({
    children,
    haveBackDrop = true,
    onClose,
    width = 700,
}: Props) => {
    const [isBrowser, setIsBrowser] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const backdrop = useMemo(() => {
        return haveBackDrop ? 'bg-black/60 fixed inset-0 w-full h-full' : '';
    }, [haveBackDrop]);

    useClickOutSide(contentRef, (e) => {
        e.stopPropagation();
        onClose();
    });
    useEffect(() => {
        setIsBrowser(true);
    }, []);

    if (isBrowser) {
        return createPortal(
            <div
                className={`fixed inset-0 min-h-screen overflow-y-auto  z-[1000] ${backdrop}`}
            >
                <div className="p-6 h-full">
                    <div
                        className="relative z-10 w-full mx-auto"
                        ref={contentRef}
                        style={{
                            maxWidth: width,
                        }}
                    >
                        {children}
                    </div>
                </div>
            </div>,
            document.getElementById('modal')!,
        );
    }
    return null;
};

export default Modal;

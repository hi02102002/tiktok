import { HTMLAttributes, useCallback, useState } from 'react';

import { useGetWidthParent } from '@/hooks';
import Tippy from '@tippyjs/react/headless';

interface PropsSelect extends HTMLAttributes<HTMLElement> {
    value: {
        label: string;
        value: string;
    } | null;
    onChangeValue: (value: { label: string; value: string }) => void;
    placeholder?: string;
    options: Array<{ label: string; value: string }>;
}

export const Select = ({
    onChangeValue,
    value: propsValue,
    placeholder = 'Select...',
    className = '',
    options,
    ...rest
}: PropsSelect) => {
    const [show, setShow] = useState<boolean>(false);
    const { width: widthSelect, parentRef } = useGetWidthParent();
    const handleChoose = useCallback(
        (option: { label: string; value: string }) => {
            onChangeValue(option);
            setShow(false);
        },
        [onChangeValue],
    );

    return (
        <Tippy
            interactive
            render={(attrs) => {
                return (
                    <div
                        {...attrs}
                        style={{
                            width:
                                widthSelect || parentRef.current?.offsetWidth,
                        }}
                        className="w-full rounded bg-white shadow"
                    >
                        <div className="py-2">
                            {options.map((option) => {
                                return (
                                    <div
                                        onClick={() => handleChoose(option)}
                                        key={option.label}
                                        className="py-2 px-4 cursor-pointer hover:bg-neutral-100"
                                    >
                                        {option.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }}
            visible={show}
            onClickOutside={() => {
                setShow(false);
            }}
            placement="bottom"
        >
            <div
                className={`max-w-xs w-full cursor-pointer select-none form-input ${className}`}
                onClick={() => {
                    setShow(!show);
                }}
                ref={parentRef}
                {...rest}
            >
                {<button>{propsValue?.label || placeholder}</button>}
            </div>
        </Tippy>
    );
};

import { Spiner } from '@/components';
import { ButtonOwnProps } from '@/types';
import classNames from 'classnames/bind';

import styles from './Button.module.scss';

const cx = classNames.bind(styles);

const Button = ({
    children,
    className = '',
    typeButton = '',
    loading = false,
    disabled,
    iconLeft,
    iconRight,
    ...rest
}: ButtonOwnProps) => {
    return (
        <button
            type="button"
            className={cx('btn', typeButton, className)}
            disabled={disabled}
            {...rest}
        >
            {loading && (
                <Spiner
                    className={
                        disabled || typeButton === 'tertiary' ? 'text-neutral-500' : ''
                    }
                />
            )}
            {!loading && iconLeft}
            {children}
            {!loading && iconRight}
        </button>
    );
};

export default Button;

import { useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import axios from '@/axios';
import { Button, Logo } from '@/components';
import { ROUTES } from '@/constants';
import { useTogglePassword } from '@/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { AiOutlineUnlock } from 'react-icons/ai';
import * as yup from 'yup';

import styles from './Auth.module.scss';
import ButtonTogglePassword from './ButtonTogglePassword';

const cx = classNames.bind(styles);

type IFormInputs = {
    password: string;
};

const schema = yup.object({
    password: yup
        .string()
        .required('This password is require.')
        .min(8, 'This password at least 8 character.'),
});

const ResetPassword = () => {
    const router = useRouter();
    const {
        ref: passwordRef,
        onToggle: onPasswordToggle,
        hidden: passwordHidden,
    } = useTogglePassword();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setFocus,
    } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
    });
    const { ref: refPasswordFormHook, ...registerPassword } =
        register('password');
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: IFormInputs) => {
        try {
            const { token } = router.query;
            setLoading(true);
            await axios.post(`/reset-password?token=${token}`, {
                password: data.password,
            });
            toast.success('Reset password successfully.');
            router.push(ROUTES.LOGIN);
        } catch (error: any) {
            toast.error(error.response.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Tiktok - Reset Password</title>
            </Head>
            <div>
                <header className="h-header flex items-center bg-white shadow-header">
                    <div className="app-container">
                        <Logo />
                    </div>
                </header>
                <div className={cx('auth')}>
                    <div className="app-container flex items-center justify-center">
                        <div className={cx('auth-content')}>
                            <div className="flex flex-col text-center  items-center">
                                <AiOutlineUnlock className="w-24 h-24 mb-6 " />
                                <h3 className="font-semibold mb-4">
                                    Reset your password
                                </h3>
                                <form
                                    className="w-full mt-6 space-y-4"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <div className="input-group">
                                        <label className="form-label text-start">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                placeholder="New password"
                                                className={`form-input ${
                                                    errors.password?.message &&
                                                    'error'
                                                }`}
                                                ref={(e) => {
                                                    passwordRef.current = e;
                                                    refPasswordFormHook(e);
                                                }}
                                                {...registerPassword}
                                            />
                                            <ButtonTogglePassword
                                                hidden={passwordHidden}
                                                onToggle={onPasswordToggle}
                                                isError={
                                                    !!errors.password?.message
                                                }
                                            />
                                        </div>
                                        {errors.password?.message && (
                                            <p className="form-error text-start">
                                                {errors.password?.message}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        className={cx(
                                            'btn',
                                            'text-start',
                                            'w-full',
                                        )}
                                        loading={loading}
                                        disabled={loading}
                                        type="submit"
                                        typeButton="primary"
                                    >
                                        Reset password
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;

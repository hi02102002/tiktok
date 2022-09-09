import { ReactElement, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Button } from '@/components';
import { DefaultLayout } from '@/components/Layout';
import { ROUTES } from '@/constants';
import { useFocusFirstInput, useTogglePassword } from '@/hooks';
import { NextPageWithLayout } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import styles from './Auth.module.scss';
import ButtonTogglePassword from './ButtonTogglePassword';

const cx = classNames.bind(styles);

type IFormInputs = {
    email: string;
    password: string;
};

const schema = yup.object({
    email: yup
        .string()
        .email('Invalid email.')
        .required('This email is require.'),
    password: yup.string().required('This password is require.'),
});

const Login: NextPageWithLayout = () => {
    const router = useRouter();
    const { ref: passwordRef, onToggle, hidden } = useTogglePassword();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setFocus,
    } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
    });
    const [loading, setLoading] = useState<boolean>(false);
    useFocusFirstInput(errors, setFocus);
    const { ref: refPasswordFormHook, ...registerPassword } =
        register('password');

    const onSubmit = async (data: IFormInputs) => {
        try {
            setLoading(true);
            const res: any = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (res?.error) {
                throw new Error(res.error);
            }

            if (res?.ok) {
                setLoading(false);
                toast.success('Login successfully');
                router.push(ROUTES.HOME);
            }
        } catch (error: any) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <div className={cx('auth')}>
            <div className="app-container flex items-center justify-center">
                <div className={cx('auth-content')}>
                    <h3 className={cx('title')}>Login</h3>
                    <form
                        className="flex gap-6 flex-col"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="input-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                className={`form-input ${
                                    errors.email?.message && 'error'
                                }`}
                                {...register('email')}
                                autoFocus
                            />
                            {errors.email?.message && (
                                <p className="form-error">
                                    {errors.email?.message}
                                </p>
                            )}
                        </div>
                        <div className="input-group">
                            <label className="form-label">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={`form-input ${
                                        errors.password?.message && 'error'
                                    }`}
                                    ref={(e) => {
                                        passwordRef.current = e;
                                        refPasswordFormHook(e);
                                    }}
                                    {...registerPassword}
                                />
                                <ButtonTogglePassword
                                    hidden={hidden}
                                    onToggle={onToggle}
                                    isError={!!errors.password?.message}
                                />
                            </div>
                            {errors.password?.message && (
                                <p className="form-error">
                                    {errors.password?.message}
                                </p>
                            )}
                        </div>
                        <Link href={ROUTES.FORGET_PASSWORD}>
                            <a className="link">Forgot password ? </a>
                        </Link>
                        <Button
                            type="submit"
                            loading={loading}
                            disabled={loading}
                            className={cx('btn')}
                            typeButton="primary"
                        >
                            Login
                        </Button>
                    </form>
                    <div className="mt-6 text-center ">
                        <p>
                            Don&apos;t have account?{' '}
                            <Link href={ROUTES.REGISTER}>
                                <a className="link">Register</a>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

Login.getLayout = function getLayout(page: ReactElement) {
    return <DefaultLayout>{page}</DefaultLayout>;
};

export default Login;

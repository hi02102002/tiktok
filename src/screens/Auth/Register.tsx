import { ReactElement, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Button } from '@/components';
import { DefaultLayout } from '@/components/Layout';
import { ROUTES } from '@/constants';
import { useFocusFirstInput, useTogglePassword } from '@/hooks';
import { IRes, IUser, NextPageWithLayout } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import classNames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import styles from './Auth.module.scss';
import ButtonTogglePassword from './ButtonTogglePassword';

const cx = classNames.bind(styles);

type IFormInputs = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
};

const schema = yup.object({
    firstName: yup.string().required('First name is require.'),
    lastName: yup.string().required('Last name is require.'),
    username: yup.string().required('Username is require.'),
    email: yup
        .string()
        .email('Invalid email.')
        .required('This email is require.'),
    password: yup
        .string()
        .min(8, 'This password at least 8 character.')
        .required('This password is require.'),
    confirmPassword: yup
        .string()
        .required('Confirm password is require.')
        .oneOf([yup.ref('password'), null], "Passwords don't match."),
});

const Register: NextPageWithLayout = () => {
    const router = useRouter();
    const {
        ref: passwordRef,
        onToggle: onPasswordToggle,
        hidden: passwordHidden,
    } = useTogglePassword();
    const {
        ref: confirmPasswordRef,
        onToggle: onConfirmPasswordToggle,
        hidden: confirmPasswordHidden,
    } = useTogglePassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setFocus,
    } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
    });
    useFocusFirstInput(errors, setFocus);
    const { ref: refPasswordFormHook, ...registerPassword } =
        register('password');
    const { ref: refConfirmPasswordFormHook, ...registerConfirmPassword } =
        register('confirmPassword');
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: IFormInputs) => {
        try {
            setLoading(true);
            await axios
                .post<
                    IRes<{
                        user: IUser;
                    }>
                >(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
                    ...data,
                    avatar: '/noavatar.jpg',
                })
                .then((value) => value.data.data);
            toast.success('Register successfully. ');
            router.push(ROUTES.LOGIN);
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('auth')}>
            <div className="app-container flex items-center justify-center">
                <div className={cx('auth-content')}>
                    <h3 className={cx('title')}>Register</h3>
                    <form
                        className="flex gap-6 flex-col"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex gap-6">
                            <div className="input-group w-full">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className={`form-input ${
                                        errors.firstName?.message && 'error'
                                    }`}
                                    {...register('firstName')}
                                    autoFocus
                                />
                                {errors.firstName?.message && (
                                    <p className="form-error">
                                        {errors.firstName?.message}
                                    </p>
                                )}
                            </div>
                            <div className="input-group w-full">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className={`form-input ${
                                        errors.lastName?.message && 'error'
                                    }`}
                                    {...register('lastName')}
                                />
                                {errors.lastName?.message && (
                                    <p className="form-error">
                                        {errors.lastName?.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                placeholder="Username"
                                className={`form-input ${
                                    errors.username?.message && 'error'
                                }`}
                                {...register('username')}
                            />
                            {errors.username?.message && (
                                <p className="form-error">
                                    {errors.username?.message}
                                </p>
                            )}
                        </div>
                        <div className="input-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                className={`form-input ${
                                    errors.email?.message && 'error'
                                }`}
                                {...register('email')}
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
                                    hidden={passwordHidden}
                                    onToggle={onPasswordToggle}
                                    isError={!!errors.password?.message}
                                />
                            </div>
                            {errors.password?.message && (
                                <p className="form-error">
                                    {errors.password?.message}
                                </p>
                            )}
                        </div>
                        <div className="input-group">
                            <label className="form-label">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={`form-input ${
                                        errors.confirmPassword?.message &&
                                        'error'
                                    }`}
                                    ref={(e) => {
                                        confirmPasswordRef.current = e;
                                        refConfirmPasswordFormHook(e);
                                    }}
                                    {...registerConfirmPassword}
                                />
                                <ButtonTogglePassword
                                    hidden={confirmPasswordHidden}
                                    onToggle={onConfirmPasswordToggle}
                                    isError={!!errors.confirmPassword?.message}
                                />
                            </div>
                            {errors.confirmPassword?.message && (
                                <p className="form-error">
                                    {errors.confirmPassword?.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            loading={loading}
                            disabled={loading}
                            className={cx('btn')}
                            typeButton="primary"
                        >
                            Register
                        </Button>
                    </form>
                    <div className="mt-6 text-center ">
                        <p>
                            Already have account?{' '}
                            <Link href={ROUTES.LOGIN}>
                                <a className="link">Login</a>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

Register.getLayout = function getLayout(page: ReactElement) {
    return <DefaultLayout>{page}</DefaultLayout>;
};

export default Register;

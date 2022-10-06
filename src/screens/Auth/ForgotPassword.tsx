import { useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import axios from '@/axios';
import { Button, Logo } from '@/components';
import { ROUTES } from '@/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { AiOutlineLock } from 'react-icons/ai';
import * as yup from 'yup';

import styles from './Auth.module.scss';

const cx = classNames.bind(styles);

type IFormInputs = {
    email: string;
};

const schema = yup.object({
    email: yup
        .string()
        .email('Invalid email.')
        .required('This email is require.'),
});

const ForgotPassword = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
    });
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: IFormInputs) => {
        try {
            setLoading(true);
            const res = await axios.post('/forgot-password', {
                email: data.email,
            });

            toast.success(
                'Sent message successfully. Please check your email.',
            );
            console.log(res);
            setLoading(false);
            reset();
        } catch (error: any) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Tiktok - Forgot Password</title>
            </Head>
            <div>
                <header className="h-header  flex items-center bg-white shadow-header">
                    <div className="app-container">
                        <Logo />
                    </div>
                </header>
                <div className={cx('auth')}>
                    <div className="app-container flex items-center justify-center">
                        <div>
                            <div className={cx('auth-content')}>
                                <div className="flex flex-col text-center  items-center">
                                    <AiOutlineLock className="w-24 h-24 mb-6 " />
                                    <h3 className="font-semibold mb-4">
                                        Trouble Logging In?
                                    </h3>
                                    <p className="text-neutral-500 font-medium">
                                        Enter your email and we&lsquo;ll send
                                        you a link to reset your password .
                                    </p>
                                    <form
                                        className="w-full mt-6 space-y-4"
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <div className="input-group">
                                            <label className="form-label text-start">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                className={`form-input ${
                                                    errors.email?.message &&
                                                    'error'
                                                }`}
                                                {...register('email')}
                                                autoFocus
                                            />
                                            {errors.email?.message && (
                                                <p className="form-error text-start">
                                                    {errors.email?.message}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            className={cx('btn', 'w-full')}
                                            loading={loading}
                                            disabled={loading}
                                            type="submit"
                                            typeButton="primary"
                                        >
                                            Send link reset
                                        </Button>
                                    </form>
                                </div>
                            </div>
                            <div className="w-full mt-6 flex items-center justify-center">
                                <Button
                                    className="w-full py-2 bg-slate-200"
                                    onClick={() => {
                                        router.push(ROUTES.LOGIN);
                                    }}
                                    typeButton=""
                                >
                                    Back to login
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;

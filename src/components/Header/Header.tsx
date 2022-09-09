import { useCallback } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { Button, Logo } from '@/components';
import { ROUTES } from '@/constants';
import { selectUser } from '@/features/user';
import { useAppSelector } from '@/hooks';
import { toast } from 'react-hot-toast';
import { AiOutlinePlus } from 'react-icons/ai';
import { FiMenu } from 'react-icons/fi';

const Header = () => {
    const user = useAppSelector(selectUser);
    const router = useRouter();

    const navigateToUpload = useCallback(() => {
        if (!user) {
            toast.error('Please login to upload.');
            return;
        }
        router.push(ROUTES.UPLOAD);
    }, [router, user]);

    return (
        <header className="flex items-center h-header bg-white shadow-header">
            <div className="app-container">
                <nav className="flex items-center gap-4 justify-between">
                    <Logo />
                    <div className="hidden sm:flex items-center gap-4">
                        <Button
                            typeButton="tertiary"
                            iconLeft={<AiOutlinePlus className="icon-20" />}
                            onClick={navigateToUpload}
                        >
                            <span>Upload</span>
                        </Button>
                        {user ? (
                            <div>
                                <Image
                                    src={user.avatar}
                                    alt={user.username}
                                    width={40}
                                    height={40}
                                />
                            </div>
                        ) : (
                            <Button
                                typeButton="primary"
                                onClick={() => {
                                    router.push(ROUTES.LOGIN);
                                }}
                            >
                                <span>Login</span>
                            </Button>
                        )}
                    </div>
                    <button className="block sm:hidden">
                        <FiMenu className="w-8 h-8" />
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;

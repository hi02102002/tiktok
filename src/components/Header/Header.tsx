import { useCallback, useState } from 'react';

import { useRouter } from 'next/router';

import { Avatar, Button, Logo } from '@/components';
import { ROUTES } from '@/constants';
import { selectUser } from '@/features/user';
import { useAppSelector } from '@/hooks';
import Tippy from '@tippyjs/react/headless';
import { toast } from 'react-hot-toast';
import { AiOutlinePlus } from 'react-icons/ai';

import Dropdown from './Dropdown';
import Search from './Search';

const Header = () => {
    const user = useAppSelector(selectUser);
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const navigateToUpload = useCallback(() => {
        if (!user) {
            toast.error('Please login to upload.');
            return;
        }
        router.push(ROUTES.UPLOAD);
    }, [router, user]);

    return (
        <header className="flex items-center h-header bg-white shadow-header ">
            <div className="app-container">
                <nav className="flex items-center gap-4 justify-between">
                    <Logo />
                    <Search />
                    <div className="flex items-center gap-4">
                        <Button
                            typeButton="tertiary"
                            iconLeft={<AiOutlinePlus className="icon-20" />}
                            onClick={navigateToUpload}
                        >
                            <span>Upload</span>
                        </Button>
                        {user ? (
                            <Tippy
                                interactive
                                render={(attrs) => {
                                    return (
                                        <div {...attrs}>
                                            <Dropdown
                                                onClose={() =>
                                                    setShowDropdown(false)
                                                }
                                            />
                                        </div>
                                    );
                                }}
                                visible={showDropdown}
                                onClickOutside={() => {
                                    setShowDropdown(false);
                                }}
                                placement="bottom"
                            >
                                <div
                                    onClick={() => {
                                        setShowDropdown(!showDropdown);
                                    }}
                                >
                                    <Avatar
                                        src={user.avatar as string}
                                        alt={user.username}
                                        size={40}
                                        className="cursor-pointer"
                                    />
                                </div>
                            </Tippy>
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
                </nav>
            </div>
        </header>
    );
};

export default Header;

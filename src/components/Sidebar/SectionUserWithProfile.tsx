import { useMemo } from 'react';

import { Avatar, Button, SectionUser } from '@/components';
import { selectUser } from '@/features/user';
import { useAppSelector } from '@/hooks';
import { IUser } from '@/types';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

interface Props {
    user: IUser;
}

const BriefProfile = ({ user }: Props) => {
    const currentUser = useAppSelector(selectUser);
    const isFollowing = useMemo(() => {
        return user.followers.includes(currentUser?._id as string);
    }, [currentUser?._id, user]);
    return (
        <div className="w-80 rounded-lg bg-white shadow p-5 ">
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <Avatar src={user.avatar} alt={user.username} size={44} />
                    <Button
                        type="button"
                        typeButton={isFollowing ? 'tertiary' : 'primary'}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">
                        {user.firstName} {user.lastName}
                    </h3>
                    <span className="text-sm text-subtext">
                        {user.username}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <span className="text-lg font-bold">
                            {user.numFollow}
                        </span>
                        <span className="text-lg font-semibold text-subtext">
                            Followers
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-lg font-bold">
                            {user.numLike}
                        </span>
                        <span className="text-lg font-semibold text-subtext">
                            Likes
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SectionUserWithProfile = ({ user }: Props) => {
    return (
        <div>
            <Tippy
                render={(attrs) => {
                    return (
                        <div {...attrs} tabIndex={-1}>
                            <BriefProfile user={user} />
                        </div>
                    );
                }}
                interactive
                delay={800}
                placement="bottom"
            >
                <div>
                    <SectionUser user={user} className={cx('account')} />
                </div>
            </Tippy>
        </div>
    );
};

export default SectionUserWithProfile;

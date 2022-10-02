import { useEffect, useState } from 'react';

import { useWindowSize } from '@/hooks';
import usersServices from '@/services/users.services';
import { IUser } from '@/types';
import classNames from 'classnames/bind';

import Line from '../Line';
import SectionUser from '../SectionUser';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

const LIMIT = 10;

const FollowingAccounts = () => {
    const [followingAccounts, setFollowingAccounts] = useState<Array<IUser>>(
        [],
    );
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const sizeWindow = useWindowSize();

    const handleSeeMore = () => {
        setPage(page + 1);
    };

    useEffect(() => {
        (async () => {
            const _followingAccounts = await usersServices.getFollowingAccounts(
                page,
                LIMIT,
            );
            if (_followingAccounts.length < LIMIT) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
            setFollowingAccounts((prev) => [...prev, ..._followingAccounts]);
        })();
    }, [page]);

    return sizeWindow.width < 1024 && followingAccounts.length === 0 ? null : (
        <>
            <Line />
            <div className={cx('list-accounts')}>
                <span className={cx('title')}>Following accounts</span>
                {followingAccounts.length === 0 ? (
                    <span className="block text-center text-subtext font-medium">
                        No account following.
                    </span>
                ) : (
                    <>
                        <ul>
                            {followingAccounts.map((account) => {
                                return (
                                    <li key={account._id}>
                                        <SectionUser
                                            user={account}
                                            className={cx('account')}
                                            classNameInfo={cx('info')}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                        {hasMore && (
                            <button
                                className={cx('btn-see')}
                                onClick={handleSeeMore}
                            >
                                See more
                            </button>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default FollowingAccounts;

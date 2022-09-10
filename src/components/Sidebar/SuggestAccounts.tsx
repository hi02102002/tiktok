import { useEffect, useState } from 'react';

import { selectUser } from '@/features/user';
import { useAppSelector } from '@/hooks';
import usersServices from '@/services/users.services';
import { IUser } from '@/types';

import SectionUserWithProfile from './SectionUserWithProfile';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

const LIMIT = 10;

const cx = classNames.bind(styles);

const SuggestAccounts = () => {
    const [suggestAccounts, setSuggestAccounts] = useState<Array<IUser>>([]);
    const user = useAppSelector(selectUser);
    const [isSeeMore, setIsSeeMore] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const handleToggleSee = () => {
        setIsSeeMore(!isSeeMore);
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const _users = await usersServices.getSuggestAccounts(
                    user?._id as string,
                );
                if (_users.length < LIMIT) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
                setSuggestAccounts(_users);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    return (
        <div className={cx('list-accounts')}>
            <span className={cx('title')}>Suggested accounts</span>
            <ul>
                {isSeeMore
                    ? suggestAccounts.slice(0, LIMIT).map((account) => {
                          return (
                              <li key={account._id}>
                                  <SectionUserWithProfile user={account} />
                              </li>
                          );
                      })
                    : suggestAccounts.map((account) => {
                          return (
                              <li key={account._id}>
                                  <SectionUserWithProfile user={account} />
                              </li>
                          );
                      })}
            </ul>
            {hasMore && (
                <button className={cx('btn-see')} onClick={handleToggleSee}>
                    {isSeeMore ? ' See more' : 'See less'}
                </button>
            )}
        </div>
    );
};

export default SuggestAccounts;

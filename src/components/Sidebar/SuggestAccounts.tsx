import { useEffect, useState } from 'react';

import { selectUser } from '@/features/user';
import { useAppDispatch, useAppSelector } from '@/hooks';
import usersServices from '@/services/users.services';
import { IUser } from '@/types';
import classNames from 'classnames/bind';

import SectionUserWithProfile from './SectionUserWithProfile';
import styles from './Sidebar.module.scss';

const LIMIT = 10;

const cx = classNames.bind(styles);

const SuggestAccounts = () => {
    const user = useAppSelector(selectUser);
    const [isSeeMore, setIsSeeMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [suggestAccounts, setSuggestAccounts] = useState<Array<IUser>>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const handleToggleSee = () => {
        setIsSeeMore(!isSeeMore);
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const resSuggestAccounts =
                    await usersServices.getSuggestAccounts(user?._id as string);

                if (resSuggestAccounts.length >= LIMIT) {
                    setHasMore(true);
                } else {
                    setHasMore(false);
                }
                setSuggestAccounts(resSuggestAccounts);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [user?._id, dispatch]);

    return (
        <div className={cx('list-accounts')}>
            <span className={cx('title')}>Suggested accounts</span>
            <ul>
                {isSeeMore
                    ? suggestAccounts.slice(0, LIMIT).map((account) => {
                          return (
                              <li key={account._id}>
                                  <SectionUserWithProfile
                                      user={account}
                                      setAccounts={setSuggestAccounts}
                                  />
                              </li>
                          );
                      })
                    : suggestAccounts.map((account) => {
                          return (
                              <li key={account._id}>
                                  <SectionUserWithProfile
                                      user={account}
                                      setAccounts={setSuggestAccounts}
                                  />
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

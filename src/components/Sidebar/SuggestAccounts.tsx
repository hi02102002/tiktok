import { useEffect, useState } from 'react';

import { selectUser } from '@/features/user';
import { useAppDispatch, useAppSelector, useWindowSize } from '@/hooks';
import usersServices from '@/services/users.services';
import { IUser } from '@/types';
import classNames from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';

import Line from '../Line';
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
    const sizeWindow = useWindowSize();
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

    return sizeWindow.width < 1024 && suggestAccounts.length === 0 ? null : (
        <>
            <Line />
            <div className={cx('list-accounts')}>
                <span className={cx('title')}>Suggested accounts</span>
                {loading ? (
                    <Skeleton height={48} className="rounded" count={3} />
                ) : suggestAccounts.length === 0 ? (
                    <span className="hidden lg:block text-center text-subtext font-medium">
                        No account suggested.
                    </span>
                ) : (
                    <>
                        <ul>
                            {isSeeMore
                                ? suggestAccounts
                                      .slice(0, LIMIT)
                                      .map((account) => {
                                          return (
                                              <li key={account._id}>
                                                  <SectionUserWithProfile
                                                      user={account}
                                                      setAccounts={
                                                          setSuggestAccounts
                                                      }
                                                  />
                                              </li>
                                          );
                                      })
                                : suggestAccounts.map((account) => {
                                      return (
                                          <li key={account._id}>
                                              <SectionUserWithProfile
                                                  user={account}
                                                  setAccounts={
                                                      setSuggestAccounts
                                                  }
                                              />
                                          </li>
                                      );
                                  })}
                        </ul>
                        {hasMore && (
                            <button
                                className={cx('btn-see')}
                                onClick={handleToggleSee}
                            >
                                {isSeeMore ? ' See more' : 'See less'}
                            </button>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default SuggestAccounts;

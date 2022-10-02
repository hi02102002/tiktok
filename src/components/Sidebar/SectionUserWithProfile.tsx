import { Dispatch, SetStateAction, useCallback } from 'react';

import { BriefProfile, SectionUser } from '@/components';
import { IUser, TypeFollow, onFollow } from '@/types';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

interface Props {
    user: IUser;
    setAccounts: Dispatch<SetStateAction<IUser[]>>;
}

const SectionUserWithProfile = ({ user, setAccounts }: Props) => {
    const handelFollow: onFollow = useCallback(
        (type, userId, receiverId) => {
            console.log('hi');
            setAccounts((accountsState) => {
                return accountsState.map((account) => {
                    if (account._id === receiverId) {
                        return {
                            ...account,
                            followers:
                                type === TypeFollow.FOLLOW
                                    ? account.followers.concat(userId)
                                    : account.followers.filter(
                                          (follower) => follower !== userId,
                                      ),
                        };
                    }
                    return account;
                });
            });
        },
        [setAccounts],
    );

    return (
        <div>
            <Tippy
                render={(attrs) => {
                    return (
                        <div {...attrs} tabIndex={-1}>
                            <BriefProfile user={user} onFollow={handelFollow} />
                        </div>
                    );
                }}
                interactive
                delay={800}
                placement="bottom"
                popperOptions={{
                    strategy: 'fixed',
                }}
            >
                <div>
                    <SectionUser
                        classNameInfo={cx('info')}
                        user={user}
                        className={cx('account')}
                    />
                </div>
            </Tippy>
        </div>
    );
};

export default SectionUserWithProfile;

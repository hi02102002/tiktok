import Link from 'next/link';

import { IUser } from '@/types';

import Avatar from '../Avatar';

interface Props {
    user: IUser;
    sizeAvatar?: number;
}
const SectionUser = ({ user, sizeAvatar = 32 }: Props) => {
    return (
        <Link href={`/user/${user.username}`}>
            <a>
                <div className="flex items-center gap-3 py-2 px-4 rounded hover:bg-neutral-100 transition-all cursor-pointer">
                    <Avatar
                        src={user.avatar}
                        alt={user.username}
                        size={sizeAvatar}
                    />
                    <div className="flex flex-col">
                        <h3 className="font-semibold">
                            {user.firstName} {user.lastName}
                        </h3>
                        <span className="text-xs text-neutral-300">
                            {user.username}
                        </span>
                    </div>
                </div>
            </a>
        </Link>
    );
};

export default SectionUser;

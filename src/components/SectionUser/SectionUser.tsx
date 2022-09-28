import Link from 'next/link';

import { Avatar } from '@/components';
import { IUser } from '@/types';

interface Props {
    user: IUser;
    sizeAvatar?: number;
    className?: string;
    classNameInfo?: string;
    classNameAvatar?: string;
}
const SectionUser = ({
    user,
    sizeAvatar = 32,
    className = '',
    classNameInfo = '',
    classNameAvatar = '',
}: Props) => {
    return (
        <Link href={`/user/${user.username}`}>
            <a>
                <div
                    className={`flex items-center gap-3 py-2 px-4 rounded hover:bg-neutral-100 transition-all cursor-pointer ${className}`}
                >
                    <Avatar
                        src={user.avatar}
                        alt={user.username}
                        size={sizeAvatar}
                        className={`${classNameAvatar} flex-shrink-0`}
                    />
                    <div className={`flex flex-col info ${classNameInfo}`}>
                        <h3 className="font-semibold name !leading-[1]">
                            {user.firstName} {user.lastName}
                        </h3>
                        <span className="text-xs text-neutral-500">
                            {user.username}
                        </span>
                    </div>
                </div>
            </a>
        </Link>
    );
};

export default SectionUser;

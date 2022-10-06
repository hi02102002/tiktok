import Link from 'next/link';

import { ROUTES } from '@/constants';
import { selectUser } from '@/features/user';
import { useAppSelector } from '@/hooks';
import { signOut } from 'next-auth/react';
import {
    AiOutlineLogout,
    AiOutlineUser,
    AiOutlineUsergroupAdd,
} from 'react-icons/ai';
import { RiSettings3Line } from 'react-icons/ri';

import Line from '../Line';

const classNameItem =
    'flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 transition-all w-full';

interface Props {
    onClose: () => void;
}

const Dropdown = ({ onClose }: Props) => {
    const currentUser = useAppSelector(selectUser);
    return (
        <div className="py-2 rounded bg-white shadow w-44">
            <ul>
                <li onClick={onClose}>
                    <Link href={`/user/${currentUser?._id}`}>
                        <a>
                            <button className={`${classNameItem}`}>
                                <AiOutlineUser className="icon-20" />
                                <span>View Profile </span>
                            </button>
                        </a>
                    </Link>
                </li>
                <li className="md:hidden" onClick={onClose}>
                    <Link href={ROUTES.FOLLOWING}>
                        <a>
                            <button className={`${classNameItem}`}>
                                <AiOutlineUsergroupAdd className="icon-20" />
                                <span>Following </span>
                            </button>
                        </a>
                    </Link>
                </li>
                <li onClick={onClose}>
                    <a>
                        <button className={`${classNameItem}`}>
                            <RiSettings3Line className="icon-20" />
                            <span>Setting</span>
                        </button>
                    </a>
                </li>
            </ul>
            <Line />
            <button
                className={`${classNameItem}`}
                onClick={() => {
                    signOut();
                    onClose();
                }}
            >
                <AiOutlineLogout className="icon-20" />
                <span>Logout</span>
            </button>
        </div>
    );
};

export default Dropdown;

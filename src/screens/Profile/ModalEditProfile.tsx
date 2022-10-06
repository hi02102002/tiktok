import { useCallback, useMemo, useRef, useState } from 'react';

import { Avatar, Button, Line, Modal } from '@/components';
import { selectUser, updateUser } from '@/features/user';
import { useAppDispatch, useAppSelector } from '@/hooks';
import uploadServices from '@/services/upload.services';
import usersServices from '@/services/users.services';
import { IUser } from '@/types';
import { toast } from 'react-hot-toast';
import { FiEdit } from 'react-icons/fi';
import { IoCloseSharp } from 'react-icons/io5';

interface Props {
    onClose: () => void;
}

const ModalEditProfile = ({ onClose }: Props) => {
    const user = useAppSelector(selectUser) as IUser;
    const [loading, setLoading] = useState<boolean>(false);

    const [info, setInfo] = useState<{
        username: string;
        firstName: string;
        lastName: string;
        bio: string;
        avatar: File | null;
    }>({
        bio: user.bio,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        avatar: null,
    });

    const inputAvatarRef = useRef<HTMLInputElement | null>(null);

    const disabled = useMemo(() => {
        return (
            info.username.trim().length === 0 ||
            info.firstName.trim().length === 0 ||
            info.lastName.trim().length === 0 ||
            (info.username.trim() === user.username &&
                info.firstName.trim() === user.firstName &&
                info.lastName.trim() === user.lastName &&
                info.avatar === null &&
                user.bio === info.bio.trim()) ||
            loading
        );
    }, [info, user, loading]);

    const dispatch = useAppDispatch();

    const handleChange = (e: any) => {
        setInfo((prevState) => {
            return {
                ...prevState,
                [e.target.name]: e.target.value,
            };
        });
    };

    const handleEdit = useCallback(async () => {
        try {
            setLoading(true);
            const url = info.avatar
                ? (await uploadServices.upload([info.avatar as File]))[0].url
                : user.avatar;
            const userUpdated = await usersServices.updateUser(user._id, {
                ...info,
                avatar: url,
            });
            dispatch(updateUser(userUpdated));
            setLoading(false);
            toast.success('Updated profile successfully.');
            onClose();
        } catch (error: any) {
            let message = 'Something went wrong. Try again';
            if (error.response.status === 409) {
                message =
                    'This username has already exist. Try another username.';
            }
            toast.error(message);
            setLoading(false);
        }
    }, [dispatch, info, user._id, user.avatar, onClose]);

    return (
        <Modal onClose={onClose}>
            <div className="rounded shadow bg-white">
                <div className="flex items-center justify-between p-4">
                    <h3 className="text-lg font-medium">Edit profile</h3>
                    <button onClick={onClose}>
                        <IoCloseSharp className="icon-24" />
                    </button>
                </div>
                <Line />
                <div className="p-6 flex flex-col w-full gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-32 flex-shrink-0 ">
                            <label className="form-label">Profile photo</label>
                        </div>
                        <div className="flex items-center justify-center flex-1">
                            <div
                                className="relative cursor-pointer"
                                onClick={() => {
                                    inputAvatarRef.current?.click();
                                }}
                            >
                                <Avatar
                                    src={
                                        info.avatar
                                            ? URL.createObjectURL(info.avatar)
                                            : user.avatar
                                    }
                                    alt={user?.username as string}
                                    size={96}
                                />
                                <button className="w-8 h-8 flex items-center justify-center bg-white absolute -right-1 bottom-1 rounded-full border border-neutral-400">
                                    <FiEdit className="icon-16 " />
                                </button>
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    className="hidden"
                                    ref={inputAvatarRef}
                                    onChange={(e) => {
                                        setInfo((prevState) => {
                                            const file = e.target.files?.[0];
                                            console.log(file);
                                            if (file) {
                                                return {
                                                    ...prevState,
                                                    avatar: file,
                                                };
                                            }
                                            return prevState;
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-32 flex-shrink-0 ">
                            <label className="form-label">User name</label>
                        </div>
                        <div className="flex-1 w-full flex flex-col gap-2">
                            <input
                                className="form-input"
                                placeholder="Username"
                                value={info.username}
                                name="username"
                                onChange={handleChange}
                            />
                            <p className="text-subtext text-xs">
                                <span className="break-all">
                                    www.tiktok.com/@{info.username}
                                </span>
                                <br />
                                Usernames can only contain letters, numbers,
                                underscores, and periods. Changing your username
                                will also change your profile link.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-32 flex-shrink-0 ">
                            <label className="form-label">First Name</label>
                        </div>
                        <div className="flex-1 w-full flex flex-col gap-2">
                            <input
                                className="form-input"
                                placeholder="First Name"
                                value={info.firstName}
                                name="firstName"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-32 flex-shrink-0 ">
                            <label className="form-label">Last Name</label>
                        </div>
                        <div className="flex-1 w-full flex flex-col gap-2">
                            <input
                                className="form-input"
                                placeholder="Last Name"
                                value={info.lastName}
                                name="lastName"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-32 flex-shrink-0 ">
                            <label className="form-label">Bio</label>
                        </div>
                        <div className="flex-1 w-full flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <textarea
                                    className="form-input resize-none h-28"
                                    placeholder="Bio"
                                    maxLength={80}
                                    value={info.bio}
                                    name="bio"
                                    onChange={handleChange}
                                />
                                <p className="text-subtext text-xs">
                                    {info.bio.length} / 80
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Line />
                <div className="p-4">
                    <div className="flex items-center justify-end gap-4">
                        <Button typeButton="tertiary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            typeButton="primary"
                            disabled={disabled}
                            loading={loading}
                            onClick={handleEdit}
                        >
                            Save changes
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ModalEditProfile;

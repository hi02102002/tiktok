import { Avatar, ButtonFollow } from '@/components';
import { selectUser } from '@/features/user';
import { useAppSelector } from '@/hooks';
import { IUser, onFollow } from '@/types';

interface Props {
    user: IUser;
    onFollow?: onFollow;
}

const BriefProfile = ({ user, onFollow }: Props) => {
    const currentUser = useAppSelector(selectUser);
    return (
        <div className="w-80 rounded-lg bg-white shadow p-5 ">
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <Avatar src={user.avatar} alt={user.username} size={44} />
                    {!(currentUser?._id === user._id) && (
                        <ButtonFollow
                            followers={user.followers}
                            receiverId={user._id}
                            onFollow={onFollow}
                        />
                    )}
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
                            {user.followers.length}
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

export default BriefProfile;

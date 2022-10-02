export const linkToProfile = (currentUserId: string, userId: string) => {
    return `/user/${currentUserId === userId ? 'me' : userId}`;
};

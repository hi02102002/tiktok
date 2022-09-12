import { cancelToken } from '@/axios';

export const handleCancelRequest = () => {
    cancelToken.cancel('Request was canceled');
};

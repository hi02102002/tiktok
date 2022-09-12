import axiosClient from '@/axios';
import { IFile, IRes } from '@/types';

class UploadService {
    public async upload(files: Array<File>): Promise<Array<IFile>> {
        const formData = new FormData();

        for (let file of files) {
            formData.append('file', file);
        }

        const urls = await axiosClient
            .post<
                IRes<{
                    urls: Array<IFile>;
                }>
            >('/upload', formData)
            .then((value) => value.data.data.urls);
        return urls;
    }
}

export default new UploadService();

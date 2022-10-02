import { useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { Button } from '@/components';
import { LayOutOnlyHeader } from '@/components/Layout';
import { Select } from '@/components/Select';
import { createPost } from '@/features/post';
import { useAppDispatch } from '@/hooks';
import postServices from '@/services/post.services';
import uploadServices from '@/services/upload.services';
import { NextPageWithLayout } from '@/types';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { Video } from 'video-metadata-thumbnails';
import { IThumbnail } from 'video-metadata-thumbnails/lib/video/ithumbnail';

const TYPES: Array<{
    label: string;
    value: string;
}> = [
    { label: 'Public', value: 'PUBLIC' },
    {
        label: 'Private',
        value: 'PRIVATE',
    },
];

const Upload: NextPageWithLayout = () => {
    const dispatch = useAppDispatch();
    const [caption, setCaption] = useState<string>('');
    const [allowComment, setAllowComment] = useState<boolean>(true);
    const [type, setType] = useState<{
        label: string;
        value: string;
    }>(TYPES[0]);
    const [video, setVideo] = useState<File | null>(null);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const onDrop = useCallback((acceptedFiles: Array<File>) => {
        setVideo(acceptedFiles[0]);
    }, []);
    const [videoSize, setVideoSize] = useState<{
        width: number;
        height: number;
    }>({
        width: 0,
        height: 0,
    });
    const [previewImages, setPreviewImages] = useState<Array<IThumbnail>>([]);
    const [chooseThumb, setChooseThumb] = useState<IThumbnail | null>(null);

    const $videoRef = useRef<HTMLVideoElement | null>(null);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {
            'video/mp4': ['.mp4'],
        },
        onDrop,
    });
    const router = useRouter();

    const handleDiscard = useCallback(() => {
        setCaption('');
        setAllowComment(true);
        setType(TYPES[0]);
        setVideo(null);
        setVideoSize({
            height: 0,
            width: 0,
        });
        setPreviewImages([]);
        setChooseThumb(null);
    }, []);

    const handelUpload = useCallback(async () => {
        let toastId;
        try {
            setLoadingUpload(true);
            toastId = toast.loading('Uploading...');
            const urls = await uploadServices.upload([
                video as File,
                chooseThumb?.blob as File,
            ]);

            const _postRes = await postServices.addPost({
                allowComment,
                caption,
                video: {
                    ...urls[0],
                },
                width: videoSize.width,
                height: videoSize.height,
                type: type.value,
                cover: {
                    ...urls[1],
                },
            });
            dispatch(createPost(_postRes));
            toast.success('Create post successfully.');
            handleDiscard();
            router.push(`/${_postRes._id}`);
        } catch (error: any) {
            console.log(error);
            toast.error('Something went wrong while create post.');
            toast.dismiss(toastId);
        } finally {
            setLoadingUpload(false);
            toast.dismiss(toastId);
        }
    }, [
        allowComment,
        caption,
        dispatch,
        handleDiscard,
        video,
        videoSize,
        type.value,
        chooseThumb?.blob,
        router,
    ]);

    useEffect(() => {
        $videoRef.current?.addEventListener('loadedmetadata', function () {
            setVideoSize({
                width: this.videoWidth,
                height: this.videoHeight,
            });
        });
    }, [video]);

    useEffect(() => {
        if (video) {
            const videoThumbs = new Video(video as Blob);

            (async () => {
                const thumbs = await videoThumbs.getThumbnails({
                    quality: 1,
                    start: 0,
                    end: 5,
                });
                setPreviewImages(thumbs);
            })();
        }
    }, [video]);

    return (
        <div className="flex-1 bg-neutral-100 flex ">
            <div className="app-container flex">
                <div className="py-4 flex w-full">
                    <div className="max-w-[1100px] w-full mx-auto bg-white shadow rounded-lg py-6 md:px-14 px-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold">
                                Upload Video
                            </h2>
                            <span className="text-subtext inline-block">
                                Post a video to your account
                            </span>
                        </div>
                        <div className="mt-6 flex gap-6 md:flex-row flex-col">
                            {video ? (
                                <div className="flex items-center justify-center">
                                    <video
                                        width="289"
                                        className="rounded mx-auto"
                                        autoPlay
                                        controls
                                        ref={$videoRef}
                                    >
                                        <source
                                            src={URL.createObjectURL(video)}
                                        />
                                    </video>
                                </div>
                            ) : (
                                <div
                                    {...getRootProps({
                                        className:
                                            'dropzone px-9 py-14 rounded-lg border-2 border-dashed border-neutral-300 hover:border-primary hover:bg-neutral-100/40 flex flex-col items-center cursor-pointer self-center',
                                    })}
                                >
                                    <input
                                        {...getInputProps({
                                            multiple: false,
                                        })}
                                    />
                                    <AiOutlineCloudUpload className="w-10 h-10 text-subtext " />
                                    <span className="text-lg font-semibold">
                                        Select video to upload
                                    </span>
                                    <span className="text-sm block mt-2 text-subtext">
                                        Select video to upload
                                    </span>
                                    <div className="flex flex-col gap-2 items-center mt-6 text-subtext">
                                        <span>MP4 or WebM </span>
                                        <span>
                                            720x1280 resolution or higher{' '}
                                        </span>
                                        <span>Up to 10 minutes</span>
                                        <span>Less than 2 GB</span>
                                    </div>
                                    <Button
                                        typeButton="primary"
                                        className="mt-8"
                                    >
                                        Select File
                                    </Button>
                                </div>
                            )}
                            <div className="flex-1 w-full ">
                                <div className="flex flex-col gap-6">
                                    <div className="input-group">
                                        <div className="flex items-center justify-between">
                                            <label className="form-label ">
                                                Caption
                                            </label>
                                            <span className=" text-subtext font-semibold">
                                                {caption.length} / 150
                                            </span>
                                        </div>
                                        <input
                                            onChange={(e) => {
                                                setCaption(e.target.value);
                                            }}
                                            type="text"
                                            className="form-input"
                                            maxLength={150}
                                            value={caption}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="form-label">
                                            Cover
                                        </label>
                                        <div className="p-4 rounded border-[#cbd5e1] border-2">
                                            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap ">
                                                {previewImages.length > 0 ? (
                                                    previewImages.map((el) => {
                                                        return (
                                                            <div
                                                                key={
                                                                    el.currentTime
                                                                }
                                                                onClick={() => {
                                                                    setChooseThumb(
                                                                        el,
                                                                    );
                                                                }}
                                                                className="relative flex items-center justify-center cursor-pointer"
                                                            >
                                                                {!(
                                                                    el.currentTime ===
                                                                    chooseThumb?.currentTime
                                                                ) && (
                                                                    <div
                                                                        className={`absolute w-full h-full z-10 bg-white/60`}
                                                                    ></div>
                                                                )}
                                                                <Image
                                                                    src={URL.createObjectURL(
                                                                        el.blob as Blob,
                                                                    )}
                                                                    alt=""
                                                                    width={84.2}
                                                                    height={150}
                                                                    objectFit="cover"
                                                                    className="rounded relative z-[9]"
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="w-[84.2px] h-[150px] rounded bg-neutral-200"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label className="form-label">
                                            Allow users to:
                                        </label>
                                        <div className="inline-flex items-center gap-2 ">
                                            <input
                                                type="checkbox"
                                                className="accent-primary w-4 h-4"
                                                id="allowComment"
                                                onChange={(e) => {
                                                    setAllowComment(
                                                        e.target.checked,
                                                    );
                                                }}
                                                checked={allowComment}
                                            />
                                            <label
                                                htmlFor="allowComment"
                                                className="form-label select-none cursor-pointer"
                                            >
                                                Allow comments
                                            </label>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label className="form-label">
                                            Who can view this video
                                        </label>
                                        <Select
                                            value={type}
                                            options={TYPES}
                                            onChangeValue={(value) => {
                                                setType(value);
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <Button
                                            typeButton="tertiary"
                                            onClick={handleDiscard}
                                        >
                                            Discard
                                        </Button>
                                        <Button
                                            typeButton="primary"
                                            disabled={
                                                acceptedFiles.length === 0 ||
                                                caption.length === 0 ||
                                                loadingUpload ||
                                                !chooseThumb
                                            }
                                            loading={loadingUpload}
                                            onClick={handelUpload}
                                        >
                                            Upload
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Upload.getLayout = function (page) {
    return <LayOutOnlyHeader>{page}</LayOutOnlyHeader>;
};

export default Upload;

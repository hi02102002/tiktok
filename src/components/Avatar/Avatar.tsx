import Image, { ImageProps } from 'next/image';

interface Props extends ImageProps {
    size: number;
}

const Avatar = ({
    src,
    alt,
    size,
    width,
    height,
    className = '',
    objectFit = 'cover',
    ...rest
}: Props) => {
    return (
        <Image
            src={src || '/noavatar.jpg'}
            alt={alt}
            width={size}
            height={size}
            className={`rounded-full ${className} flex-shrink-0`}
            objectFit={objectFit}
            {...rest}
        />
    );
};

export default Avatar;

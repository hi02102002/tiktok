import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface Props {
    onToggle: () => void;
    hidden: boolean;
    isError?: boolean;
}

const ButtonTogglePassword = ({ hidden, onToggle, isError }: Props) => {
    return (
        <button
            type="button"
            className="absolute right-4 top-[50%] translate-y-[-50%]"
            onClick={onToggle}
            tabIndex={-1}
        >
            {hidden ? (
                <AiOutlineEye
                    className={`icon-20 ${isError && 'text-red-500'}`}
                />
            ) : (
                <AiOutlineEyeInvisible
                    className={`icon-20 ${isError && 'text-red-500'}`}
                />
            )}
        </button>
    );
};

export default ButtonTogglePassword;

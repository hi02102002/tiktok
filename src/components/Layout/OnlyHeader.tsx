import { Header } from '@/components';

interface Props {
    children: React.ReactNode;
}

const OnlyHeader = ({ children }: Props) => {
    return (
        <>
            <div className="fixed left-0 right-0 top-0 z-[100]">
                <Header />
            </div>
            <div className="mt-header min-h-[calc(100vh_-_60px)] flex flex-col">
                {children}
            </div>
        </>
    );
};

export default OnlyHeader;

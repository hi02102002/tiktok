import { Header } from '@/components';

interface Props {
    children: React.ReactNode;
}

const DefaultLayout = ({ children }: Props) => {
    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-40">
                <Header />
            </div>
            {children}
        </>
    );
};

export default DefaultLayout;

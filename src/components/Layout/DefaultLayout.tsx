import { Header, Sidebar } from '@/components';

interface Props {
    children: React.ReactNode;
}

const DefaultLayout = ({ children }: Props) => {
    return (
        <>
            <div className="fixed left-0 right-0 top-0 z-[100]">
                <Header />
            </div>
            <div className="app-container">
                <Sidebar />
                <div className="mt-header min-h-[calc(100vh_-_60px)] ml-sidebar">
                    {children}
                </div>
            </div>
        </>
    );
};

export default DefaultLayout;

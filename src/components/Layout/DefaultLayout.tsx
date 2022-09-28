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
                <div className="mt-header min-h-[calc(100vh_-_60px)] lg:ml-sidebar ml-0 md:ml-sidebarSmall ">
                    <div className="max-w-2xl mx-auto py-6 md:pl-4">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DefaultLayout;

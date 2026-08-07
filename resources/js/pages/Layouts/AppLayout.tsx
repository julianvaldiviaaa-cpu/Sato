import Navbar from '@/Components/Navbar';

type Props = {
    children?: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
    return (
        <>
            <Navbar />
            <div className="p-8">{children}</div>
        </>
    );
}

import Navbar from '@/Components/Navbar';

type Props = {
    children?: React.ReactNode;
};

export default function FormLayout({ children }: Props) {
    return (
        <>
            <Navbar />
            <div className="mx-auto mt-12 w-7/8 lg:w-3/6 mb-20">{children}</div>
        </>
    );
}

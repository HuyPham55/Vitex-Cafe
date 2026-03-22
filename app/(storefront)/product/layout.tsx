import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Menu Item',
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return children;
}

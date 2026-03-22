import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ASMR',
};

export default function AsmrLayout({ children }: { children: React.ReactNode }) {
    return children;
}

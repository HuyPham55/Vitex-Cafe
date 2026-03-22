import { Metadata } from 'next';
import { endpoints } from '@/lib/api';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
        const res = await fetch(`${API_URL}${endpoints.products}/${id}`, { cache: 'no-store' });
        if (res.ok) {
            const product = await res.json();
            return { title: product.name };
        }
    } catch (error) {
        console.error('Failed to fetch product for metadata:', error);
    }

    return { title: 'Product Details' };
}

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
    return children;
}

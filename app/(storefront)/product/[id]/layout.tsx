import { Metadata } from 'next';
import { endpoints, getImageUrl } from '@/lib/api';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
        const res = await fetch(`${API_URL}${endpoints.products}/${id}`, { cache: 'no-store' });
        if (res.ok) {
            const product = await res.json();
            const imageUrl = getImageUrl(product.imageUrl);
            
            return { 
                title: product.name,
                description: product.description,
                openGraph: {
                    title: product.name,
                    description: product.description,
                    images: [
                        {
                            url: imageUrl,
                            width: 1200,
                            height: 630,
                            alt: product.name,
                        }
                    ],
                },
                twitter: {
                    card: 'summary_large_image',
                    title: product.name,
                    description: product.description,
                    images: [imageUrl],
                }
            };
        }
    } catch (error) {
        console.error('Failed to fetch product for metadata:', error);
    }

    return { title: 'Product Details' };
}

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
    return children;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    let data;
    const text = await res.text();
    try {
        data = JSON.parse(text);
    } catch (e) {
        data = { message: text || 'Server Error' };
    }

    if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

export const endpoints = {
    products: '/products',
    variants: '/variants',
    orders: '/orders',
    reviews: '/reviews',
    settings: '/settings',
    auth: '/auth',
};

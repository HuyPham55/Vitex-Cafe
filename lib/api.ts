const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Formats price using Vietnamese locale (thousand separator .)
 * Example: 40000 -> 40.000
 */
export function formatPrice(price: number | string) {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num)) return '0';
    return num.toLocaleString('vi-VN');
}


/** Product id on an order line item (string id or populated ref). */
export function getOrderItemProductId(item: {
    product?: string | { _id?: string };
}): string | null {
    if (!item?.product) return null;
    if (typeof item.product === 'string') return item.product;
    if (typeof item.product === 'object' && item.product._id) {
        return String(item.product._id);
    }
    return null;
}

export function getImageUrl(path: string | null | undefined) {
    if (!path) return 'https://picsum.photos/400/300';
    if (path.startsWith('http')) return path;
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}${path}`;
}

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('vt_admin_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
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

export type AdminOrdersPagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type AdminOrdersQueryParams = {
    page: number;
    limit?: number;
    date?: 'today' | 'all';
    status?: string;
    paymentStatus?: 'all' | 'paid' | 'unpaid';
    lunchOnly?: boolean;
};

export function buildAdminOrdersQuery(params: AdminOrdersQueryParams): string {
    const search = new URLSearchParams();
    search.set('page', String(params.page));
    search.set('limit', String(params.limit ?? 20));
    if (params.date === 'today') {
        search.set('date', 'today');
    }
    if (params.status && params.status !== 'all') {
        search.set('status', params.status);
    }
    if (params.paymentStatus && params.paymentStatus !== 'all') {
        search.set('paymentStatus', params.paymentStatus);
    }
    if (params.lunchOnly) {
        search.set('type', 'lunch');
    }
    return `?${search.toString()}`;
}

export const endpoints = {
    products: '/products',
    variants: '/variants',
    orders: '/orders',
    reviews: '/reviews',
    settings: '/settings',
    auth: '/auth',
    asmr: '/asmr',
    discounts: '/discounts',
    about: '/settings',
    lunchMenu: '/lunch/menu',
    lunchSettings: '/lunch/settings',
    lunchOrders: '/lunch/orders',
};

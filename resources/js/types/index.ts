import type { User } from './auth';

export type * from './auth';

export type Paginated<T> = {
    current_page: number;
    data: T[];
    first_page_url: string | null;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};

export type Category = {
    id: number;
    name: string;
    description: string | null;
    slug: string;

    saucers: Saucer[];
};

export type Saucer = {
    id: number;
    category_id: number;

    name: string;
    description: string | null;

    price: number;
    available: boolean;

    slug: string;

    category: Category;
    images?: SaucerImage[];
    ingredients?: SaucerIngredient[];
};

export type SaucerImage = {
    id: number;
    saucer_id: number;

    image: string;
    position: number;
};

export type Ingredient = {
    id: number;
    name: string;
    description: string;
    cost: number;
    stock: number;
    unit: 'kg' | 'l' | 'g' | 'ml' | 'piece';
    slug: string;
};

export type SaucerIngredient = Ingredient & {
    pivot: {
        saucer_id: number;
        ingredient_id: number;
        quantity: number;
    };
};

export type Order = {
    id: number;
    worker: User;
    customer: User | null;

    table_number: number;

    code: string | null;

    folio: string | null;

    status: 'open' | 'completed' | 'cancelled';

    customer_joined_at: string | null;
    bill_requested_at: string | null;
    payment_method: 'cash' | 'card' | null;

    subtotal: number;
    tax: number;
    total: number;

    paid_at: string | null;

    items: OrderItem[];

    created_at: string;
    updated_at: string;
};

export type OrderItem = {
    id: number;
    order_id: number;
    saucer_id: number;

    quantity: number;
    unit_price: number;
    subtotal: number;

    status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    notes: string | null;

    saucer: Saucer | null;

    created_at: string;
    updated_at: string;
};

export type Business = {
    business_name: string;
    rfc: string;
    address: string;
    regime: string;
    folio_prefix: string;
    currency: string;
};

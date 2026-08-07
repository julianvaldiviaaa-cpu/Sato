import { Button } from '@heroui/react';
import { router, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';
import type { Category, Order, Paginated } from '@/types';
import AppLayout from '../Layouts/AppLayout';
import OrderUser from './Roles/OrderUser';
import OrderWorker from './Roles/OrderWorker';

type Props = {
    order: Order;
    categories: Paginated<Category>;
};

const statusLabel: Record<string, string> = {
    open: 'En curso',
    completed: 'Completada',
    cancelled: 'Cancelada',
};

const statusColor: Record<string, string> = {
    open: 'bg-orange-100 text-orange-600',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-500',
};

export default function OrderShow({ order, categories }: Props) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isStaff = user.role === 'admin' || user.role === 'worker';

    const [readyNotices, setReadyNotices] = useState<string[]>([]);
    const processedRef = useRef(new Set<number>());

    useEffect(() => {
        const channel = window.Echo?.private(`orders.${order.id}`);

        channel?.listen('bill.requested', () => {
            router.reload({ only: ['order'] });
        });

        channel?.listen('items.added', () => {
            router.reload({ only: ['order'] });
        });

        channel?.listen('item.status.updated', (event: {
            order_item_id: number;
            saucer_name: string | null;
            status: string;
        }) => {
            if (
                isStaff &&
                event.status === 'ready' &&
                !processedRef.current.has(event.order_item_id)
            ) {
                processedRef.current.add(event.order_item_id);
                setReadyNotices((prev) =>
                    prev.includes(event.saucer_name ?? 'Platillo')
                        ? prev
                        : [...prev, event.saucer_name ?? 'Platillo'],
                );
            }

            router.reload({ only: ['order'] });
        });

        return () => {
            channel?.stopListening('bill.requested');
            channel?.stopListening('items.added');
            channel?.stopListening('item.status.updated');
            window.Echo?.leave(`orders.${order.id}`);
        };
    }, [order.id, isStaff]);

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        onClick={() => router.get(route('dashboard'))}
                        className="group flex items-center gap-1.5 rounded-full border border-stone-200/70 bg-white/60 py-2 pr-4 pl-2.5 text-sm font-medium text-stone-500 backdrop-blur-xl transition-all duration-300 ease-out hover:border-orange-200 hover:bg-white hover:text-orange-600 active:scale-95"
                    >
                        <ChevronLeft
                            size={16}
                            className="transition-transform duration-300 ease-out group-hover:-translate-x-0.5"
                        />
                        Dashboard
                    </Button>

                    <div className="flex items-center gap-3">
                        <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold tracking-wide text-stone-500 uppercase">
                            Mesa {order.table_number}
                        </span>
                        <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide uppercase ${
                                statusColor[order.status] ?? 'bg-stone-100 text-stone-500'
                            }`}
                        >
                            {statusLabel[order.status]}
                        </span>
                    </div>
                </div>

                {isStaff && (
                    <OrderWorker
                        order={order}
                        readyNotices={readyNotices}
                        onClearReadyNotices={() => setReadyNotices([])}
                    />
                )}
                {user.role === 'user' && (
                    <OrderUser order={order} categories={categories} />
                )}
            </div>
        </AppLayout>
    );
}
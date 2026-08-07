import { Button } from '@heroui/react';
import { Head, router } from '@inertiajs/react';
import { ChefHat, ChevronLeft, UtensilsCrossed } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import AppLayout from '@/pages/Layouts/AppLayout';
import type { Order, OrderItem } from '@/types';

type Props = {
    orders: Order[];
};

const statusMeta: Record<
    string,
    { label: string; className: string }
> = {
    pending: {
        label: 'Pendiente',
        className: 'bg-amber-100 text-amber-700',
    },
    preparing: {
        label: 'En preparación',
        className: 'bg-orange-100 text-orange-600',
    },
    ready: {
        label: 'Listo',
        className: 'bg-emerald-100 text-emerald-700',
    },
    delivered: {
        label: 'Entregado',
        className: 'bg-stone-100 text-stone-500',
    },
    cancelled: {
        label: 'Cancelado',
        className: 'bg-red-100 text-red-500',
    },
};

export default function Kitchen({ orders }: Props) {
    const [updating, setUpdating] = useState<number | null>(null);

    useEffect(() => {
        const channel = window.Echo?.private('kitchen');

        channel?.listen('items.added', () => {
            router.reload({ only: ['orders'] });
        });

        channel?.listen('item.status.updated', () => {
            router.reload({ only: ['orders'] });
        });

        return () => {
            channel?.stopListening('items.added');
            channel?.stopListening('item.status.updated');
            window.Echo?.leave('kitchen');
        };
    }, []);

    const changeStatus = (item: OrderItem, status: OrderItem['status']) => {
        setUpdating(item.id);
        router.patch(
            route('kitchen.items.status', { orderItem: item.id }),
            { status },
            {
                preserveScroll: true,
                onFinish: () => setUpdating(null),
            },
        );
    };

    // Solo se muestran los platillos que aún están por atender. Cuando uno
    // pasa a "listo", deja de aparecer aquí y pasa al punto de servicio.
    const ordersWithItems = orders
        .map((order) => ({
            ...order,
            items: order.items.filter(
                (item) =>
                    item.status === 'pending' || item.status === 'preparing',
            ),
        }))
        .filter((order) => order.items.length > 0);

    const pendingCount = ordersWithItems.reduce(
        (acc, order) =>
            acc +
            order.items.filter((item) => item.status === 'pending').length,
        0,
    );
    const preparingCount = ordersWithItems.reduce(
        (acc, order) =>
            acc +
            order.items.filter((item) => item.status === 'preparing').length,
        0,
    );

    return (
        <AppLayout>
            <Head title="Cocina" />

            <div className="space-y-8">
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

                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-wide text-orange-500 uppercase">
                            Cocina
                        </p>
                        <h1 className="mt-1 text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-stone-900 sm:text-6xl">
                            Pedidos por preparar
                        </h1>
                        <p className="mt-3 text-base text-stone-500">
                            Marca cada platillo para actualizar al mesero. Al
                            marcarlo como listo desaparecerá de la cocina.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex items-center gap-2.5 rounded-2xl border border-amber-500/15 bg-amber-50/80 px-4 py-3 backdrop-blur-xl">
                            <span className="text-2xl font-bold tracking-[-0.02em] text-amber-600">
                                {pendingCount}
                            </span>
                            <span className="text-xs font-semibold tracking-wide text-amber-600 uppercase">
                                Pendientes
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-2xl border border-orange-500/20 bg-orange-50/80 px-4 py-3 backdrop-blur-xl">
                            <span className="text-2xl font-bold tracking-[-0.02em] text-orange-600">
                                {preparingCount}
                            </span>
                            <span className="text-xs font-semibold tracking-wide text-orange-600 uppercase">
                                En prep.
                            </span>
                        </div>
                    </div>
                </div>

                {ordersWithItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-stone-200 bg-stone-50/60 px-6 py-20 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-300 shadow-sm">
                            <ChefHat size={22} />
                        </div>
                        <p className="text-sm font-medium text-stone-400">
                            No hay platillos por atender en este momento
                        </p>
                        <p className="text-xs text-stone-400">
                            Cuando un pedido llegue a la cocina aparecerá aquí
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {ordersWithItems.map((order) => (
                            <div
                                key={order.id}
                                className="overflow-hidden rounded-[28px] border border-stone-900/[0.06] bg-white/70 backdrop-blur-xl"
                            >
                                <div className="flex items-center justify-between gap-4 border-b border-stone-900/[0.06] px-7 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                            <UtensilsCrossed size={20} />
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-stone-900">
                                                Mesa {order.table_number}
                                            </h2>
                                            <p className="text-sm text-stone-500">
                                                {order.customer?.name}{' '}
                                                {order.customer?.last_name}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-semibold tracking-wide text-stone-500 uppercase">
                                        {order.items.length}{' '}
                                        {order.items.length === 1
                                            ? 'platillo'
                                            : 'platillos'}
                                    </span>
                                </div>

                                <ul className="divide-y divide-stone-900/[0.04]">
                                    {order.items.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex flex-wrap items-center justify-between gap-4 px-7 py-5"
                                        >
                                            <div className="min-w-0">
                                                <p className="font-medium text-stone-900">
                                                    {item.saucer?.name}{' '}
                                                    <span className="text-stone-400">
                                                        x{item.quantity}
                                                    </span>
                                                </p>
                                                {item.notes && (
                                                    <p className="mt-0.5 text-sm text-stone-500">
                                                        Nota: {item.notes}
                                                    </p>
                                                )}
                                                <span
                                                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${
                                                        statusMeta[item.status]
                                                            ?.className ??
                                                        'bg-stone-100 text-stone-500'
                                                    }`}
                                                >
                                                    {
                                                        statusMeta[item.status]
                                                            ?.label
                                                    }
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {item.status === 'pending' && (
                                                    <Button
                                                        size="sm"
                                                        isDisabled={
                                                            updating ===
                                                            item.id
                                                        }
                                                        onPress={() =>
                                                            changeStatus(
                                                                item,
                                                                'preparing',
                                                            )
                                                        }
                                                    >
                                                        Empezar
                                                    </Button>
                                                )}
                                                {item.status ===
                                                    'preparing' && (
                                                    <Button
                                                        size="sm"
                                                        isDisabled={
                                                            updating ===
                                                            item.id
                                                        }
                                                        onPress={() =>
                                                            changeStatus(
                                                                item,
                                                                'ready',
                                                            )
                                                        }
                                                        className="bg-orange-500 text-white"
                                                    >
                                                        {updating === item.id
                                                            ? 'Listo…'
                                                            : 'Listo'}
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    isDisabled={
                                                        updating === item.id
                                                    }
                                                    onPress={() =>
                                                        changeStatus(
                                                            item,
                                                            'cancelled',
                                                        )
                                                    }
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
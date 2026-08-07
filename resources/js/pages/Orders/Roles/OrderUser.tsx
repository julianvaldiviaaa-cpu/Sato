import { Button, Input, TextField } from '@heroui/react';
import { useForm } from '@inertiajs/react';
import { Minus, Plus, ShoppingBag, Soup, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { formatCurrency } from '@/Helpers/formatCurrency';
import type { Category, Order, Paginated, Saucer } from '@/types';

type Props = {
    order: Order;
    categories: Paginated<Category>;
};

type DraftItem = {
    saucer: Saucer;
    quantity: number;
    notes: string;
};

const statusLabel: Record<string, string> = {
    pending: 'Pendiente',
    preparing: 'En preparación',
    ready: 'Listo',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};

const statusColor: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    preparing: 'bg-orange-100 text-orange-600',
    ready: 'bg-emerald-100 text-emerald-700',
    delivered: 'bg-stone-100 text-stone-500',
    cancelled: 'bg-red-100 text-red-500',
};

export default function OrderUser({ order, categories }: Props) {
    const [orderDraft, setOrderDraft] = useState<DraftItem[]>([]);

    const form = useForm<{
        items: { saucer_id: number; quantity: number; notes: string }[];
    }>({
        items: [],
    });

    const billForm = useForm<{ payment_method: 'cash' | 'card' }>({
        payment_method: 'cash',
    });

    const handleRequestBill = () => {
        billForm.post(route('orders.request-bill', order.id));
    };

    const addToDraft = (saucer: Saucer) => {
        if (!saucer.available) {
            return;
        }

        setOrderDraft((prev) => {
            const existing = prev.find((item) => item.saucer.id === saucer.id);

            if (existing) {
                return prev.map((item) =>
                    item.saucer.id === saucer.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }

            return [...prev, { saucer, quantity: 1, notes: '' }];
        });
    };

    const removeFromDraft = (saucerId: number) => {
        setOrderDraft((prev) =>
            prev.filter((item) => item.saucer.id !== saucerId),
        );
    };

    const changeQuantity = (saucerId: number, delta: number) => {
        setOrderDraft((prev) =>
            prev.map((item) =>
                item.saucer.id === saucerId
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item,
            ),
        );
    };

    const changeNotes = (saucerId: number, notes: string) => {
        setOrderDraft((prev) =>
            prev.map((item) =>
                item.saucer.id === saucerId ? { ...item, notes } : item,
            ),
        );
    };

    const handleOrder = () => {
        form.setData(
            'items',
            orderDraft.map((item) => ({
                saucer_id: item.saucer.id,
                quantity: item.quantity,
                notes: item.notes,
            })) as [],
        );

        form.post(route('orders.items.store', order.id), {
            onSuccess: () => setOrderDraft([]),
        });
    };

    const draftTotal = orderDraft.reduce(
        (acc, item) => acc + item.saucer.price * item.quantity,
        0,
    );

    if (order.status !== 'open') {
        return (
            <div className="space-y-8">
                <div
                    className={`flex flex-col items-start gap-4 rounded-[28px] border p-8 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between ${
                        order.status === 'completed'
                            ? 'border-emerald-300/60 bg-emerald-50/80'
                            : 'border-red-300/60 bg-red-50/80'
                    }`}
                >
                    <div>
                        <p className="text-xs font-semibold tracking-wide uppercase">
                            Mesa {order.table_number}
                        </p>
                        <h1 className="mt-1 text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-stone-900">
                            {order.status === 'completed'
                                ? 'Orden pagada y cerrada'
                                : 'Orden cancelada'}
                        </h1>
                        <p className="mt-2 text-sm text-stone-500">
                            Esta orden ya está cerrada y no se pueden hacer
                            cambios.
                        </p>
                    </div>

                    <p className="shrink-0 text-3xl font-bold tracking-[-0.02em] text-stone-900">
                        {formatCurrency(order.total)}
                    </p>
                </div>

                <section className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold tracking-[-0.01em] text-stone-900">
                            Platillos ordenados
                        </h2>
                        <span className="text-xs font-medium tracking-wide text-stone-400 uppercase">
                            {order.items.length}{' '}
                            {order.items.length === 1
                                ? 'platillo'
                                : 'platillos'}
                        </span>
                    </div>

                    {order.items.length > 0 ? (
                        <ul className="divide-y divide-stone-900/[0.04] overflow-hidden rounded-[24px] border border-stone-900/[0.06] bg-white/70 backdrop-blur-xl">
                            {order.items.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
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
                                    </div>
                                    <p className="font-semibold text-stone-800">
                                        {formatCurrency(item.subtotal)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-stone-200 bg-stone-50/60 px-6 py-12 text-center">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-300 shadow-sm">
                                <Soup size={20} />
                            </div>
                            <p className="text-sm font-medium text-stone-400">
                                Esta orden no tiene platillos
                            </p>
                        </div>
                    )}

                    <div className="ml-auto w-full max-w-sm space-y-1 text-sm">
                        <div className="flex justify-between text-stone-600">
                            <span>Subtotal</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                            <span>Impuesto</span>
                            <span>{formatCurrency(order.tax)}</span>
                        </div>
                        <div className="flex justify-between border-t border-stone-900/[0.06] pt-2 text-base font-bold text-stone-900">
                            <span>Total</span>
                            <span>{formatCurrency(order.total)}</span>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-wide text-orange-500 uppercase">
                        Mesa {order.table_number}
                    </p>
                    <h1 className="mt-1 text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-stone-900 sm:text-6xl">
                        Tu orden
                    </h1>
                    <p className="mt-3 text-base text-stone-500">
                        Agrega platillos del menú y envíalos a la cocina.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2.5 rounded-2xl border border-stone-900/[0.06] bg-white/70 px-4 py-3 backdrop-blur-xl">
                        <User size={16} className="text-stone-400" />
                        <span className="text-sm font-medium text-stone-700">
                            Mesero: {order.worker.name} {order.worker.last_name}
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-2xl border border-orange-500/10 bg-white/70 px-4 py-3 backdrop-blur-xl">
                        <ShoppingBag size={16} className="text-orange-500" />
                        <span className="text-sm font-medium text-stone-700">
                            Total: {formatCurrency(order.total)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-5">
                {/* Columna izquierda: pedido */}
                <div className="space-y-8 xl:col-span-2">
                    <section className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-xl font-semibold tracking-[-0.01em] text-stone-900">
                                Platillos que ordenaste
                            </h2>
                            <span className="text-xs font-medium tracking-wide text-stone-400 uppercase">
                                {order.items.length}{' '}
                                {order.items.length === 1
                                    ? 'platillo'
                                    : 'platillos'}
                            </span>
                        </div>

                        {order.items.length > 0 ? (
                            <ul className="divide-y divide-stone-900/[0.04] overflow-hidden rounded-[24px] border border-stone-900/[0.06] bg-white/70 backdrop-blur-xl">
                                {order.items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                                    >
                                        <div className="flex flex-1 items-center gap-3">
                                            {item.saucer?.images?.[0] && (
                                                <img
                                                    src={`/storage/${item.saucer.images[0].image}`}
                                                    alt={item.saucer.name}
                                                    className="h-14 w-14 shrink-0 rounded-2xl border border-stone-900/[0.06] object-cover"
                                                />
                                            )}
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
                                                    className={`mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${
                                                        statusColor[item.status]
                                                    }`}
                                                >
                                                    {statusLabel[item.status]}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-stone-800">
                                            {formatCurrency(item.subtotal)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-stone-200 bg-stone-50/60 px-6 py-12 text-center">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-300 shadow-sm">
                                    <Soup size={20} />
                                </div>
                                <p className="text-sm font-medium text-stone-400">
                                    Aún no has ordenado nada
                                </p>
                                <p className="text-xs text-stone-400">
                                    Elige del menú para comenzar
                                </p>
                            </div>
                        )}
                    </section>

                    <section className="rounded-[28px] border border-orange-500/10 bg-white/70 p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_45px_-18px_rgba(234,88,12,0.18)] backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-xl font-semibold tracking-[-0.01em] text-stone-900">
                                Tu orden actual
                            </h2>
                            {orderDraft.length > 0 && (
                                <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-orange-600 uppercase">
                                    {orderDraft.length}{' '}
                                    {orderDraft.length === 1
                                        ? 'platillo'
                                        : 'platillos'}
                                </span>
                            )}
                        </div>

                        {orderDraft.length === 0 ? (
                            <p className="mt-4 text-sm text-stone-500">
                                No has agregado platillos todavía.
                            </p>
                        ) : (
                            <ul className="mt-5 space-y-4">
                                {orderDraft.map((item) => (
                                    <li
                                        key={item.saucer.id}
                                        className="rounded-2xl border border-stone-900/[0.06] bg-stone-50/60 p-4"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="font-semibold text-stone-900">
                                                {item.saucer.name}
                                            </p>
                                            <div className="flex items-center gap-1.5">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    onPress={() =>
                                                        changeQuantity(
                                                            item.saucer.id,
                                                            -1,
                                                        )
                                                    }
                                                >
                                                    <Minus size={14} />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-semibold text-stone-800">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    onPress={() =>
                                                        changeQuantity(
                                                            item.saucer.id,
                                                            1,
                                                        )
                                                    }
                                                >
                                                    <Plus size={14} />
                                                </Button>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="danger"
                                                    onPress={() =>
                                                        removeFromDraft(
                                                            item.saucer.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>

                                        <TextField
                                            value={item.notes}
                                            onChange={(value) =>
                                                changeNotes(
                                                    item.saucer.id,
                                                    value,
                                                )
                                            }
                                            className="mt-3"
                                        >
                                            <Input
                                                aria-label={`Notas para ${item.saucer.name}`}
                                                placeholder="Notas para este platillo"
                                                className="w-full rounded-xl border-2 border-transparent bg-white px-4 py-2.5 text-sm text-stone-900 transition-colors duration-200 ease-out outline-none placeholder:text-stone-400 data-[focused]:border-orange-400"
                                            />
                                        </TextField>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-6 flex items-center justify-between border-t border-stone-900/[0.06] pt-5">
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-stone-400 uppercase">
                                    Subtotal
                                </p>
                                <p className="text-2xl font-bold tracking-[-0.02em] text-orange-600">
                                    {formatCurrency(draftTotal)}
                                </p>
                            </div>

                            <Button
                                onPress={handleOrder}
                                isDisabled={
                                    orderDraft.length === 0 || form.processing
                                }
                                className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97] disabled:opacity-50"
                            >
                                {form.processing ? 'Enviando…' : 'Ordenar'}
                            </Button>
                        </div>

                        {form.errors.items && (
                            <p className="mt-3 text-sm font-medium text-red-500">
                                {form.errors.items}
                            </p>
                        )}
                    </section>

                    <section className="rounded-[28px] border border-stone-900/[0.06] bg-white/70 p-7 backdrop-blur-xl">
                        <h2 className="text-xl font-semibold tracking-[-0.01em] text-stone-900">
                            Cuenta
                        </h2>
                        <p className="mt-1 text-sm text-stone-500">
                            Total acumulado de tu orden:{' '}
                            <span className="font-semibold text-orange-600">
                                {formatCurrency(order.total)}
                            </span>
                        </p>

                        {order.bill_requested_at ? (
                            <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                                Has pedido la cuenta. Tu mesero se acercará
                                pronto.
                            </p>
                        ) : (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-stone-600">
                                    ¿Cómo pagarás?
                                </p>
                                <div className="mt-2 flex gap-2">
                                    <Button
                                        onPress={() =>
                                            billForm.setData(
                                                'payment_method',
                                                'cash',
                                            )
                                        }
                                        className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-out active:scale-[0.97] ${
                                            billForm.data.payment_method ===
                                            'cash'
                                                ? 'bg-orange-500 text-white'
                                                : 'border border-stone-200 bg-white/60 text-stone-600'
                                        }`}
                                    >
                                        Efectivo
                                    </Button>
                                    <Button
                                        onPress={() =>
                                            billForm.setData(
                                                'payment_method',
                                                'card',
                                            )
                                        }
                                        className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-out active:scale-[0.97] ${
                                            billForm.data.payment_method ===
                                            'card'
                                                ? 'bg-orange-500 text-white'
                                                : 'border border-stone-200 bg-white/60 text-stone-600'
                                        }`}
                                    >
                                        Tarjeta
                                    </Button>
                                </div>

                                {billForm.errors.payment_method && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {billForm.errors.payment_method}
                                    </p>
                                )}

                                <Button
                                    onPress={handleRequestBill}
                                    isDisabled={billForm.processing}
                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3 text-sm font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97] disabled:opacity-50"
                                >
                                    <ShoppingBag size={16} /> Pedir la cuenta
                                </Button>
                            </div>
                        )}
                    </section>
                </div>

                {/* Columna derecha: menú */}
                <div className="space-y-8 xl:col-span-3">
                    <div>
                        <h2 className="text-xl font-semibold tracking-[-0.01em] text-stone-900">
                            Menú
                        </h2>
                        <p className="mt-1 text-sm text-stone-500">
                            Elige tus comidas favoritas
                        </p>
                    </div>

                    {categories.data.map((category) => (
                        <section key={category.id} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-semibold tracking-[-0.01em] text-stone-900 capitalize">
                                    {category.name}
                                </h3>
                                <span className="h-px flex-1 bg-stone-900/[0.06]" />
                            </div>
                            {category.description && (
                                <p className="text-sm text-stone-500">
                                    {category.description}
                                </p>
                            )}

                            {category.saucers.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {category.saucers.map((saucer) => (
                                        <div
                                            key={saucer.id}
                                            className="flex flex-col rounded-[24px] border border-stone-900/[0.06] bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 ease-out hover:border-orange-500/20 hover:shadow-[0_16px_35px_-18px_rgba(234,88,12,0.2)]"
                                        >
                                            {saucer.images?.[0] && (
                                                <img
                                                    src={`/storage/${saucer.images[0].image}`}
                                                    alt={saucer.name}
                                                    className="aspect-2/1 w-full rounded-2xl border border-stone-900/[0.06] object-cover"
                                                />
                                            )}

                                            <div className="mt-4 flex items-start justify-between gap-3">
                                                <h4 className="text-lg font-semibold tracking-[-0.01em] text-stone-900 capitalize">
                                                    {saucer.name}
                                                </h4>
                                                {!saucer.available && (
                                                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-red-500 uppercase">
                                                        Agotado
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-stone-500">
                                                {saucer.description}
                                            </p>

                                            <div className="mt-4 flex items-center justify-between gap-3">
                                                <p className="text-xl font-bold tracking-[-0.02em] text-orange-600">
                                                    {formatCurrency(
                                                        saucer.price,
                                                    )}
                                                </p>
                                                <Button
                                                    size="sm"
                                                    isDisabled={
                                                        !saucer.available
                                                    }
                                                    onPress={() =>
                                                        addToDraft(saucer)
                                                    }
                                                    className="rounded-xl bg-orange-500 text-white transition-all duration-300 ease-out active:scale-[0.97] disabled:opacity-50"
                                                >
                                                    <Plus size={14} /> Agregar
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-stone-400">
                                    Esta categoría aún no tiene platillos.
                                </p>
                            )}
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

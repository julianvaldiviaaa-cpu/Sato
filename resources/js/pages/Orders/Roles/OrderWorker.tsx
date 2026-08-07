import { Button } from '@heroui/react';
import { usePage } from '@inertiajs/react';
import { ClipboardList, CreditCard, Receipt, Soup } from 'lucide-react';
import { route } from 'ziggy-js';
import { formatCurrency } from '@/Helpers/formatCurrency';
import type { Order } from '@/types';

type Props = {
    order: Order;
    readyNotices: string[];
    onClearReadyNotices: () => void;
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

const paymentLabel: Record<string, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta',
};

export default function OrderWorker({
    order,
    readyNotices,
    onClearReadyNotices,
}: Props) {
    const { auth } = usePage().props;
    const user = auth.user;

    const openInvoice = () => {
        window.open(route('orders.invoice', order.id), '_blank');
    };

    const readyItems = order.items.filter((item) => item.status === 'ready');

    return (
        <div className="space-y-8">
            {order.code ? (
                <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-[28px] border border-orange-500/10 bg-white/70 p-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_45px_-18px_rgba(234,88,12,0.18)] backdrop-blur-xl">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                        <ClipboardList size={26} />
                    </div>
                    <h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-stone-900 sm:text-5xl">
                        Orden lista
                    </h1>
                    <p className="max-w-sm text-base/6 text-stone-500">
                        Comparte el siguiente código con el cliente para darle
                        acceso a la orden
                    </p>

                    <p className="rounded-3xl border border-dashed border-orange-300 bg-orange-50/70 px-10 py-6 text-6xl font-bold tracking-[0.1em] text-orange-600 sm:text-8xl">
                        {order.code}
                    </p>

                    <p className="max-w-xs text-sm text-stone-400">
                        Este código es de un solo uso y no se puede regenerar.
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-orange-500 uppercase">
                                Mesa {order.table_number}
                            </p>
                            <h1 className="mt-1 text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-stone-900 sm:text-6xl">
                                {order.status === 'completed'
                                    ? 'Orden cerrada'
                                    : 'Orden iniciada'}
                            </h1>
                            <p className="mt-3 text-base text-stone-500">
                                {order.status === 'completed'
                                    ? 'Esta orden ya fue pagada y cerrada, no se pueden hacer cambios.'
                                    : 'Administra esta orden y atiende a tu cliente.'}
                            </p>
                        </div>

                        <div className="rounded-[24px] border border-orange-500/10 bg-white/70 p-5 backdrop-blur-xl">
                            <p className="text-xs font-semibold tracking-wide text-stone-400 uppercase">
                                Cliente
                            </p>
                            <p className="mt-1 text-lg font-semibold capitalize text-stone-900">
                                {order.customer?.name}{' '}
                                {order.customer?.last_name ?? ''}
                            </p>
                            <p className="mt-0.5 text-sm text-stone-500">
                                Mesero:{' '}
                                {order.worker?.name}{' '}
                                {order.worker?.last_name}
                                {order.worker?.id === +user.id && ' (Tu)'}
                            </p>
                        </div>
                    </div>

                    {order.status === 'open' && readyNotices.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-emerald-300/60 bg-emerald-50/80 p-5 backdrop-blur-xl">
                            <div>
                                <p className="font-semibold text-emerald-700">
                                    Platillo(s) listos en cocina:
                                </p>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {readyNotices.map((name) => (
                                        <span
                                            key={name}
                                            className="rounded-full bg-white px-3 py-1 text-sm font-medium text-emerald-700 shadow-sm"
                                        >
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <Button
                                size="sm"
                                onPress={onClearReadyNotices}
                                className="rounded-xl bg-emerald-600 text-white"
                            >
                                Entendido
                            </Button>
                        </div>
                    )}

                    {order.status === 'open' && readyItems.length > 0 && (
                        <div className="rounded-[24px] border border-emerald-300/60 bg-emerald-50/80 p-5 backdrop-blur-xl">
                            <p className="font-semibold text-emerald-700">
                                Listos para servir:
                            </p>
                            <ul className="mt-2 space-y-1">
                                {readyItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center justify-between text-sm text-emerald-800"
                                    >
                                        <span>
                                            {item.saucer?.name} x{item.quantity}
                                        </span>
                                        <span className="font-semibold">
                                            {formatCurrency(item.subtotal)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {order.status === 'open' && order.bill_requested_at && (
                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-orange-300/60 bg-orange-50/80 p-5 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-orange-700">
                                        El cliente pidió la cuenta
                                    </p>
                                    {order.payment_method && (
                                        <p className="text-sm text-orange-600">
                                            Método de pago:{' '}
                                            {paymentLabel[order.payment_method]}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Button
                                onPress={openInvoice}
                                className="rounded-xl bg-orange-500 text-white"
                            >
                                Generar factura
                            </Button>
                        </div>
                    )}

                    {order.status === 'open' && !order.bill_requested_at && order.items.length > 0 && (
                        <Button
                            onPress={openInvoice}
                            className="flex items-center justify-center gap-2 rounded-2xl border border-orange-500/15 bg-white/80 px-5 py-3 text-sm font-semibold tracking-tight text-orange-600 backdrop-blur-xl transition-all duration-300 ease-out hover:bg-orange-50 active:scale-[0.97]"
                        >
                            <Receipt size={16} /> Generar factura
                        </Button>
                    )}

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                <Soup size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold tracking-[-0.01em] text-stone-900">
                                    Platillos ordenados
                                </h2>
                                <p className="text-sm text-stone-500">
                                    {order.items.length}{' '}
                                    {order.items.length === 1
                                        ? 'platillo'
                                        : 'platillos'}
                                </p>
                            </div>
                        </div>

                        {order.items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-stone-200 bg-stone-50/60 px-6 py-14 text-center">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-300 shadow-sm">
                                    <Soup size={20} />
                                </div>
                                <p className="text-sm font-medium text-stone-400">
                                    El cliente aún no ordena
                                </p>
                            </div>
                        ) : (
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
                                            <span
                                                className={`mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${
                                                    statusColor[item.status]
                                                }`}
                                            >
                                                {statusLabel[item.status]}
                                            </span>
                                        </div>
                                        <p className="font-semibold text-stone-800">
                                            {formatCurrency(item.subtotal)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {order.status === 'completed' && (
                        <div className="flex items-center justify-between rounded-[24px] border border-emerald-300/60 bg-emerald-50/80 p-5 backdrop-blur-xl">
                            <p className="font-semibold text-emerald-700">
                                Orden pagada y cerrada.
                            </p>
                            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm">
                                {formatCurrency(order.total)}
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
import { Button } from '@heroui/react';
import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarClock,
    ChevronLeft,
    ChevronRight,
    Receipt,
} from 'lucide-react';
import { route } from 'ziggy-js';
import { formatCurrency } from '@/Helpers/formatCurrency';
import AppLayout from '@/pages/Layouts/AppLayout';
import type { Order, Paginated } from '@/types';

type Props = {
    orders: Paginated<Order>;
    period: 'today' | 'week' | 'month' | 'year';
    summary: { count: number; total: number };
};

const periodLabel: Record<Props['period'], string> = {
    today: 'Hoy',
    week: 'Esta semana',
    month: 'Este mes',
    year: 'Este año',
};

const statusLabel: Record<string, string> = {
    open: 'En curso',
    completed: 'Completada',
    cancelled: 'Cancelada',
};

const statusColor: Record<string, string> = {
    open: 'bg-orange-100 text-orange-600',
    completed: 'bg-emerald-100 text-emerald-600',
    cancelled: 'bg-red-100 text-red-500',
};

export default function AdminOrders({ orders, period, summary }: Props) {
    return (
        <AppLayout>
            <div className="space-y-10">
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
                            Órdenes
                        </p>
                        <h1 className="mt-1 text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-stone-900 sm:text-6xl">
                            {periodLabel[period]}
                        </h1>
                        <p className="mt-3 text-base text-stone-500">
                            {summary.count}{' '}
                            {summary.count === 1
                                ? 'orden registrada'
                                : 'órdenes registradas'}{' '}
                            en este período.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-orange-500/15 bg-white/70 px-5 py-3.5 backdrop-blur-xl">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                            <Receipt size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-stone-400 uppercase">
                                Total acumulado
                            </p>
                            <p className="text-xl font-bold tracking-[-0.02em] text-orange-600">
                                {formatCurrency(summary.total)}
                            </p>
                        </div>
                    </div>
                </div>

                {orders.data.length > 0 ? (
                    <section className="space-y-4">
                        <div className="overflow-hidden rounded-[28px] border border-stone-900/[0.06] bg-white/70 backdrop-blur-xl">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-stone-900/[0.06] text-left text-xs tracking-wide text-stone-400 uppercase">
                                        <th className="px-6 py-4 font-semibold">
                                            Folio
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            Mesa
                                        </th>
                                        <th className="hidden px-6 py-4 font-semibold sm:table-cell">
                                            Cliente
                                        </th>
                                        <th className="hidden px-6 py-4 font-semibold lg:table-cell">
                                            Mesero
                                        </th>
                                        <th className="hidden px-6 py-4 font-semibold md:table-cell">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            Estado
                                        </th>
                                        <th className="px-6 py-4 text-right font-semibold">
                                            Total
                                        </th>
                                        <th className="px-6 py-4" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.data.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-stone-900/[0.04] transition-colors duration-200 ease-out last:border-0 hover:bg-orange-50/50"
                                        >
                                            <td className="px-6 py-4 font-medium text-stone-800">
                                                {order.folio ?? `#${order.id}`}
                                            </td>
                                            <td className="px-6 py-4 text-stone-600">
                                                Mesa {order.table_number}
                                            </td>
                                            <td className="hidden px-6 py-4 capitalize text-stone-600 sm:table-cell">
                                                {order.customer?.name ??
                                                    'Sin cliente'}
                                            </td>
                                            <td className="hidden px-6 py-4 capitalize text-stone-600 lg:table-cell">
                                                {order.worker?.name}{' '}
                                                {order.worker?.last_name}
                                            </td>
                                            <td className="hidden px-6 py-4 text-stone-500 md:table-cell">
                                                {new Date(
                                                    order.created_at,
                                                ).toLocaleDateString('es-MX', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${
                                                        statusColor[
                                                            order.status
                                                        ] ?? 'bg-stone-100 text-stone-500'
                                                    }`}
                                                >
                                                    {statusLabel[order.status]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-semibold text-orange-600">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={route(
                                                        'orders.show',
                                                        order.id,
                                                    )}
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/20 bg-white/60 px-3.5 py-2 text-xs font-semibold text-orange-600 transition-all duration-300 ease-out hover:bg-orange-50 active:scale-95"
                                                >
                                                    Ver
                                                    <ArrowRight size={13} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {orders.links.length > 3 && (
                            <div className="flex justify-center pt-2">
                                <div className="flex items-center gap-1 rounded-2xl border border-stone-900/[0.06] bg-white/70 p-1.5 shadow-sm backdrop-blur-xl">
                                    {orders.links.map((link, index) => {
                                        const isPrev = link.label.includes(
                                            'Previous',
                                        );
                                        const isNext = link.label.includes(
                                            'Next',
                                        );

                                        return (
                                            <Link
                                                key={index}
                                                href={link.url ?? '#'}
                                                preserveScroll
                                                className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm font-semibold transition-all duration-300 ease-out active:scale-95 ${
                                                    link.active
                                                        ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/25'
                                                        : link.url
                                                          ? 'text-stone-500 hover:bg-orange-50 hover:text-orange-600'
                                                          : 'cursor-not-allowed text-stone-300'
                                                }`}
                                            >
                                                {isPrev ? (
                                                    <ChevronLeft size={16} />
                                                ) : isNext ? (
                                                    <ChevronRight size={16} />
                                                ) : (
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </section>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-stone-200 bg-stone-50/60 px-6 py-20 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-300 shadow-sm">
                            <CalendarClock size={22} />
                        </div>
                        <p className="text-sm font-medium text-stone-400">
                            No hay órdenes registradas en este período
                        </p>
                        <p className="text-xs text-stone-400">
                            Las órdenes que se creen aquí aparecerán en esta
                            lista.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
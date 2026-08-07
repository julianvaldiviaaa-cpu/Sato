import { Link } from '@inertiajs/react';
import { ChevronRight, ClipboardList, Flame, History } from 'lucide-react';
import { route } from 'ziggy-js';
import { formatCurrency } from '@/Helpers/formatCurrency';
import type { Order } from '@/types';

type Props = {
    activeOrders: Order[];
    attendedOrders: Order[];
};

export default function WorkerDashboard({
    activeOrders,
    attendedOrders,
}: Props) {
    return (
        <div className="space-y-10">
            <section className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                            <Flame size={22} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold tracking-[-0.01em] text-stone-900">
                                Órdenes activas
                            </h2>
                            <p className="text-sm text-stone-500">
                                {activeOrders.length}{' '}
                                {activeOrders.length === 1
                                    ? 'mesa en servicio'
                                    : 'mesas en servicio'}
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route('orders.create')}
                        className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97]"
                    >
                        <ClipboardList size={16} /> Nueva orden
                    </Link>
                </div>

                {activeOrders.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {activeOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={route('orders.show', order.id)}
                                className="group relative overflow-hidden rounded-[28px] border border-orange-500/10 bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-orange-500/25 hover:shadow-[0_20px_45px_-18px_rgba(234,88,12,0.25)]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold tracking-wide text-stone-400 uppercase">
                                            Mesa
                                        </p>
                                        <p className="mt-1 text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-stone-900">
                                            {order.table_number}
                                        </p>
                                    </div>

                                    <ChevronRight
                                        size={18}
                                        className="mt-1 text-stone-300 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:text-orange-500"
                                    />
                                </div>

                                <div className="mt-5 space-y-1 border-t border-stone-900/[0.06] pt-4">
                                    <p className="text-sm text-stone-500">
                                        Cliente:{' '}
                                        <span className="font-semibold capitalize text-stone-800">
                                            {order.customer?.name ??
                                                'Sin cliente'}
                                        </span>
                                    </p>
                                    <p className="text-sm text-stone-500">
                                        Platillos:{' '}
                                        <span className="font-semibold text-stone-800">
                                            {order.items.length}
                                        </span>
                                    </p>
                                    <p className="text-sm text-stone-500">
                                        Total:{' '}
                                        <span className="font-semibold text-orange-600">
                                            {formatCurrency(order.total)}
                                        </span>
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-stone-200 bg-stone-50/60 px-6 py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-300 shadow-sm">
                            <Flame size={22} />
                        </div>
                        <p className="text-sm font-medium text-stone-400">
                            No tienes órdenes activas en este momento
                        </p>
                        <p className="text-xs text-stone-400">
                            Crea una nueva orden para comenzar a atender
                        </p>
                    </div>
                )}
            </section>

            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
                        <History size={22} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold tracking-[-0.01em] text-stone-900">
                            Órdenes atendidas
                        </h2>
                        <p className="text-sm text-stone-500">
                            {attendedOrders.length}{' '}
                            {attendedOrders.length === 1
                                ? 'orden cerrada'
                                : 'órdenes cerradas'}
                        </p>
                    </div>
                </div>

                {attendedOrders.length > 0 ? (
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
                                    <th className="px-6 py-4 font-semibold">
                                        Cliente
                                    </th>
                                    <th className="hidden px-6 py-4 font-semibold sm:table-cell">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-4 text-right font-semibold">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendedOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b border-stone-900/[0.04] transition-colors duration-200 ease-out last:border-0 hover:bg-orange-50/50"
                                    >
                                        <td className="px-6 py-4 font-medium text-stone-800">
                                            {order.folio ??
                                                `#${order.id}`}
                                        </td>
                                        <td className="px-6 py-4 text-stone-600">
                                            Mesa {order.table_number}
                                        </td>
                                        <td className="px-6 py-4 capitalize text-stone-600">
                                            {order.customer?.name ?? '—'}
                                        </td>
                                        <td className="hidden px-6 py-4 text-stone-500 sm:table-cell">
                                            {new Date(
                                                order.created_at,
                                            ).toLocaleDateString('es-MX', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-orange-600">
                                            {formatCurrency(order.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-stone-200 bg-stone-50/60 px-6 py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-300 shadow-sm">
                            <History size={22} />
                        </div>
                        <p className="text-sm font-medium text-stone-400">
                            Aún no has atendido ninguna orden
                        </p>
                        <p className="text-xs text-stone-400">
                            Cuando cierres una mesa aparecerá aquí
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

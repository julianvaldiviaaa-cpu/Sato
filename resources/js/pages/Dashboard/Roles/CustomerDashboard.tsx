import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    ClipboardList,
    CookingPot,
    History,
    KeyRound,
    Soup,
} from 'lucide-react';
import { route } from 'ziggy-js';
import { formatCurrency } from '@/Helpers/formatCurrency';
import type { Order } from '@/types';

type Props = {
    activeOrder: Order | null;
    orders: Order[];
};

const statusLabel: Record<string, string> = {
    open: 'En curso',
    completed: 'Completada',
    cancelled: 'Cancelada',
};

export default function CustomerDashboard({
    activeOrder,
    orders,
}: Props) {
    return (
        <div className="space-y-10">
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                        <CookingPot size={22} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold tracking-[-0.01em] text-stone-900">
                            Tu orden actual
                        </h2>
                        <p className="text-sm text-stone-500">
                            El mesero te atiende en la mesa{' '}
                            {activeOrder?.table_number ?? '—'}
                        </p>
                    </div>
                </div>

                {activeOrder ? (
                    <div className="group relative overflow-hidden rounded-[28px] border border-orange-500/10 bg-white/70 p-8 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-orange-500/25 hover:shadow-[0_20px_45px_-18px_rgba(234,88,12,0.25)]">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-center gap-5">
                                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-orange-100 text-orange-600">
                                    <Soup size={28} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold tracking-wide text-orange-500 uppercase">
                                        Mesa {activeOrder.table_number}
                                    </p>
                                    <h3 className="mt-1 text-3xl leading-[1.05] font-semibold tracking-[-0.02em] text-stone-900">
                                        {activeOrder.items.length}{' '}
                                        {activeOrder.items.length === 1
                                            ? 'platillo'
                                            : 'platillos'}
                                    </h3>
                                    <p className="mt-1 text-sm text-stone-500">
                                        Atendido por {activeOrder.worker.name}{' '}
                                        {activeOrder.worker.last_name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-start gap-4 sm:items-end">
                                <p className="text-3xl font-bold tracking-[-0.02em] text-orange-600">
                                    {formatCurrency(activeOrder.total)}
                                </p>
                                <Link
                                    href={route(
                                        'orders.show',
                                        activeOrder.id,
                                    )}
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97]"
                                >
                                    Ver mi orden
                                    <ArrowRight
                                        size={15}
                                        className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-stone-200 bg-stone-50/60 px-6 py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-300 shadow-sm">
                            <KeyRound size={22} />
                        </div>
                        <p className="text-sm font-medium text-stone-400">
                            Aún no tienes una orden activa
                        </p>
                        <p className="text-xs text-stone-400">
                            Pide a tu mesero el código para unirte a la orden
                        </p>

                        <Link
                            href={route('orders.create')}
                            className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97]"
                        >
                            <ClipboardList size={16} /> Ingresar código
                        </Link>
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
                            Tus órdenes
                        </h2>
                        <p className="text-sm text-stone-500">
                            {orders.length}{' '}
                            {orders.length === 1 ? 'orden registrada' : 'órdenes registradas'}
                        </p>
                    </div>
                </div>

                {orders.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                href={route('orders.show', order.id)}
                                className="group rounded-[24px] border border-stone-900/[0.06] bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-orange-500/20 hover:shadow-[0_16px_35px_-18px_rgba(234,88,12,0.2)]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-xs font-semibold tracking-wide text-stone-400 uppercase">
                                        Mesa {order.table_number}
                                    </p>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${
                                            order.status === 'open'
                                                ? 'bg-orange-100 text-orange-600'
                                                : order.status === 'completed'
                                                  ? 'bg-emerald-100 text-emerald-600'
                                                  : 'bg-red-100 text-red-500'
                                        }`}
                                    >
                                        {statusLabel[order.status]}
                                    </span>
                                </div>

                                <p className="mt-4 text-2xl font-bold tracking-[-0.02em] text-stone-900">
                                    {formatCurrency(order.total)}
                                </p>
                                <p className="mt-1 text-sm text-stone-500">
                                    {new Date(
                                        order.created_at,
                                    ).toLocaleDateString('es-MX', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </p>

                                <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-orange-600">
                                    Ver detalle
                                    <ArrowRight
                                        size={14}
                                        className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                                    />
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-stone-200 bg-stone-50/60 px-6 py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-300 shadow-sm">
                            <History size={22} />
                        </div>
                        <p className="text-sm font-medium text-stone-400">
                            Aún no tienes órdenes registradas
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

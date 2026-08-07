import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Box,
    Calendar,
    CalendarDays,
    CalendarRange,
    CalendarClock,
    FolderOpen,
    Plus,
    UtensilsCrossed,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { route } from 'ziggy-js';
import { formatCurrency } from '@/Helpers/formatCurrency';

type OrderPeriod = {
    count: number;
    total: number;
};

type PeriodKey = 'today' | 'week' | 'month' | 'year';

type PeriodItem = {
    key: PeriodKey;
    label: string;
    icon: LucideIcon;
};

type Props = {
    stats: {
        categories: number;
        ingredients: number;
        saucers: number;
    };
    orderStats?: {
        today: OrderPeriod;
        week: OrderPeriod;
        month: OrderPeriod;
        year: OrderPeriod;
    };
};

export default function AdminDashboard({ stats, orderStats }: Props) {
    const periods: PeriodItem[] = orderStats
        ? [
              { key: 'today', label: 'Hoy', icon: Calendar },
              { key: 'week', label: 'Esta semana', icon: CalendarRange },
              { key: 'month', label: 'Este mes', icon: CalendarDays },
              { key: 'year', label: 'Este año', icon: CalendarClock },
          ]
        : [];

    return (
        <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <Link
                    href={route('categories')}
                    className="group relative overflow-hidden rounded-[28px] border border-stone-900/[0.06] bg-white/70 p-7 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-orange-500/20 hover:shadow-[0_20px_45px_-18px_rgba(234,88,12,0.25)]"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition-colors duration-300 ease-out group-hover:bg-orange-600 group-hover:text-white">
                            <FolderOpen size={26} />
                        </div>

                        <ArrowRight
                            size={18}
                            className="text-stone-300 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:text-orange-500"
                        />
                    </div>

                    <p className="mt-7 text-xs font-semibold tracking-wide text-stone-400 uppercase">
                        Categorías
                    </p>

                    <h2 className="mt-1 text-6xl font-semibold tracking-[-0.03em] text-stone-900">
                        {stats.categories}
                    </h2>

                    <p className="mt-3 text-sm text-stone-500">
                        Categorías registradas en el sistema.
                    </p>
                </Link>

                <Link
                    href={route('ingredients')}
                    className="group relative overflow-hidden rounded-[28px] border border-stone-900/[0.06] bg-white/70 p-7 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-orange-500/20 hover:shadow-[0_20px_45px_-18px_rgba(234,88,12,0.25)]"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition-colors duration-300 ease-out group-hover:bg-orange-600 group-hover:text-white">
                            <Box size={26} />
                        </div>

                        <ArrowRight
                            size={18}
                            className="text-stone-300 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:text-orange-500"
                        />
                    </div>

                    <p className="mt-7 text-xs font-semibold tracking-wide text-stone-400 uppercase">
                        Ingredientes
                    </p>

                    <h2 className="mt-1 text-6xl font-semibold tracking-[-0.03em] text-stone-900">
                        {stats.ingredients}
                    </h2>

                    <p className="mt-3 text-sm text-stone-500">
                        Ingredientes en tu inventario.
                    </p>
                </Link>

                <div className="relative overflow-hidden rounded-[28px] border border-stone-900/[0.06] bg-white/70 p-7 backdrop-blur-xl">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                        <UtensilsCrossed size={26} />
                    </div>

                    <p className="mt-7 text-xs font-semibold tracking-wide text-stone-400 uppercase">
                        Platillos
                    </p>

                    <h2 className="mt-1 text-6xl font-semibold tracking-[-0.03em] text-stone-900">
                        {stats.saucers}
                    </h2>

                    <p className="mt-3 text-sm text-stone-500">
                        Platillos repartidos en tus categorías.
                    </p>
                </div>
            </div>

            {periods.length > 0 && (
                <section className="space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                            <CalendarClock size={22} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold tracking-[-0.01em] text-stone-900">
                                Órdenes por período
                            </h2>
                            <p className="text-sm text-stone-500">
                                Órdenes registradas y su importe acumulado.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {periods.map((period) => {
                            const Icon = period.icon;
                            const data = orderStats![period.key];

                            return (
                                <Link
                                    key={period.key}
                                    href={route(
                                        'dashboard.orders',
                                        period.key,
                                    )}
                                    className="group relative rounded-[24px] border border-stone-900/[0.06] bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-orange-500/20 hover:shadow-[0_16px_35px_-18px_rgba(234,88,12,0.2)]"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition-colors duration-300 ease-out group-hover:bg-orange-600 group-hover:text-white">
                                                <Icon size={20} />
                                            </div>
                                            <p className="text-xs font-semibold tracking-wide text-stone-400 uppercase">
                                                {period.label}
                                            </p>
                                        </div>
                                        <ArrowRight
                                            size={16}
                                            className="text-stone-300 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:text-orange-500"
                                        />
                                    </div>

                                    <p className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-stone-900">
                                        {data.count}
                                    </p>
                                    <p className="text-sm text-stone-500">
                                        {data.count === 1
                                            ? 'orden'
                                            : 'órdenes'}
                                    </p>

                                    <p className="mt-2 text-base font-semibold text-orange-600">
                                        {formatCurrency(data.total)}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            <div className="flex flex-col gap-6 rounded-[28px] border border-orange-500/10 bg-white/70 p-8 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.01em] text-stone-900">
                        Comienza a organizar tu menú
                    </h2>

                    <p className="mt-2 text-sm text-stone-500">
                        Crea categorías para clasificar tus platillos de una
                        forma sencilla.
                    </p>
                </div>

                <Link
                    href={route('categories.create')}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97]"
                >
                    <Plus size={16} />
                    Nueva categoría
                </Link>
            </div>
        </div>
    );
}

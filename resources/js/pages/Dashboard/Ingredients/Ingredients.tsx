import { Button } from '@heroui/react';
import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Package,
    Pencil,
    Plus,
} from 'lucide-react';
import { route } from 'ziggy-js';
import { formatCurrency } from '@/Helpers/formatCurrency';
import AppLayout from '@/pages/Layouts/AppLayout';
import type { Ingredient, Paginated } from '@/types';

type Props = {
    ingredients: Paginated<Ingredient>;
};

export default function Ingredients({ ingredients }: Props) {
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
                            Inventario
                        </p>
                        <h1 className="mt-1 text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-stone-900 sm:text-6xl">
                            Ingredientes
                        </h1>
                        <p className="mt-3 text-base text-stone-500">
                            {ingredients.total}{' '}
                            {ingredients.total === 1
                                ? 'ingrediente'
                                : 'ingredientes'}{' '}
                            en tu inventario
                        </p>
                    </div>

                    <Button
                        onClick={() => router.get(route('ingredients.create'))}
                        className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97]"
                    >
                        <Plus size={16} /> Nuevo ingrediente
                    </Button>
                </div>

                {ingredients.data.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {ingredients.data.map((ingredient) => (
                            <div
                                key={ingredient.id}
                                className="group relative flex flex-col overflow-hidden rounded-[28px] border border-stone-900/[0.06] bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-orange-500/20 hover:shadow-[0_20px_45px_-18px_rgba(234,88,12,0.25)]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition-colors duration-300 ease-out group-hover:bg-orange-600 group-hover:text-white">
                                        <Package size={22} />
                                    </div>

                                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-stone-500 uppercase">
                                        {ingredient.stock} {ingredient.unit}
                                    </span>
                                </div>

                                <h2 className="mt-5 text-xl font-semibold tracking-[-0.01em] text-stone-900 capitalize">
                                    {ingredient.name}
                                </h2>

                                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-stone-500">
                                    {ingredient.description ||
                                        'Sin descripción.'}
                                </p>

                                <p className="mt-4 text-2xl font-bold tracking-[-0.02em] text-orange-600">
                                    {formatCurrency(ingredient.cost)}
                                </p>

                                <div className="mt-5 flex items-center gap-2.5">
                                    <Link
                                        href={route(
                                            'ingredients.show',
                                            ingredient.slug,
                                        )}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-500/25 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97]"
                                    >
                                        Ver
                                        <ArrowRight size={15} />
                                    </Link>

                                    <Link
                                        href={route(
                                            'ingredients.edit',
                                            ingredient.slug,
                                        )}
                                        className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white/60 px-4 py-2.5 text-sm font-semibold text-stone-600 backdrop-blur-xl transition-all duration-300 ease-out hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-[0.97]"
                                    >
                                        <Pencil size={15} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-stone-200 bg-stone-50/60 px-6 py-20 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-300 shadow-sm">
                            <Package size={22} />
                        </div>
                        <p className="text-sm font-medium text-stone-400">
                            Aún no tienes ingredientes registrados
                        </p>
                        <p className="text-xs text-stone-400">
                            Usa "Nuevo ingrediente" para crear el primero
                        </p>
                    </div>
                )}

                {ingredients.links.length > 3 && (
                    <div className="flex justify-center pt-2">
                        <div className="flex items-center gap-1 rounded-2xl border border-stone-900/[0.06] bg-white/70 p-1.5 shadow-sm backdrop-blur-xl">
                            {ingredients.links.map((link, index) => {
                                const isPrev = link.label.includes('Previous');
                                const isNext = link.label.includes('Next');

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
            </div>
        </AppLayout>
    );
}

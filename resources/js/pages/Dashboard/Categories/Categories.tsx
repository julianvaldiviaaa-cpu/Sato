import { Button } from '@heroui/react';
import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Tag,
} from 'lucide-react';
import { route } from 'ziggy-js';
import AppLayout from '@/pages/Layouts/AppLayout';
import type { Category, Paginated } from '@/types';

type Props = {
    categories: Paginated<Category>;
};

export default function Categories({ categories }: Props) {
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

                <div>
                    <h1 className="text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-stone-900 sm:text-6xl">
                        Categorías
                    </h1>

                    <p className="mt-3 text-base text-stone-500">
                        {categories.data.length} categor
                        {categories.data.length === 1 ? 'ía' : 'ías'} en tu menú
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {categories.data.map((category) => (
                        <div
                            key={category.id}
                            className="group relative overflow-hidden rounded-[28px] border border-stone-900/[0.06] bg-white/70 p-7 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-orange-500/20 hover:shadow-[0_20px_45px_-18px_rgba(234,88,12,0.25)]"
                        >
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition-colors duration-300 ease-out group-hover:bg-orange-600 group-hover:text-white">
                                <Tag size={24} />
                            </div>

                            <h2 className="text-2xl font-semibold tracking-[-0.01em] text-stone-900 capitalize">
                                {category.name}
                            </h2>

                            <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-stone-500">
                                {category.description ?? 'Sin descripción.'}
                            </p>

                            <div className="mt-7 flex items-center gap-2.5">
                                <Link
                                    href={route(
                                        'categories.show',
                                        category.slug,
                                    )}
                                    className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-500/25 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97]"
                                >
                                    Ver
                                    <ArrowRight
                                        size={15}
                                        className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                                    />
                                </Link>

                                <Link
                                    href={route(
                                        'categories.edit',
                                        category.slug,
                                    )}
                                    className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white/60 px-4 py-2.5 text-sm font-semibold text-stone-600 backdrop-blur-xl transition-all duration-300 ease-out hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-[0.97]"
                                >
                                    <Pencil size={15} />
                                    Editar
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {categories.links.length > 3 && (
                    <div className="flex justify-center pt-2">
                        <div className="flex items-center gap-1 rounded-2xl border border-stone-900/[0.06] bg-white/70 p-1.5 shadow-sm backdrop-blur-xl">
                            {categories.links.map((link, index) => {
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

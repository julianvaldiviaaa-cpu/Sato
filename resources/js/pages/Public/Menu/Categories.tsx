import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/Helpers/formatCurrency';
import AppLayout from '@/pages/Layouts/AppLayout';
import type { Category, Paginated } from '@/types';

type Props = {
    categories: Paginated<Category>;
};

export default function Categories({ categories }: Props) {
    return (
        <AppLayout>
            <div className="space-y-14">
                <div>
                    <p className="text-xs font-semibold tracking-wide text-orange-500 uppercase">
                        Menú
                    </p>
                    <h1 className="mt-1 text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-stone-900 sm:text-6xl">
                        Todas las categorías
                    </h1>
                    <p className="mt-3 text-base text-stone-500">
                        {categories.total}{' '}
                        {categories.total === 1 ? 'categoría' : 'categorías'}{' '}
                        con todos sus platillos
                    </p>
                </div>

                <div className="space-y-16">
                    {categories.data.map((category) => (
                        <section key={category.id}>
                            <div className="flex items-baseline justify-between gap-4 border-b border-stone-900/[0.06] pb-4">
                                <h2 className="text-3xl font-semibold tracking-[-0.02em] text-stone-900 capitalize">
                                    {category.name}
                                </h2>
                                <span className="shrink-0 text-xs font-medium tracking-wide text-stone-400 uppercase">
                                    {category.saucers.length}{' '}
                                    {category.saucers.length === 1
                                        ? 'platillo'
                                        : 'platillos'}
                                </span>
                            </div>

                            {category.description && (
                                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-500">
                                    {category.description}
                                </p>
                            )}

                            {category.saucers.length > 0 ? (
                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    {category.saucers.map((saucer) => (
                                        <div
                                            key={saucer.id}
                                            className="flex items-start justify-between gap-4 rounded-[24px] border border-stone-900/[0.06] bg-white/70 p-5 backdrop-blur-xl transition-all duration-300 ease-out hover:border-orange-500/20 hover:shadow-[0_16px_35px_-16px_rgba(234,88,12,0.2)]"
                                        >
                                            <div>
                                                <h3 className="text-lg font-semibold tracking-[-0.01em] text-stone-900 capitalize">
                                                    {saucer.name}
                                                </h3>
                                                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-stone-500">
                                                    {saucer.description}
                                                </p>
                                            </div>

                                            <span className="shrink-0 text-lg font-bold tracking-[-0.02em] text-orange-600">
                                                {formatCurrency(saucer.price)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-6 text-sm text-stone-400">
                                    Todavía no hay platillos en esta categoría.
                                </p>
                            )}
                        </section>
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

import { Button, Modal, Tooltip } from '@heroui/react';
import { router } from '@inertiajs/react';
import {
    ChevronLeft,
    Pencil,
    Plus,
    Trash2,
    UtensilsCrossed,
} from 'lucide-react';
import { route } from 'ziggy-js';
import { formatCurrency } from '@/Helpers/formatCurrency';
import AppLayout from '@/pages/Layouts/AppLayout';
import type { Category, Saucer } from '@/types';

type Props = {
    category: Category;
};

export default function CategoryShow({ category }: Props) {
    const handleSaucerStatusUpdate = (
        category: Category,
        saucer: Saucer,
        available: boolean,
    ) => {
        router.patch(
            route('saucers.status', { category, saucer }),
            { available },
            { preserveScroll: true },
        );
    };

    return (
        <AppLayout>
            <div className="space-y-10">
                <Button
                    onClick={() => router.get(route('categories'))}
                    className="group flex items-center gap-1.5 rounded-full border border-stone-200/70 bg-white/60 py-2 pr-4 pl-2.5 text-sm font-medium text-stone-500 backdrop-blur-xl transition-all duration-300 ease-out hover:border-orange-200 hover:bg-white hover:text-orange-600 active:scale-95"
                >
                    <ChevronLeft
                        size={16}
                        className="transition-transform duration-300 ease-out group-hover:-translate-x-0.5"
                    />
                    Todas las categorías
                </Button>

                {/* Encabezado */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-wide text-orange-500 uppercase">
                            Categoría
                        </p>
                        <h1 className="mt-1 text-6xl leading-[1.02] font-semibold tracking-[-0.03em] text-stone-900 capitalize sm:text-7xl">
                            {category.name}
                        </h1>
                    </div>

                    <div className="rounded-[24px] border border-orange-500/10 bg-white/70 p-5 backdrop-blur-xl lg:max-w-md">
                        <p className="text-xs font-semibold tracking-wide text-stone-400 uppercase">
                            Descripción
                        </p>
                        <p className="mt-1.5 text-[15px] leading-relaxed text-stone-600">
                            {category.description ?? 'Sin descripción.'}
                        </p>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        onClick={() =>
                            router.get(route('saucers.create', category))
                        }
                        className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97]"
                    >
                        <Plus size={16} /> Añadir platillo
                    </Button>

                    <Button
                        onClick={() =>
                            router.get(route('categories.edit', category))
                        }
                        className="flex items-center justify-center gap-2 rounded-2xl border border-orange-500/15 bg-white/80 px-5 py-3 text-sm font-semibold tracking-tight text-orange-600 backdrop-blur-xl transition-all duration-300 ease-out hover:bg-orange-50 active:scale-[0.97]"
                    >
                        <Pencil size={15} /> Editar categoría
                    </Button>

                    <Modal>
                        <Button
                            variant="danger"
                            className="flex items-center justify-center gap-2 rounded-2xl bg-transparent px-4 py-3 text-sm font-medium text-red-500/80 transition-all duration-300 ease-out hover:bg-red-50 hover:text-red-500 active:scale-[0.97]"
                        >
                            <Trash2 size={15} /> Eliminar categoría
                        </Button>

                        <Modal.Backdrop className="bg-stone-900/30 backdrop-blur-sm">
                            <Modal.Container>
                                <Modal.Dialog className="rounded-[1.75rem] border border-white/60 bg-white/90 shadow-2xl backdrop-blur-2xl sm:max-w-sm">
                                    <Modal.CloseTrigger />
                                    <Modal.Header>
                                        <Modal.Icon className="bg-red-100 text-red-500">
                                            <Trash2 size={18} />
                                        </Modal.Icon>
                                        <Modal.Heading className="text-lg font-semibold tracking-tight text-stone-900">
                                            Eliminar esta categoría
                                        </Modal.Heading>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p className="text-sm leading-relaxed text-stone-500">
                                            ¿Deseas eliminar esta categoría de
                                            comida? Esta acción no se puede
                                            deshacer más adelante.
                                        </p>
                                    </Modal.Body>
                                    <Modal.Footer className="flex w-full gap-3">
                                        <Button
                                            variant="secondary"
                                            className="w-full rounded-xl transition-transform duration-300 ease-out active:scale-[0.97]"
                                            slot="close"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                router.delete(
                                                    route(
                                                        'categories.destroy',
                                                        category,
                                                    ),
                                                )
                                            }
                                            variant="danger"
                                            className="w-full rounded-xl bg-red-500 text-white transition-all duration-300 ease-out active:scale-[0.97]"
                                        >
                                            <Trash2 size={16} /> Eliminar
                                        </Button>
                                    </Modal.Footer>
                                </Modal.Dialog>
                            </Modal.Container>
                        </Modal.Backdrop>
                    </Modal>
                </div>

                {/* Platillos */}
                <div>
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold tracking-[-0.01em] text-stone-900">
                            Platillos
                        </h2>
                        <span className="text-xs font-medium tracking-wide text-stone-400 uppercase">
                            {category.saucers.length}{' '}
                            {category.saucers.length === 1
                                ? 'platillo'
                                : 'platillos'}
                        </span>
                    </div>

                    {category.saucers.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                            {category.saucers.map((saucer) => (
                                <div
                                    key={saucer.id}
                                    className="group flex flex-col rounded-[28px] border border-stone-900/[0.06] bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-orange-500/20 hover:shadow-[0_20px_45px_-18px_rgba(234,88,12,0.25)]"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-xl font-semibold tracking-[-0.01em] text-stone-900 capitalize">
                                            {saucer.name}
                                        </h3>

                                        <Tooltip delay={0}>
                                            <Button
                                                onClick={() =>
                                                    handleSaucerStatusUpdate(
                                                        category,
                                                        saucer,
                                                        !saucer.available,
                                                    )
                                                }
                                                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-tight backdrop-blur-xl transition-all duration-300 ease-out active:scale-95 ${
                                                    saucer.available
                                                        ? 'border-orange-500/15 bg-orange-50/80 text-orange-600 hover:bg-orange-100/80'
                                                        : 'border-red-500/15 bg-red-50/80 text-red-500 hover:bg-red-100/80'
                                                }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${saucer.available ? 'bg-orange-500' : 'bg-red-400'}`}
                                                />
                                                {saucer.available
                                                    ? 'Disponible'
                                                    : 'No disponible'}
                                            </Button>
                                            <Tooltip.Content className="rounded-lg bg-stone-900/90 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-xl">
                                                Cambiar a{' '}
                                                {saucer.available
                                                    ? 'no disponible'
                                                    : 'disponible'}
                                            </Tooltip.Content>
                                        </Tooltip>
                                    </div>

                                    <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-stone-500">
                                        {saucer.description}
                                    </p>

                                    <p className="mt-4 text-2xl font-bold tracking-[-0.02em] text-orange-600">
                                        {formatCurrency(saucer.price)}
                                    </p>

                                    <Button
                                        onClick={() =>
                                            router.get(
                                                route('saucers.manage', {
                                                    category,
                                                    saucer,
                                                }),
                                            )
                                        }
                                        className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-2.5 text-sm font-semibold tracking-tight text-white shadow-sm shadow-orange-500/25 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97]"
                                    >
                                        Ver platillo
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-stone-200 bg-stone-50/60 px-6 py-20 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-300 shadow-sm">
                                <UtensilsCrossed size={22} />
                            </div>
                            <p className="text-sm font-medium text-stone-400">
                                Aún no hay platillos en esta categoría
                            </p>
                            <p className="text-xs text-stone-400">
                                Usa "Añadir platillo" para crear el primero
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

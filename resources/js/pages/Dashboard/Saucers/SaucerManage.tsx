import { Button, Modal, Tooltip } from '@heroui/react';
import { router, useForm } from '@inertiajs/react';
import {
    ChefHat,
    ChevronLeft,
    ChevronRight,
    ImageOff,
    ImageUp,
    Package,
    Pencil,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';
import { formatCurrency } from '@/Helpers/formatCurrency';
import AppLayout from '@/pages/Layouts/AppLayout';
import type { Category, Ingredient, Saucer, SaucerIngredient } from '@/types';

type Props = {
    category: Category;
    saucer: Saucer;
    ingredients: Ingredient[];
};

export default function SaucerManage({ category, saucer, ingredients }: Props) {
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

    const { data, setData, post, processing, reset, errors } = useForm({
        image: null as File | null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const previewUrlRef = useRef<string | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
            }
        };
    }, []);

    const setImage = (image: File | null) => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }

        const nextPreviewUrl = image ? URL.createObjectURL(image) : null;

        previewUrlRef.current = nextPreviewUrl;
        setPreviewUrl(nextPreviewUrl);
        setData('image', image);
    };

    const handleUploadImage = () => {
        post(route('saucers.images.store', { category, saucer }), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setImage(null);
            },
        });
    };

    const addedIngredientIds = new Set(
        saucer.ingredients?.map((ingredient) => ingredient.id) ?? [],
    );
    const availableIngredients = ingredients.filter(
        (ingredient) => !addedIngredientIds.has(ingredient.id),
    );

    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [drafts, setDrafts] = useState<Record<number, string>>({});
    const [savingId, setSavingId] = useState<number | null>(null);

    const quantityStep = (unit: Ingredient['unit']) =>
        unit === 'piece' ? 1 : 0.5;

    const draftFor = (ingredient: SaucerIngredient) =>
        drafts[ingredient.id] ?? String(ingredient.pivot.quantity);

    const isDirty = (ingredient: SaucerIngredient) => {
        if (drafts[ingredient.id] === undefined) {
            return false;
        }

        return (
            Number(drafts[ingredient.id]) !== Number(ingredient.pivot.quantity)
        );
    };

    const setDraft = (id: number, value: string) =>
        setDrafts((prev) => ({ ...prev, [id]: value }));

    const stepDraft = (ingredient: SaucerIngredient, delta: number) => {
        const step = quantityStep(ingredient.unit);
        const current = Number(draftFor(ingredient)) || 0;
        const next = Math.max(
            0.01,
            Math.round((current + delta * step) * 100) / 100,
        );

        setDraft(ingredient.id, String(next));
    };

    const saveQuantity = (ingredient: SaucerIngredient) => {
        setSavingId(ingredient.id);

        router.patch(
            route('saucers.ingredients.update', {
                category,
                saucer,
                ingredient,
            }),
            { quantity: Number(draftFor(ingredient)) },
            {
                preserveScroll: true,
                onSuccess: () =>
                    setDrafts((prev) => {
                        const next = { ...prev };
                        delete next[ingredient.id];

                        return next;
                    }),
                onFinish: () => setSavingId(null),
            },
        );
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-6xl">
                {/* Navegación */}
                <Button
                    onClick={() =>
                        router.get(route('categories.show', category))
                    }
                    className="group mb-8 flex items-center gap-1.5 rounded-full border border-stone-200/70 bg-white/60 py-2 pr-4 pl-2.5 text-sm font-medium text-stone-500 backdrop-blur-xl transition-all duration-300 ease-out hover:border-orange-200 hover:bg-white hover:text-orange-600 active:scale-95"
                >
                    <ChevronLeft
                        size={16}
                        className="transition-transform duration-300 ease-out group-hover:-translate-x-0.5"
                    />
                    {category.name}
                </Button>

                {/* Layout principal: info + galería */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                    {/* Panel de información */}
                    <div className="lg:col-span-2">
                        <div className="rounded-[28px] border border-orange-500/10 bg-white/70 p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_45px_-18px_rgba(234,88,12,0.18)] backdrop-blur-xl">
                            <h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-stone-900 capitalize">
                                {saucer.name}
                            </h1>

                            <div className="mt-5">
                                <h3 className="text-xs font-semibold tracking-wide text-stone-400 uppercase">
                                    Precio
                                </h3>
                                <p className="mt-1 text-4xl font-bold tracking-[-0.02em] text-orange-600">
                                    {formatCurrency(saucer.price)}
                                </p>
                            </div>

                            <div className="mt-6 border-t border-stone-900/[0.06] pt-6">
                                <h3 className="text-xs font-semibold tracking-wide text-stone-400 uppercase">
                                    Descripción
                                </h3>
                                <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
                                    {saucer.description}
                                </p>
                            </div>

                            {/* Acciones */}
                            <div className="mt-8 grid grid-cols-2 gap-3">
                                <Button
                                    onClick={() =>
                                        router.get(
                                            route('saucers.edit', {
                                                category,
                                                saucer,
                                            }),
                                        )
                                    }
                                    className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 text-[15px] font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97]"
                                >
                                    <Pencil size={16} /> Editar platillo
                                </Button>

                                <Modal>
                                    <Button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-500/15 bg-white/80 py-3 text-sm font-semibold tracking-tight text-orange-600 backdrop-blur-xl transition-all duration-300 ease-out hover:bg-orange-50 active:scale-[0.97]">
                                        <ImageUp size={16} /> Imagen
                                    </Button>

                                    <Modal.Backdrop className="bg-stone-900/30 backdrop-blur-sm">
                                        <Modal.Container>
                                            <Modal.Dialog className="rounded-[1.75rem] border border-white/60 bg-white/90 shadow-2xl backdrop-blur-2xl sm:max-w-md">
                                                <Modal.CloseTrigger />

                                                <Modal.Header>
                                                    <Modal.Icon className="bg-orange-100 text-orange-600">
                                                        <ImageUp size={18} />
                                                    </Modal.Icon>

                                                    <Modal.Heading className="text-lg font-semibold tracking-tight text-stone-900">
                                                        Agregar imagen
                                                    </Modal.Heading>
                                                </Modal.Header>

                                                <Modal.Body>
                                                    <label className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/70 px-6 py-8 text-center transition-colors duration-300 ease-out hover:border-orange-300 hover:bg-orange-50/50">
                                                        {data.image &&
                                                        previewUrl ? (
                                                            <div className="flex flex-col items-center gap-3">
                                                                <img
                                                                    src={
                                                                        previewUrl
                                                                    }
                                                                    className="h-28 w-28 rounded-2xl object-cover shadow-sm"
                                                                />
                                                                <div className="flex max-w-[240px] items-center gap-2">
                                                                    <span className="truncate text-sm font-medium text-stone-700">
                                                                        {
                                                                            data
                                                                                .image
                                                                                .name
                                                                        }
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            setImage(null);
                                                                        }}
                                                                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-500 transition-colors duration-200 ease-out hover:bg-red-100 hover:text-red-500"
                                                                    >
                                                                        <X
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
                                                                <span className="text-xs text-stone-400">
                                                                    {(
                                                                        data
                                                                            .image
                                                                            .size /
                                                                        1024 /
                                                                        1024
                                                                    ).toFixed(
                                                                        2,
                                                                    )}{' '}
                                                                    MB — toca
                                                                    para
                                                                    cambiarla
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <ImageUp
                                                                    size={22}
                                                                    className="text-stone-400"
                                                                />
                                                                <span className="text-sm font-medium text-stone-500">
                                                                    Selecciona
                                                                    una imagen
                                                                </span>
                                                            </>
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) =>
                                                                setImage(
                                                                    e.target
                                                                        .files?.[0] ??
                                                                        null,
                                                                )
                                                            }
                                                        />
                                                    </label>

                                                    {errors.image && (
                                                        <p className="mt-3 text-sm font-medium text-red-500">
                                                            {errors.image}
                                                        </p>
                                                    )}
                                                </Modal.Body>

                                                <Modal.Footer className="flex gap-3">
                                                    <Button
                                                        slot="close"
                                                        variant="secondary"
                                                        className="w-full rounded-xl transition-transform duration-300 ease-out active:scale-[0.97]"
                                                    >
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        onClick={
                                                            handleUploadImage
                                                        }
                                                        isDisabled={processing}
                                                        className="w-full rounded-xl bg-orange-500 text-white transition-all duration-300 ease-out active:scale-[0.97] disabled:opacity-50"
                                                    >
                                                        {processing
                                                            ? 'Subiendo…'
                                                            : 'Subir'}
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal.Dialog>
                                        </Modal.Container>
                                    </Modal.Backdrop>
                                </Modal>

                                <Tooltip>
                                    <Button
                                        onClick={() =>
                                            handleSaucerStatusUpdate(
                                                category,
                                                saucer,
                                                !saucer.available,
                                            )
                                        }
                                        className={`flex w-full items-center justify-center gap-1.5 rounded-2xl border py-3 text-sm font-semibold tracking-tight backdrop-blur-xl transition-all duration-300 ease-out active:scale-[0.97] ${
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

                                <Modal>
                                    <Button
                                        variant="danger"
                                        className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-transparent py-2.5 text-sm font-medium text-red-500/80 transition-all duration-300 ease-out hover:bg-red-50 hover:text-red-500 active:scale-[0.97]"
                                    >
                                        <Trash2 size={15} /> Eliminar platillo
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
                                                        Eliminar este platillo
                                                    </Modal.Heading>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <p className="text-sm leading-relaxed text-stone-500">
                                                        ¿Deseas eliminar este
                                                        platillo? Esta acción no
                                                        se puede deshacer más
                                                        adelante.
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
                                                                    'saucers.destroy',
                                                                    {
                                                                        category,
                                                                        saucer,
                                                                    },
                                                                ),
                                                            )
                                                        }
                                                        variant="danger"
                                                        className="w-full rounded-xl bg-red-500 text-white transition-all duration-300 ease-out active:scale-[0.97]"
                                                    >
                                                        <Trash2 size={16} />{' '}
                                                        Eliminar
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal.Dialog>
                                        </Modal.Container>
                                    </Modal.Backdrop>
                                </Modal>
                            </div>
                        </div>
                    </div>

                    {/* Galería de imágenes */}
                    <div className="lg:col-span-3">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xs font-semibold tracking-wide text-stone-400 uppercase">
                                Imágenes
                            </h2>
                            <span className="text-xs font-medium text-stone-400">
                                {saucer.images?.length ?? 0}{' '}
                                {saucer.images?.length === 1 ? 'foto' : 'fotos'}
                            </span>
                        </div>

                        {saucer.images && saucer.images.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {saucer.images.map((image) => (
                                    <div
                                        key={image.id}
                                        className="group relative aspect-square overflow-hidden rounded-3xl border border-stone-900/5 bg-stone-100 shadow-sm transition-all duration-300 ease-out hover:shadow-lg"
                                    >
                                        <img
                                            src={`/storage/${image.image}`}
                                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                        />

                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />

                                        <Button
                                            isIconOnly
                                            className="absolute top-3 right-3 rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-xl transition-all duration-300 ease-out group-hover:opacity-100 active:scale-90"
                                            onClick={() =>
                                                router.delete(
                                                    route(
                                                        'saucers.images.destroy',
                                                        [
                                                            category,
                                                            saucer,
                                                            image,
                                                        ],
                                                    ),
                                                )
                                            }
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-stone-200 bg-stone-50/60 px-6 py-20 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-300 shadow-sm">
                                    <ImageOff size={22} />
                                </div>
                                <p className="text-sm font-medium text-stone-400">
                                    Aún no hay imágenes de este platillo
                                </p>
                                <p className="text-xs text-stone-400">
                                    Usa "Imagen" para subir la primera foto
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ingredientes */}
                <div className="mt-10">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xs font-semibold tracking-wide text-stone-400 uppercase">
                                Ingredientes
                            </h2>
                            <p className="mt-1 text-sm text-stone-500">
                                {saucer.ingredients?.length ?? 0}{' '}
                                {saucer.ingredients?.length === 1
                                    ? 'ingrediente'
                                    : 'ingredientes'}{' '}
                                en este platillo
                            </p>
                        </div>

                        <Modal>
                            <Button className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97]">
                                <Plus size={16} /> Añadir ingrediente
                            </Button>

                            <Modal.Backdrop className="bg-stone-900/30 backdrop-blur-sm">
                                <Modal.Container>
                                    <Modal.Dialog className="rounded-[1.75rem] border border-white/60 bg-white/90 shadow-2xl backdrop-blur-2xl sm:max-w-md">
                                        <Modal.CloseTrigger />
                                        <Modal.Header>
                                            <Modal.Icon className="bg-orange-100 text-orange-600">
                                                <Package size={18} />
                                            </Modal.Icon>
                                            <Modal.Heading className="text-lg font-semibold tracking-tight text-stone-900">
                                                Añadir ingrediente
                                            </Modal.Heading>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {availableIngredients.length > 0 ? (
                                                <div className="max-h-[48vh] space-y-2 overflow-y-auto pr-1">
                                                    {availableIngredients.map(
                                                        (ingredient) => (
                                                            <div
                                                                key={
                                                                    ingredient.id
                                                                }
                                                                className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200/70 bg-stone-50/60 px-4 py-3"
                                                            >
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="truncate text-sm font-semibold text-stone-800 capitalize">
                                                                        {
                                                                            ingredient.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-stone-400">
                                                                        {formatCurrency(
                                                                            ingredient.cost,
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <div className="flex shrink-0 items-center gap-1.5">
                                                                    <input
                                                                        type="number"
                                                                        min="0.01"
                                                                        step="0.01"
                                                                        value={
                                                                            quantities[
                                                                                ingredient
                                                                                    .id
                                                                            ] ??
                                                                            1
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setQuantities(
                                                                                (
                                                                                    prev,
                                                                                ) => ({
                                                                                    ...prev,
                                                                                    [ingredient.id]:
                                                                                        Number(
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        ),
                                                                                }),
                                                                            )
                                                                        }
                                                                        className="w-20 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 transition-colors duration-200 ease-out outline-none focus:border-orange-400"
                                                                    />
                                                                    <span className="w-10 text-xs font-medium text-stone-400">
                                                                        {
                                                                            ingredient.unit
                                                                        }
                                                                    </span>
                                                                </div>

                                                                <Button
                                                                    isIconOnly
                                                                    aria-label={`Añadir ${ingredient.name}`}
                                                                    onClick={() =>
                                                                        router.post(
                                                                            route(
                                                                                'saucers.ingredients.store',
                                                                                {
                                                                                    category,
                                                                                    saucer,
                                                                                },
                                                                            ),
                                                                            {
                                                                                ingredient_id:
                                                                                    ingredient.id,
                                                                                quantity:
                                                                                    quantities[
                                                                                        ingredient
                                                                                            .id
                                                                                    ] ??
                                                                                    1,
                                                                            },
                                                                            {
                                                                                preserveScroll: true,
                                                                            },
                                                                        )
                                                                    }
                                                                    className="shrink-0 rounded-xl bg-orange-500 text-white transition-all duration-300 ease-out hover:bg-orange-600 active:scale-90"
                                                                >
                                                                    <Plus
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </Button>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/60 px-6 py-12 text-center">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-300 shadow-sm">
                                                        <Package size={20} />
                                                    </div>
                                                    <p className="text-sm font-medium text-stone-400">
                                                        Ya agregaste todos tus
                                                        ingredientes
                                                    </p>
                                                </div>
                                            )}
                                        </Modal.Body>
                                    </Modal.Dialog>
                                </Modal.Container>
                            </Modal.Backdrop>
                        </Modal>
                    </div>

                    {saucer.ingredients && saucer.ingredients.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {saucer.ingredients.map((ingredient) => (
                                <div
                                    key={ingredient.id}
                                    className="group flex flex-col rounded-[24px] border border-stone-900/[0.06] bg-white/70 p-5 backdrop-blur-xl transition-all duration-300 ease-out hover:border-orange-500/20 hover:shadow-[0_16px_35px_-18px_rgba(234,88,12,0.2)]"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                                <ChefHat size={20} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-[15px] font-semibold tracking-tight text-stone-900 capitalize">
                                                    {ingredient.name}
                                                </p>
                                                <p className="mt-0.5 text-xs text-stone-400">
                                                    {formatCurrency(
                                                        ingredient.cost,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            isIconOnly
                                            aria-label={`Quitar ${ingredient.name}`}
                                            onClick={() =>
                                                router.delete(
                                                    route(
                                                        'saucers.ingredients.destroy',
                                                        {
                                                            category,
                                                            saucer,
                                                            ingredient,
                                                        },
                                                    ),
                                                    { preserveScroll: true },
                                                )
                                            }
                                            className="shrink-0 rounded-xl border border-stone-200 bg-white/60 text-stone-400 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 active:scale-90"
                                        >
                                            <Trash2 size={15} />
                                        </Button>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2">
                                        <button
                                            type="button"
                                            aria-label={`Reducir cantidad de ${ingredient.name}`}
                                            onClick={() =>
                                                stepDraft(ingredient, -1)
                                            }
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100/80 text-stone-500 transition-all duration-200 ease-out hover:bg-orange-100 hover:text-orange-600 active:scale-90"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>

                                        <input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={draftFor(ingredient)}
                                            onChange={(e) =>
                                                setDraft(
                                                    ingredient.id,
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full min-w-0 rounded-xl border-2 border-transparent bg-stone-100/80 px-3 py-2 text-sm font-semibold text-stone-800 tabular-nums transition-colors duration-200 ease-out outline-none focus:border-orange-400 focus:bg-orange-50"
                                        />

                                        <span className="w-10 shrink-0 text-center text-xs font-medium text-stone-400">
                                            {ingredient.unit}
                                        </span>

                                        <button
                                            type="button"
                                            aria-label={`Aumentar cantidad de ${ingredient.name}`}
                                            onClick={() =>
                                                stepDraft(ingredient, 1)
                                            }
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100/80 text-stone-500 transition-all duration-200 ease-out hover:bg-orange-100 hover:text-orange-600 active:scale-90"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-900/[0.06] pt-4">
                                        <span
                                            className={`text-xs ${isDirty(ingredient) ? 'font-medium text-orange-600' : 'text-stone-400'}`}
                                        >
                                            {isDirty(ingredient)
                                                ? 'Tienes cambios sin guardar'
                                                : 'Todo guardado'}
                                        </span>

                                        <Button
                                            isDisabled={
                                                savingId !== null ||
                                                !isDirty(ingredient)
                                            }
                                            onClick={() =>
                                                saveQuantity(ingredient)
                                            }
                                            className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold tracking-tight text-white shadow-sm shadow-orange-500/25 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97] disabled:opacity-50"
                                        >
                                            {savingId === ingredient.id
                                                ? 'Guardando…'
                                                : 'Guardar'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-stone-200 bg-stone-50/60 px-6 py-16 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-300 shadow-sm">
                                <ChefHat size={22} />
                            </div>
                            <p className="text-sm font-medium text-stone-400">
                                Este platillo aún no tiene ingredientes
                            </p>
                            <p className="text-xs text-stone-400">
                                Usa "Añadir ingrediente" para agregar el primero
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

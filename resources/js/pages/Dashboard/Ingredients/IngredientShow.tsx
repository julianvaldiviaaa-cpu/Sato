import {
    Button,
    FieldError,
    Form,
    Input,
    Label,
    Modal,
    TextArea,
    TextField,
} from '@heroui/react';
import { router, useForm } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import type { SyntheticEvent } from 'react';
import { route } from 'ziggy-js';
import { formatCurrency } from '@/Helpers/formatCurrency';
import AppLayout from '@/pages/Layouts/AppLayout';
import type { Ingredient } from '@/types';

type Props = {
    ingredient: Ingredient;
};

// Mismas clases que en CategoryForm/SaucerForm/IngredientForm para mantener consistencia visual
const inputClasses =
    'w-full rounded-2xl border-2 border-transparent bg-stone-100/80 px-4 py-3 text-stone-900 placeholder:text-stone-400 outline-none transition-colors duration-200 ease-out data-[focused]:border-orange-400 data-[focused]:bg-orange-50 data-[invalid]:border-red-400';

const labelClasses =
    'text-xs font-semibold tracking-wide text-stone-400 uppercase';

export default function IngredientShow({ ingredient }: Props) {
    // "name" y "unit" viajan sin exponerse como inputs: no se editan aquí,
    // pero el backend (IngredientRequest) los exige como requeridos en cada
    // actualización, así que se mandan tal cual venían.
    const { data, setData, errors, clearErrors, processing, put, isDirty } =
        useForm({
            name: ingredient.name,
            description: ingredient.description ?? '',
            cost: ingredient.cost,
            stock: ingredient.stock,
            unit: ingredient.unit,
        });

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        put(route('ingredients.update', ingredient), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <div className="space-y-8">
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
                    <p className="text-xs font-semibold tracking-wide text-orange-500 uppercase">
                        Ingrediente
                    </p>
                    <h1 className="mt-1 text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-stone-900 capitalize sm:text-6xl">
                        {ingredient.name}
                    </h1>
                </div>

                <Form
                    onSubmit={handleSubmit}
                    className="max-w-xl space-y-5 rounded-[28px] border border-orange-500/10 bg-white/70 p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_45px_-18px_rgba(234,88,12,0.18)] backdrop-blur-xl"
                >
                    <TextField
                        name="description"
                        value={data.description}
                        onChange={(value) => {
                            setData('description', value);

                            if (errors.description) {
clearErrors('description');
}
                        }}
                        isInvalid={!!errors.description}
                        className="flex flex-col gap-1.5"
                    >
                        <Label className={labelClasses}>Descripción</Label>
                        <TextArea
                            placeholder="Describe este ingrediente"
                            rows={3}
                            className={inputClasses}
                        />
                        <FieldError className="text-sm font-medium text-red-500">
                            {errors.description}
                        </FieldError>
                    </TextField>

                    <div className="grid grid-cols-2 gap-5">
                        <TextField
                            isRequired
                            name="cost"
                            type="number"
                            value={String(data.cost)}
                            onChange={(value) => {
                                setData('cost', Number(value));

                                if (errors.cost) {
clearErrors('cost');
}
                            }}
                            isInvalid={!!errors.cost}
                            className="flex flex-col gap-1.5"
                        >
                            <Label className={labelClasses}>Costo</Label>
                            <Input
                                min={0}
                                step="0.01"
                                className={inputClasses}
                            />
                            <FieldError className="text-sm font-medium text-red-500">
                                {errors.cost}
                            </FieldError>
                        </TextField>

                        <TextField
                            isRequired
                            name="stock"
                            type="number"
                            value={String(data.stock)}
                            onChange={(value) => {
                                setData('stock', Number(value));

                                if (errors.stock) {
clearErrors('stock');
}
                            }}
                            isInvalid={!!errors.stock}
                            className="flex flex-col gap-1.5"
                        >
                            <Label className={labelClasses}>
                                Existencias ({ingredient.unit})
                            </Label>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData(
                                            'stock',
                                            Math.max(0, Number(data.stock) - 1),
                                        )
                                    }
                                    className="flex h-[46px] w-11 shrink-0 items-center justify-center rounded-2xl bg-stone-100/80 text-stone-500 transition-all duration-200 ease-out hover:bg-orange-100 hover:text-orange-600 active:scale-95"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <Input
                                    min={0}
                                    step="0.01"
                                    className={inputClasses}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData('stock', Number(data.stock) + 1)
                                    }
                                    className="flex h-[46px] w-11 shrink-0 items-center justify-center rounded-2xl bg-stone-100/80 text-stone-500 transition-all duration-200 ease-out hover:bg-orange-100 hover:text-orange-600 active:scale-95"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                            <FieldError className="text-sm font-medium text-red-500">
                                {errors.stock}
                            </FieldError>
                        </TextField>
                    </div>

                    <p className="text-sm text-stone-500">
                        Costo actual:{' '}
                        <span className="font-semibold text-orange-600">
                            {formatCurrency(data.cost)}
                        </span>
                    </p>

                    <div className="flex items-center justify-between gap-3 border-t border-stone-900/[0.06] pt-5">
                        <span className="text-xs text-stone-400">
                            {isDirty
                                ? 'Tienes cambios sin guardar'
                                : 'Todo guardado'}
                        </span>

                        <Button
                            type="submit"
                            isDisabled={processing || !isDirty}
                            className="flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97] disabled:opacity-50"
                        >
                            {processing ? 'Guardando…' : 'Guardar cambios'}
                        </Button>
                    </div>
                </Form>

                <Modal>
                    <Button
                        variant="danger"
                        className="flex items-center justify-center gap-2 rounded-2xl bg-transparent px-4 py-3 text-sm font-medium text-red-500/80 transition-all duration-300 ease-out hover:bg-red-50 hover:text-red-500 active:scale-[0.97]"
                    >
                        <Trash2 size={15} /> Eliminar ingrediente
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
                                        Eliminar este ingrediente
                                    </Modal.Heading>
                                </Modal.Header>
                                <Modal.Body>
                                    <p className="text-sm leading-relaxed text-stone-500">
                                        ¿Deseas eliminar este ingrediente de
                                        comida? Esta acción no se puede deshacer
                                        más adelante.
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
                                                route('ingredients.destroy', {
                                                    ingredient,
                                                }),
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
        </AppLayout>
    );
}

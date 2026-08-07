import {
    Button,
    FieldError,
    Form,
    Input,
    Label,
    TextArea,
    TextField,
} from '@heroui/react';
import { useForm } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import type { SyntheticEvent } from 'react';
import { route } from 'ziggy-js';
import type { Ingredient } from '@/types';

type Props = {
    ingredient?: Ingredient;
};

type Unit = 'kg' | 'g' | 'l' | 'ml' | 'piece';

const UNIT_OPTIONS: { value: Unit; label: string }[] = [
    { value: 'kg', label: 'Kilogramos (kg)' },
    { value: 'g', label: 'Gramos (g)' },
    { value: 'l', label: 'Litros (l)' },
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'piece', label: 'Piezas' },
];

// Mismas clases que en CategoryForm/SaucerForm para mantener consistencia visual
const inputClasses =
    'w-full rounded-2xl border-2 border-transparent bg-stone-100/80 px-4 py-3 text-stone-900 placeholder:text-stone-400 outline-none transition-colors duration-200 ease-out data-[focused]:border-orange-400 data-[focused]:bg-orange-50 data-[invalid]:border-red-400';

const selectClasses =
    'w-full appearance-none rounded-2xl border-2 border-transparent bg-stone-100/80 py-3 pr-11 pl-4 text-stone-900 outline-none transition-colors duration-200 ease-out focus:border-orange-400 focus:bg-orange-50';

const labelClasses =
    'text-xs font-semibold tracking-wide text-stone-400 uppercase';

export default function IngredientForm({ ingredient }: Props) {
    const { data, setData, errors, clearErrors, processing, post, put, reset } =
        useForm({
            name: ingredient?.name ?? '',
            description: ingredient?.description ?? '',
            cost: ingredient?.cost ?? 0,
            stock: ingredient?.stock ?? 0,
            unit: (ingredient?.unit as Unit) ?? 'kg',
        });

    const isEditing = !!ingredient;

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        if (ingredient) {
            put(route('ingredients.update', ingredient), {
                onSuccess: () => {
                    reset();
                },
                preserveScroll: true,
            });

            return;
        }

        post(route('ingredients.store'), {
            onSuccess: () => {
                reset();
            },
            preserveScroll: true,
        });
    };

    return (
        <Form
            onSubmit={handleSubmit}
            className="w-full rounded-[28px] border border-orange-500/10 bg-white/70 p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_45px_-18px_rgba(234,88,12,0.18)] backdrop-blur-xl sm:p-10"
        >
            <p className="text-xs font-semibold tracking-wide text-orange-500 uppercase">
                Inventario
            </p>
            <h2 className="mt-1 text-3xl leading-[1.05] font-semibold tracking-[-0.02em] text-stone-900 sm:text-4xl">
                {isEditing ? 'Editar ingrediente' : 'Nuevo ingrediente'}
            </h2>
            <p className="mt-2 text-sm text-stone-500">
                {isEditing
                    ? 'Actualiza los datos de este ingrediente'
                    : 'Completa los datos para agregar un ingrediente'}
            </p>

            <div className="mt-8 space-y-5">
                <TextField
                    isRequired
                    name="name"
                    type="text"
                    value={data.name}
                    onChange={(value) => {
                        setData('name', value);

                        if (errors.name) {
clearErrors('name');
}
                    }}
                    isInvalid={!!errors.name}
                    className="flex flex-col gap-1.5"
                >
                    <Label className={labelClasses}>Nombre</Label>
                    <Input
                        placeholder="Nombre del ingrediente"
                        className={inputClasses}
                    />
                    <FieldError className="text-sm font-medium text-red-500">
                        {errors.name}
                    </FieldError>
                </TextField>

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
                        placeholder="Describe brevemente este ingrediente"
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
                            placeholder="0.00"
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
                        <Label className={labelClasses}>Existencias</Label>
                        <Input
                            placeholder="0"
                            min={0}
                            step="0.01"
                            className={inputClasses}
                        />
                        <FieldError className="text-sm font-medium text-red-500">
                            {errors.stock}
                        </FieldError>
                    </TextField>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="unit" className={labelClasses}>
                        Unidad
                    </label>

                    <div className="relative">
                        <select
                            id="unit"
                            name="unit"
                            value={data.unit}
                            onChange={(e) => {
                                setData('unit', e.target.value as Unit);

                                if (errors.unit) {
clearErrors('unit');
}
                            }}
                            className={`${selectClasses} ${
                                errors.unit
                                    ? 'border-red-400'
                                    : 'focus:border-orange-400'
                            }`}
                        >
                            {UNIT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-stone-400"
                        />
                    </div>

                    {errors.unit && (
                        <p className="text-sm font-medium text-red-500">
                            {errors.unit}
                        </p>
                    )}
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        isDisabled={processing}
                        className="flex w-full items-center justify-center rounded-2xl bg-orange-500 py-3.5 text-base font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97] disabled:opacity-60 lg:py-4"
                    >
                        {processing
                            ? 'Guardando…'
                            : isEditing
                              ? 'Actualizar ingrediente'
                              : 'Crear ingrediente'}
                    </Button>
                </div>
            </div>
        </Form>
    );
}

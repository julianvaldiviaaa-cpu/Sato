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
import type { SyntheticEvent } from 'react';
import { route } from 'ziggy-js';
import type { Category } from '@/types';

type Props = {
    categoy?: Category;
};

// Mismas clases que en SaucerManage/CategoryShow para mantener consistencia visual
const inputClasses =
    'w-full rounded-2xl border-2 border-transparent bg-stone-100/80 px-4 py-3 text-stone-900 placeholder:text-stone-400 outline-none transition-colors duration-200 ease-out data-[focused]:border-orange-400 data-[focused]:bg-orange-50 data-[invalid]:border-red-400';

const labelClasses =
    'text-xs font-semibold tracking-wide text-stone-400 uppercase';

export default function CategoryForm({ categoy }: Props) {
    const { data, setData, errors, clearErrors, processing, post, put, reset } =
        useForm({
            name: categoy?.name ?? '',
            description: categoy?.description ?? '',
        });

    const isEditing = !!categoy;

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        if (categoy) {
            put(route('categories.update', categoy), {
                onSuccess: () => {
                    reset();
                },
                preserveScroll: true,
            });

            return;
        }

        post(route('categories.store'), {
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
                Categoría
            </p>
            <h2 className="mt-1 text-3xl leading-[1.05] font-semibold tracking-[-0.02em] text-stone-900 sm:text-4xl">
                {isEditing ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
            <p className="mt-2 text-sm text-stone-500">
                {isEditing
                    ? 'Actualiza los datos de esta categoría'
                    : 'Completa los datos para crear una categoría'}
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
                        placeholder="Nombre de la categoría"
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
                        placeholder="Describe brevemente esta categoría"
                        rows={4}
                        className={inputClasses}
                    />
                    <FieldError className="text-sm font-medium text-red-500">
                        {errors.description}
                    </FieldError>
                </TextField>

                <div className="pt-2">
                    <Button
                        type="submit"
                        isDisabled={processing}
                        className="flex w-full items-center justify-center rounded-2xl bg-orange-500 py-3.5 text-base font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97] disabled:opacity-60 lg:py-4"
                    >
                        {processing
                            ? 'Guardando…'
                            : isEditing
                              ? 'Actualizar categoría'
                              : 'Crear categoría'}
                    </Button>
                </div>
            </div>
        </Form>
    );
}

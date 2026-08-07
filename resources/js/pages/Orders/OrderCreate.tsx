import {
    Button,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
} from '@heroui/react';
import { router, useForm, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import type { SyntheticEvent } from 'react';
import { route } from 'ziggy-js';
import FormLayout from '../Layouts/FormLayout';

// Mismas clases que en CategoryForm/SaucerForm/IngredientForm para mantener consistencia visual
const inputClasses =
    'w-full rounded-2xl border-2 border-transparent bg-stone-100/80 px-4 py-3 text-stone-900 placeholder:text-stone-400 outline-none transition-colors duration-200 ease-out data-[focused]:border-orange-400 data-[focused]:bg-orange-50 data-[invalid]:border-red-400';

const labelClasses =
    'text-xs font-semibold tracking-wide text-stone-400 uppercase';

export default function OrderCreate() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isStaff = user.role === 'worker' || user.role === 'admin';

    // Mesero/admin: crea la orden indicando la mesa
    const staffForm = useForm({
        table_number: 1,
    });

    // Cliente: se une a una orden existente con el código que le dio el mesero
    const customerForm = useForm({
        code: '',
    });

    const handleStaffSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        staffForm.post(route('orders.store'), {
            onSuccess: () => staffForm.reset(),
        });
    };

    const handleCustomerSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        customerForm.put(route('orders.join'), {
            onSuccess: () => customerForm.reset(),
        });
    };

    return (
        <FormLayout>
            <Button
                onClick={() => router.get(route('dashboard'))}
                className="group mb-6 flex items-center gap-1.5 rounded-full border border-stone-200/70 bg-white/60 py-2 pr-4 pl-2.5 text-sm font-medium text-stone-500 backdrop-blur-xl transition-all duration-300 ease-out hover:border-orange-200 hover:bg-white hover:text-orange-600 active:scale-95"
            >
                <ChevronLeft
                    size={16}
                    className="transition-transform duration-300 ease-out group-hover:-translate-x-0.5"
                />
                Dashboard
            </Button>

            <Form
                onSubmit={isStaff ? handleStaffSubmit : handleCustomerSubmit}
                className="w-full rounded-[28px] border border-orange-500/10 bg-white/70 p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_45px_-18px_rgba(234,88,12,0.18)] backdrop-blur-xl sm:p-10"
            >
                <p className="text-xs font-semibold tracking-wide text-orange-500 uppercase">
                    Orden
                </p>
                <h2 className="mt-1 text-3xl leading-[1.05] font-semibold tracking-[-0.02em] text-stone-900 sm:text-4xl">
                    {isStaff ? 'Nueva orden' : 'Unirme a una orden'}
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                    {isStaff
                        ? 'Indica el número de mesa para comenzar la orden'
                        : 'Ingresa el código que te compartió tu mesero para unirte a la orden'}
                </p>

                <div className="mt-8 space-y-5">
                    {isStaff ? (
                        <TextField
                            isRequired
                            name="table_number"
                            type="number"
                            value={String(staffForm.data.table_number)}
                            onChange={(value) => {
                                staffForm.setData(
                                    'table_number',
                                    Number(value),
                                );

                                if (staffForm.errors.table_number) {
staffForm.clearErrors('table_number');
}
                            }}
                            isInvalid={!!staffForm.errors.table_number}
                            className="flex flex-col gap-1.5"
                        >
                            <Label className={labelClasses}>
                                Número de mesa
                            </Label>
                            <Input
                                placeholder="1"
                                min={1}
                                step={1}
                                className={inputClasses}
                            />
                            <FieldError className="text-sm font-medium text-red-500">
                                {staffForm.errors.table_number}
                            </FieldError>
                        </TextField>
                    ) : (
                        <TextField
                            isRequired
                            name="code"
                            type="text"
                            value={customerForm.data.code}
                            onChange={(value) => {
                                customerForm.setData('code', value);

                                if (customerForm.errors.code) {
customerForm.clearErrors('code');
}
                            }}
                            isInvalid={!!customerForm.errors.code}
                            className="flex flex-col gap-1.5"
                        >
                            <Label className={labelClasses}>
                                Código de la orden
                            </Label>
                            <Input
                                placeholder="Ej. 4821"
                                inputMode="numeric"
                                className={inputClasses}
                            />
                            <FieldError className="text-sm font-medium text-red-500">
                                {customerForm.errors.code}
                            </FieldError>
                        </TextField>
                    )}

                    <div className="pt-2">
                        <Button
                            type="submit"
                            isDisabled={
                                isStaff
                                    ? staffForm.processing
                                    : customerForm.processing
                            }
                            className="flex w-full items-center justify-center rounded-2xl bg-orange-500 py-3.5 text-base font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97] disabled:opacity-60 lg:py-4"
                        >
                            {isStaff
                                ? staffForm.processing
                                    ? 'Creando…'
                                    : 'Crear orden'
                                : customerForm.processing
                                  ? 'Uniéndome…'
                                  : 'Unirme a la orden'}
                        </Button>
                    </div>
                </div>
            </Form>
        </FormLayout>
    );
}

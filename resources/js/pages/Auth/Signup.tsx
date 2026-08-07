import {
    Button,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
} from '@heroui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import type { SyntheticEvent } from 'react';
import { route } from 'ziggy-js';
import FormLayout from '../Layouts/FormLayout';

// Clases compartidas para los inputs: fondo naranja claro, sin borde,
// y anillo naranja al hacer focus (en vez del azul por defecto)
const inputClasses =
    'w-full rounded-xl border-2 border-transparent bg-orange-200/60 px-4 py-3 text-orange-950 placeholder:text-orange-700/50 outline-none transition-colors duration-200 data-[focused]:border-orange-400 data-[focused]:bg-orange-100 data-[invalid]:border-red-400';

const labelClasses = 'text-lg font-bold tracking-tight text-white';

export default function Signup() {
    const { data, setData, errors, clearErrors, post, reset, processing } =
        useForm({
            name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: '',
        });

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        post(route('signup.store'), {
            onSuccess: () => {
                reset();
            },
            preserveScroll: true,
        });
    };

    return (
        <FormLayout>
            <Head title="Crear Cuenta" />

            <Form
                className="w-full rounded-3xl bg-orange-600 px-6 py-10 shadow-xl shadow-orange-900/20 sm:px-10 sm:py-12"
                onSubmit={handleSubmit}
            >
                <h2 className="text-center text-3xl font-bold tracking-tighter text-white sm:text-4xl">
                    Crea tu cuenta en Sato
                </h2>
                <p className="mt-2 text-center text-sm text-orange-100">
                    Regístrate para poder disfrutar en Sato
                </p>

                <div className="mt-8 space-y-5">
                    <TextField
                        isRequired
                        name="name"
                        type="text"
                        autoFocus
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
                        <Label className={labelClasses}>Nombre(s)</Label>
                        <Input
                            placeholder="Tu nombre(s) aquí"
                            className={inputClasses}
                        />
                        <FieldError className="text-sm font-medium text-orange-100">
                            {errors.name}
                        </FieldError>
                    </TextField>

                    <TextField
                        name="last_name"
                        type="text"
                        value={data.last_name}
                        onChange={(value) => {
                            setData('last_name', value);

                            if (errors.last_name) {
clearErrors('last_name');
}
                        }}
                        isInvalid={!!errors.last_name}
                        className="flex flex-col gap-1.5"
                    >
                        <Label className={labelClasses}>Apellido(s)</Label>
                        <Input
                            placeholder="Tus apellidos aquí"
                            className={inputClasses}
                        />
                        <FieldError className="text-sm font-medium text-orange-100">
                            {errors.last_name}
                        </FieldError>
                    </TextField>

                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(value) => {
                            setData('email', value);

                            if (errors.email) {
clearErrors('email');
}
                        }}
                        isInvalid={!!errors.email}
                        className="flex flex-col gap-1.5"
                    >
                        <Label className={labelClasses}>
                            Correo electrónico
                        </Label>
                        <Input
                            placeholder="correo@ejemplo.com"
                            autoComplete="email"
                            className={inputClasses}
                        />
                        <FieldError className="text-sm font-medium text-orange-100">
                            {errors.email}
                        </FieldError>
                    </TextField>

                    <TextField
                        isRequired
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={(value) => {
                            setData('password', value);

                            if (errors.password) {
clearErrors('password');
}
                        }}
                        isInvalid={!!errors.password}
                        className="flex flex-col gap-1.5"
                    >
                        <Label className={labelClasses}>Contraseña</Label>
                        <Input
                            placeholder="********"
                            autoComplete="new-password"
                            className={inputClasses}
                        />
                        <FieldError className="text-sm font-medium text-orange-100">
                            {errors.password}
                        </FieldError>
                    </TextField>

                    <TextField
                        isRequired
                        name="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(value) => {
                            setData('password_confirmation', value);
                        }}
                        className="flex flex-col gap-1.5"
                    >
                        <Label className={labelClasses}>
                            Confirmar contraseña
                        </Label>
                        <Input
                            placeholder="********"
                            className={inputClasses}
                        />
                    </TextField>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            isDisabled={processing}
                            className="w-full rounded-xl bg-orange-100 py-4 text-xl font-bold tracking-tight text-orange-600 transition-all duration-300 hover:bg-white active:scale-[0.99] disabled:opacity-55 lg:py-8 lg:text-2xl"
                        >
                            Crear Cuenta
                        </Button>
                    </div>

                    <p className="text-center text-lg tracking-tight">
                        Ya tienes cuenta?.{' '}
                        <Link className="font-bold" href={route('login')}>
                            Inicia Sesion
                        </Link>
                    </p>
                </div>
            </Form>
        </FormLayout>
    );
}

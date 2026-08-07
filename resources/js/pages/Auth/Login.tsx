import {
    Button,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
} from '@heroui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import FormLayout from '../Layouts/FormLayout';

// Mismas clases que en Signup para mantener consistencia visual
const inputClasses =
    'w-full rounded-xl border-2 border-transparent bg-orange-200/60 px-4 py-3 text-orange-950 placeholder:text-orange-700/50 outline-none transition-colors duration-200 data-[focused]:border-orange-400 data-[focused]:bg-orange-100 data-[invalid]:border-red-400';

const labelClasses = 'text-lg font-bold tracking-tight text-white';

export default function Login() {
    const { data, setData, errors, clearErrors, post, processing } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(route('login.store'));
    };

    return (
        <FormLayout>
            <Head title="Iniciar Sesión" />

            <Form
                onSubmit={handleSubmit}
                className="w-full rounded-3xl bg-orange-600 px-6 py-10 shadow-xl shadow-orange-900/20 sm:px-10 sm:py-12"
            >
                <h2 className="text-center text-3xl font-bold tracking-tighter text-white sm:text-4xl">
                    Inicia sesión en Sato
                </h2>
                <p className="mt-2 text-center text-sm text-orange-100">
                    Ingresa tus datos para continuar
                </p>

                <div className="mt-8 space-y-5">
                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        autoFocus
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
                            autoComplete="current-password"
                            className={inputClasses}
                        />
                        <FieldError className="text-sm font-medium text-orange-100">
                            {errors.password}
                        </FieldError>
                    </TextField>

                    <div className="flex justify-end">
                        <Link
                            className="text-sm font-medium text-orange-100 underline-offset-2 hover:underline"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            isDisabled={processing}
                            className="w-full rounded-xl bg-orange-100 py-4 text-xl font-bold tracking-tight text-orange-600 transition-all duration-300 hover:bg-white active:scale-[0.99] disabled:opacity-60 lg:py-8 lg:text-2xl"
                        >
                            Iniciar Sesión
                        </Button>
                    </div>

                    <p className="text-center text-sm text-orange-100">
                        ¿No tienes cuenta?{' '}
                        <Link
                            href={route('signup')}
                            className="font-bold underline-offset-2 hover:underline"
                        >
                            Crea una aquí
                        </Link>
                    </p>
                </div>
            </Form>
        </FormLayout>
    );
}

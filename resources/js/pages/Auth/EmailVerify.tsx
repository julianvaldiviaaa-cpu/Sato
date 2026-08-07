import { Button } from '@heroui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { SyntheticEvent } from 'react';
import { route } from 'ziggy-js';
import AppLayout from '../Layouts/AppLayout';

export default function EmailVerify() {
    const { status } = usePage().props;
    const { post, processing } = useForm({});

    const verificationLinkSent = status === 'verification-link-sent';

    function handleResend(e: SyntheticEvent) {
        e.preventDefault();
        post(route('verification.send'));
    }

    return (
        <AppLayout>
            <Head title="Verifica tu correo" />

            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="w-full max-w-xl rounded-3xl bg-orange-600 px-6 py-10 text-center shadow-xl shadow-orange-900/20 sm:px-10 sm:py-12">
                    <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
                        Verifica tu correo
                    </h2>

                    <p className="mt-4 text-orange-100">
                        Gracias por registrarte. Antes de continuar, ¿podrías
                        verificar tu dirección de correo? Te enviamos un enlace
                        de verificación a tu correo electrónico.
                    </p>

                    {verificationLinkSent && (
                        <div className="mt-6 rounded-xl bg-orange-100 px-4 py-3 text-sm font-medium text-orange-700">
                            Se envió un nuevo enlace de verificación a tu correo
                            electrónico.
                        </div>
                    )}

                    <div className="mt-8 flex flex-col items-center gap-4">
                        <Button
                            onClick={handleResend}
                            isDisabled={processing}
                            className="w-full rounded-xl bg-orange-100 py-4 text-xl font-bold tracking-tight text-orange-600 transition-all duration-300 hover:bg-white active:scale-[0.99] disabled:opacity-60 sm:w-auto sm:px-10"
                        >
                            Reenviar correo de verificación
                        </Button>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-sm font-medium text-orange-100 underline-offset-2 hover:underline"
                        >
                            Cerrar sesión
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

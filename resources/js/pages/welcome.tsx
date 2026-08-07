import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ChefHat,
    ClipboardList,
    Flame,
    Soup,
    UtensilsCrossed,
} from 'lucide-react';
import { route } from 'ziggy-js';
import Navbar from '@/Components/Navbar';

export default function Welcome() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const primaryHref = user ? route('dashboard') : route('login');
    const primaryLabel = user ? 'Ir a mi dashboard' : 'Iniciar sesión';

    return (
        <>
            <Head title="Bienvenido a Sato" />
            <Navbar />

            <main className="mx-auto max-w-6xl px-6 pt-16 pb-24 sm:px-8">
                <section className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:gap-16 lg:text-left">
                    <div className="max-w-xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/15 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-orange-600 uppercase">
                            <Flame size={14} /> Restaurante Sato
                        </span>

                        <h1 className="mt-6 text-6xl leading-[1.02] font-semibold tracking-[-0.04em] text-stone-900 sm:text-7xl">
                            Tu cocina y tu
                            <span className="text-orange-600"> mesa</span> en
                            una sola app
                        </h1>

                        <p className="mt-6 text-lg leading-relaxed text-stone-500">
                            Crea órdenes, comparte el código con tus clientes y
                            coordina a tu equipo de cocina en tiempo real.
                            Simplemente Sato.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                            <Link
                                href={primaryHref}
                                className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-7 py-4 text-base font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97]"
                            >
                                {primaryLabel}
                                <ArrowRight size={18} />
                            </Link>

                            {!user && (
                                <Link
                                    href={route('signup')}
                                    className="flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white/60 px-7 py-4 text-base font-semibold tracking-tight text-stone-600 backdrop-blur-xl transition-all duration-300 ease-out hover:border-orange-200 hover:bg-white hover:text-orange-600 active:scale-[0.97]"
                                >
                                    Crear cuenta
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="relative grid w-full max-w-sm grid-cols-2 gap-4 lg:max-w-md">
                        <div className="rounded-[28px] border border-orange-500/10 bg-white/70 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_45px_-18px_rgba(234,88,12,0.18)] backdrop-blur-xl">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                <ClipboardList size={22} />
                            </div>
                            <p className="mt-4 font-semibold text-stone-900">
                                Órdenes al instante
                            </p>
                            <p className="mt-1 text-sm text-stone-500">
                                Crea mesas y comparte un código único.
                            </p>
                        </div>

                        <div className="mt-8 rounded-[28px] border border-orange-500/10 bg-white/70 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_45px_-18px_rgba(234,88,12,0.18)] backdrop-blur-xl">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                <ChefHat size={22} />
                            </div>
                            <p className="mt-4 font-semibold text-stone-900">
                                Cocina conectada
                            </p>
                            <p className="mt-1 text-sm text-stone-500">
                                Cada platillo se avisa en tiempo real.
                            </p>
                        </div>

                        <div className="-mt-4 rounded-[28px] border border-orange-500/10 bg-white/70 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_45px_-18px_rgba(234,88,12,0.18)] backdrop-blur-xl">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                <UtensilsCrossed size={22} />
                            </div>
                            <p className="mt-4 font-semibold text-stone-900">
                                Menú vivo
                            </p>
                            <p className="mt-1 text-sm text-stone-500">
                                Categorías, platillos e inventario juntos.
                            </p>
                        </div>

                        <div className="mt-4 rounded-[28px] border border-orange-500/10 bg-white/70 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_45px_-18px_rgba(234,88,12,0.18)] backdrop-blur-xl">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                <Soup size={22} />
                            </div>
                            <p className="mt-4 font-semibold text-stone-900">
                                Factura fácil
                            </p>
                            <p className="mt-1 text-sm text-stone-500">
                                Genera tu factura al cerrar la cuenta.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
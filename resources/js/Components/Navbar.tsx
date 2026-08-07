import { Avatar, Button } from '@heroui/react';
import { Link, router, usePage } from '@inertiajs/react';
import { Box, ChefHat, Plus, Utensils } from 'lucide-react';
import { route } from 'ziggy-js';

export default function Navbar() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const Initial = user?.name?.charAt(0).toUpperCase();

    return (
        <nav className="sticky top-0 z-50 border-b border-stone-900/4 bg-white/70 backdrop-blur-xl">
            <div className="flex w-full items-center justify-between px-6 py-4 sm:px-8">
                <Link
                    href={auth.verified ? route('dashboard') : route('home')}
                    className="flex items-center gap-2.5"
                >
                    <span className="text-2xl font-semibold tracking-[-0.02em] text-orange-600">
                        Sato
                    </span>

                    {(user?.role === 'admin' || user?.role === 'worker') && (
                        <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-orange-600 uppercase">
                            {user.role === 'admin'
                                ? 'Administrador'
                                : 'Trabajador'}
                        </span>
                    )}
                </Link>

                {auth.verified ? (
                    <div className="flex items-center gap-2.5">
                        <Button
                            onClick={() => router.get(route('menu.categories'))}
                            className="flex items-center gap-2 rounded-2xl border border-orange-500/20 bg-white/60 px-3.5 py-2.5 text-sm font-semibold tracking-tight text-orange-600 backdrop-blur-xl transition-all duration-300 ease-out hover:bg-orange-50 active:scale-[0.97] sm:px-4"
                        >
                            <Utensils size={16} />
                            <span className="hidden sm:inline">Menu</span>
                        </Button>

                        {user?.role === 'admin' && (
                            <>
                                <Button
                                    onClick={() =>
                                        router.get(route('categories.create'))
                                    }
                                    className="flex items-center gap-2 rounded-2xl border border-orange-500/20 bg-white/60 px-3.5 py-2.5 text-sm font-semibold tracking-tight text-orange-600 backdrop-blur-xl transition-all duration-300 ease-out hover:bg-orange-50 active:scale-[0.97] sm:px-4"
                                >
                                    <Utensils size={16} />
                                    <span className="hidden sm:inline">
                                        Nueva categoría
                                    </span>
                                </Button>
                            </>
                        )}

                        {(user?.role === 'admin' ||
                            user?.role === 'worker') && (
                            <Button
                                onClick={() => router.get(route('ingredients'))}
                                className="flex items-center gap-2 rounded-2xl border border-orange-500/20 bg-white/60 px-3.5 py-2.5 text-sm font-semibold tracking-tight text-orange-600 backdrop-blur-xl transition-all duration-300 ease-out hover:bg-orange-50 active:scale-[0.97] sm:px-4"
                            >
                                <Box size={16} />
                                <span className="hidden sm:inline">
                                    Inventario
                                </span>
                            </Button>
                        )}

                        {(user?.role === 'admin' ||
                            user?.role === 'worker') && (
                            <Button
                                onClick={() => router.get(route('kitchen'))}
                                className="flex items-center gap-2 rounded-2xl border border-orange-500/20 bg-white/60 px-3.5 py-2.5 text-sm font-semibold tracking-tight text-orange-600 backdrop-blur-xl transition-all duration-300 ease-out hover:bg-orange-50 active:scale-[0.97] sm:px-4"
                            >
                                <ChefHat size={16} />
                                <span className="hidden sm:inline">Cocina</span>
                            </Button>
                        )}

                        <Button
                            onClick={() => router.get(route('orders.create'))}
                            className="flex items-center gap-2 rounded-2xl bg-orange-500 px-3.5 py-2.5 text-sm font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97] sm:px-4"
                        >
                            <Plus size={16} />
                            <span className="hidden sm:inline">
                                Nueva orden
                            </span>
                        </Button>

                        <Avatar className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm ring-1 ring-stone-900/6">
                            <Avatar.Image
                                src="/red.jpg"
                                className="h-full w-full object-cover"
                            />
                            <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-orange-100 text-sm font-semibold text-orange-600">
                                {Initial}
                            </Avatar.Fallback>
                        </Avatar>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => router.get(route('login'))}
                            className="rounded-2xl border-2 border-orange-500 bg-transparent px-5 py-2.5 text-sm font-semibold tracking-tight text-orange-500 transition-all duration-300 ease-out hover:bg-orange-500 hover:text-orange-100 active:scale-[0.97]"
                        >
                            Iniciar sesión
                        </Button>
                        <Button
                            onClick={() => router.get(route('signup'))}
                            className="rounded-2xl bg-orange-500 px-5 py-2.5 text-sm font-semibold tracking-tight text-white shadow-sm shadow-orange-500/30 transition-all duration-300 ease-out hover:bg-orange-600 active:scale-[0.97]"
                        >
                            Crear cuenta
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
}

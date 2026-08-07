import { usePage } from '@inertiajs/react';
import type { Order } from '@/types';
import AppLayout from '../Layouts/AppLayout';
import AdminDashboard from './Roles/AdminDashboard';
import CustomerDashboard from './Roles/CustomerDashboard';
import WorkerDashboard from './Roles/WorkerDashboard';

type Props = {
    stats: {
        categories: number;
        ingredients: number;
        saucers: number;
    };
    orderStats?: {
        today: { count: number; total: number };
        week: { count: number; total: number };
        month: { count: number; total: number };
        year: { count: number; total: number };
    };
    activeOrders?: Order[];
    attendedOrders?: Order[];
    activeOrder?: Order | null;
    orders?: Order[];
};

function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
return 'Buenos días';
}

    if (hour < 19) {
return 'Buenas tardes';
}

    return 'Buenas noches';
}

export default function Dashboard({
    stats,
    orderStats,
    activeOrders = [],
    attendedOrders = [],
    activeOrder = null,
    orders = [],
}: Props) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <AppLayout>
            <div className="space-y-10">
                <div>
                    <p className="text-xs font-semibold tracking-wide text-orange-500 uppercase">
                        {getGreeting()}
                    </p>
                    <h1 className="mt-1 text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-stone-900 sm:text-6xl">
                        {user.name}{' '}
                        <span className="text-orange-600">
                            {user.last_name}
                        </span>
                    </h1>

                    <p className="mt-3 text-base text-stone-500">
                        Bienvenido de vuelta al panel de administración.
                    </p>
                </div>

                {user.role === 'admin' && (
                    <AdminDashboard stats={stats} orderStats={orderStats} />
                )}
                {user.role === 'worker' && (
                    <WorkerDashboard
                        activeOrders={activeOrders}
                        attendedOrders={attendedOrders}
                    />
                )}
                {user.role === 'user' && (
                    <CustomerDashboard
                        activeOrder={activeOrder}
                        orders={orders}
                    />
                )}
            </div>
        </AppLayout>
    );
}

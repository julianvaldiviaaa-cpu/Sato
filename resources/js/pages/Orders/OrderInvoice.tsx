import { Button } from '@heroui/react';
import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { formatCurrency } from '@/Helpers/formatCurrency';
import type { Business, Order } from '@/types';

type Props = {
    order: Order;
    business: Business;
};

const paymentLabel: Record<string, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta',
};

export default function OrderInvoice({ order, business }: Props) {
    const payForm = useForm({});

    const handleMarkPaid = () => {
        payForm.post(route('orders.pay', order.id));
    };

    return (
        <>
            <Head title={`Factura ${order.folio}`} />

            <div className="mx-auto max-w-3xl p-6 print:p-0">
                <div className="mb-4 flex items-center justify-between gap-4 print:hidden">
                    <Button onPress={() => window.close()}>Volver</Button>
                    <div className="flex gap-2">
                        <Button onPress={() => window.print()}>Imprimir</Button>
                        {order.status !== 'completed' && (
                            <Button
                                onPress={handleMarkPaid}
                                isDisabled={payForm.processing}
                            >
                                {payForm.processing
                                    ? 'Guardando…'
                                    : 'Marcar como pagada'}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:shadow-none">
                    <div className="flex items-start justify-between gap-6 border-b border-stone-200 pb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-stone-900">
                                {business.business_name}
                            </h1>
                            <p className="mt-1 text-sm text-stone-600">
                                RFC: {business.rfc}
                            </p>
                            <p className="text-sm text-stone-600">
                                {business.address}
                            </p>
                            <p className="mt-1 text-xs text-stone-500">
                                {business.regime}
                            </p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold tracking-tight text-stone-900">
                                Factura
                            </h2>
                            <p className="mt-1 text-sm text-stone-600">
                                Folio: {order.folio}
                            </p>
                            <p className="text-sm text-stone-600">
                                Fecha:{' '}
                                {new Date(order.created_at).toLocaleDateString(
                                    'es-MX',
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text-stone-900">
                                Cliente
                            </p>
                            <p className="text-stone-600">
                                {order.customer?.name} {order.customer?.last_name}
                            </p>
                            {order.payment_method && (
                                <p className="mt-1 text-stone-600">
                                    Método de pago:{' '}
                                    {paymentLabel[order.payment_method]}
                                </p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-stone-900">
                                Mesa {order.table_number}
                            </p>
                            <p className="text-stone-600">
                                Orden #{order.id}
                            </p>
                        </div>
                    </div>

                    <table className="mt-8 w-full text-sm">
                        <thead>
                            <tr className="border-b border-stone-200 text-left text-stone-500">
                                <th className="pb-2 font-medium">Platillo</th>
                                <th className="pb-2 text-center font-medium">
                                    Cant.
                                </th>
                                <th className="pb-2 text-right font-medium">
                                    Precio unitario
                                </th>
                                <th className="pb-2 text-right font-medium">
                                    Subtotal
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-stone-100"
                                >
                                    <td className="py-2">
                                        {item.saucer?.name}
                                        {item.notes && (
                                            <p className="text-xs text-stone-500">
                                                {item.notes}
                                            </p>
                                        )}
                                    </td>
                                    <td className="py-2 text-center">
                                        {item.quantity}
                                    </td>
                                    <td className="py-2 text-right">
                                        {formatCurrency(item.unit_price)}
                                    </td>
                                    <td className="py-2 text-right">
                                        {formatCurrency(item.subtotal)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-6 ml-auto w-64 space-y-1 text-sm">
                        <div className="flex justify-between text-stone-600">
                            <span>Subtotal</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                            <span>Impuesto</span>
                            <span>{formatCurrency(order.tax)}</span>
                        </div>
                        <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-bold text-stone-900">
                            <span>Total</span>
                            <span>{formatCurrency(order.total)}</span>
                        </div>
                    </div>

                    {order.status === 'completed' && order.paid_at && (
                        <p className="mt-8 border-t border-stone-200 pt-4 text-center text-sm text-stone-600">
                            Pagado el{' '}
                            {new Date(order.paid_at).toLocaleDateString('es-MX')}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
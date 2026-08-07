<?php

use App\Enums\OrderPaymentMethod;
use App\Events\BillRequested;
use App\Events\OrderItemStatusUpdated;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Saucer;
use App\Models\User;
use Illuminate\Support\Facades\Event;

function makeOrder(): array
{
    $worker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create(['role' => 'user']);

    $category = Category::create(['name' => 'Sushis', 'slug' => 'sushis']);
    $saucer = Saucer::create([
        'category_id' => $category->id,
        'name' => 'Sushi culero',
        'slug' => 'sushi-culero',
        'price' => 10,
        'available' => true,
    ]);

    $order = Order::create([
        'table_number' => 4,
        'worker_id' => $worker->id,
        'customer_id' => $customer->id,
    ]);

    $orderItem = OrderItem::create([
        'order_id' => $order->id,
        'saucer_id' => $saucer->id,
        'quantity' => 2,
        'unit_price' => 10,
        'subtotal' => 20,
        'status' => 'pending',
    ]);

    return [
        'worker' => $worker,
        'customer' => $customer,
        'order' => $order,
        'orderItem' => $orderItem,
        'saucer' => $saucer,
    ];
}

it('permite al cliente de la orden pedir la cuenta', function () {
    Event::fake([BillRequested::class]);

    $data = makeOrder();

    $this->actingAs($data['customer'])
        ->post(route('orders.request-bill', $data['order']), [
            'payment_method' => 'cash',
        ])
        ->assertRedirect();

    $data['order']->refresh();

    expect($data['order']->bill_requested_at)->not->toBeNull();
    expect($data['order']->payment_method)->toBe(OrderPaymentMethod::Cash);

    Event::assertDispatched(BillRequested::class);
});

it('requiere un metodo de pago para pedir la cuenta', function () {
    $data = makeOrder();
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->post(route('orders.request-bill', $data['order']))
        ->assertSessionHasErrors('payment_method');

    $data['order']->refresh();

    expect($data['order']->bill_requested_at)->toBeNull();
});

it('permite al administrador pedir la cuenta', function () {
    $data = makeOrder();
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->post(route('orders.request-bill', $data['order']), [
            'payment_method' => 'cash',
        ])
        ->assertRedirect();

    $data['order']->refresh();

    expect($data['order']->bill_requested_at)->not->toBeNull();
});

it('permite al mesero y cliente ver la factura', function () {
    $data = makeOrder();

    $this->actingAs($data['worker'])
        ->get(route('orders.invoice', $data['order']))
        ->assertSuccessful();

    $this->actingAs($data['customer'])
        ->get(route('orders.invoice', $data['order']))
        ->assertSuccessful();
});

it('genera folios secuenciales e idempotentes', function () {
    $first = makeOrder();
    $second = makeOrder();

    $this->actingAs($first['worker'])
        ->get(route('orders.invoice', $first['order']))
        ->assertSuccessful();

    $this->actingAs($second['worker'])
        ->get(route('orders.invoice', $second['order']))
        ->assertSuccessful();

    $first['order']->refresh();
    $second['order']->refresh();

    $year = now()->year;

    expect($first['order']->folio)->toBe("F-{$year}-0001");
    expect($second['order']->folio)->toBe("F-{$year}-0002");

    $this->actingAs($first['worker'])
        ->get(route('orders.invoice', $first['order']))
        ->assertSuccessful();

    $first['order']->refresh();

    expect($first['order']->folio)->toBe("F-{$year}-0001");
});

it('marca la orden como pagada', function () {
    $data = makeOrder();

    $this->actingAs($data['worker'])
        ->post(route('orders.pay', $data['order']))
        ->assertRedirect();

    $data['order']->refresh();

    expect($data['order']->paid_at)->not->toBeNull();
    expect($data['order']->status)->toBe('completed');
});

it('muestra la cocina a meseros y administradores', function () {
    $data = makeOrder();

    $this->actingAs($data['worker'])
        ->get(route('kitchen'))
        ->assertSuccessful();

    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->get(route('kitchen'))
        ->assertSuccessful();
});

it('bloquea la cocina a un cliente', function () {
    $data = makeOrder();

    $this->actingAs($data['customer'])
        ->get(route('kitchen'))
        ->assertForbidden();
});

it('permite al mesero cambiar el estado de un platillo y emite el evento', function () {
    Event::fake([OrderItemStatusUpdated::class]);

    $data = makeOrder();

    $this->actingAs($data['worker'])
        ->patch(route('kitchen.items.status', ['orderItem' => $data['orderItem']]), [
            'status' => 'preparing',
        ])
        ->assertRedirect();

    $data['orderItem']->refresh();

    expect($data['orderItem']->status->value)->toBe('preparing');

    Event::assertDispatched(OrderItemStatusUpdated::class);
});

it('no permite que un cliente cambie el estado de un platillo', function () {
    $data = makeOrder();

    $this->actingAs($data['customer'])
        ->patch(route('kitchen.items.status', ['orderItem' => $data['orderItem']]), [
            'status' => 'ready',
        ])
        ->assertForbidden();

    $data['orderItem']->refresh();

    expect($data['orderItem']->status->value)->toBe('pending');
});

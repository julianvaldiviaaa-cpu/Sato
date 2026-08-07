<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Saucer;
use App\Models\User;

function makeClosedOrder(): array
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
        'status' => 'completed',
    ]);

    $orderItem = OrderItem::create([
        'order_id' => $order->id,
        'saucer_id' => $saucer->id,
        'quantity' => 1,
        'unit_price' => 10,
        'subtotal' => 10,
        'status' => 'delivered',
    ]);

    return [
        'worker' => $worker,
        'customer' => $customer,
        'order' => $order,
        'orderItem' => $orderItem,
        'saucer' => $saucer,
    ];
}

it('no permite al cliente agregar platillos a una orden cerrada', function () {
    $data = makeClosedOrder();

    $this->actingAs($data['customer'])
        ->post(route('orders.items.store', $data['order']), [
            'items' => [
                ['saucer_id' => $data['saucer']->id, 'quantity' => 1],
            ],
        ])
        ->assertForbidden();

    expect($data['order']->items()->count())->toBe(1);
});

it('no permite al cliente pedir la cuenta en una orden cerrada', function () {
    $data = makeClosedOrder();

    $this->actingAs($data['customer'])
        ->post(route('orders.request-bill', $data['order']), [
            'payment_method' => 'cash',
        ])
        ->assertForbidden();

    $data['order']->refresh();

    expect($data['order']->bill_requested_at)->toBeNull();
});

it('no permite marcar como pagada una orden ya cerrada', function () {
    $data = makeClosedOrder();

    $this->actingAs($data['worker'])
        ->post(route('orders.pay', $data['order']))
        ->assertForbidden();
});

it('no permite a la cocina cambiar el estado de un platillo en una orden cerrada', function () {
    $data = makeClosedOrder();

    $this->actingAs($data['worker'])
        ->patch(route('kitchen.items.status', ['orderItem' => $data['orderItem']]), [
            'status' => 'ready',
        ])
        ->assertForbidden();

    $data['orderItem']->refresh();

    expect($data['orderItem']->status->value)->toBe('delivered');
});
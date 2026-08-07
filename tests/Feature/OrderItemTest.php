<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Saucer;
use App\Models\User;
use App\Enums\OrderItemStatus;

it('guarda los platillos del borrador como items de la orden', function () {
    $worker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create();

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

    $this->actingAs($worker)
        ->post(route('orders.items.store', $order), [
            'items' => [
                ['saucer_id' => $saucer->id, 'quantity' => 2, 'notes' => 'Sin salsa'],
            ],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('order_items', [
        'order_id' => $order->id,
        'saucer_id' => $saucer->id,
        'quantity' => 2,
        'unit_price' => 10,
        'subtotal' => 20,
        'status' => OrderItemStatus::Pending->value,
        'notes' => 'Sin salsa',
    ]);

    $order->refresh();

    $this->assertEquals(20, $order->subtotal);
    $this->assertEquals(round(20 * 0.16, 2), $order->tax);
    $this->assertEquals(round(20 * 1.16, 2), $order->total);
});

it('permite que el mesero administre los items de su orden', function () {
    $worker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create();

    $category = Category::create(['name' => 'Sushis', 'slug' => 'sushis']);
    $saucer = Saucer::create([
        'category_id' => $category->id,
        'name' => 'Sushi culero',
        'slug' => 'sushi-culero',
        'price' => 10,
        'available' => true,
    ]);

    $order = Order::create([
        'worker_id' => $worker->id,
        'customer_id' => $customer->id,
        'table_number' => 3,
    ]);

    $this->actingAs($worker)
        ->post(route('orders.items.store', $order), [
            'items' => [
                ['saucer_id' => $saucer->id, 'quantity' => 1],
            ],
        ])
        ->assertRedirect();

    $this->assertDatabaseCount('order_items', 1);
});

it('acumula el total cuando el cliente ordena varias veces', function () {
    $worker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create();

    $category = Category::create(['name' => 'Sushis', 'slug' => 'sushis']);
    $saucer = Saucer::create([
        'category_id' => $category->id,
        'name' => 'Sushi culero',
        'slug' => 'sushi-culero',
        'price' => 10,
        'available' => true,
    ]);

    $order = Order::create([
        'worker_id' => $worker->id,
        'customer_id' => $customer->id,
        'table_number' => 3,
    ]);

    $this->actingAs($worker)
        ->post(route('orders.items.store', $order), [
            'items' => [
                ['saucer_id' => $saucer->id, 'quantity' => 6],
            ],
        ])
        ->assertRedirect();

    $this->actingAs($worker)
        ->post(route('orders.items.store', $order), [
            'items' => [
                ['saucer_id' => $saucer->id, 'quantity' => 2],
            ],
        ])
        ->assertRedirect();

    $order->refresh();

    $expectedSubtotal = 60 + 20;
    $this->assertEquals($expectedSubtotal, (float) $order->subtotal);
    $this->assertEquals(round($expectedSubtotal * 0.16, 2), (float) $order->tax);
    $this->assertEquals(round($expectedSubtotal * 1.16, 2), (float) $order->total);
    $this->assertDatabaseCount('order_items', 2);
});

it('requiere al menos un platillo', function () {
    $worker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create();

    $order = Order::create([
        'worker_id' => $worker->id,
        'customer_id' => $customer->id,
        'table_number' => 3,
    ]);

    $this->actingAs($worker)
        ->post(route('orders.items.store', $order), [
            'items' => [],
        ])
        ->assertSessionHasErrors('items');

    $this->assertDatabaseCount('order_items', 0);
});

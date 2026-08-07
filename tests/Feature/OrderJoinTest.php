<?php

use App\Models\Order;
use App\Models\User;

it('permite a un usuario con rol user unirse a una orden', function () {
    $worker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create(['role' => 'user']);

    $order = Order::create([
        'worker_id' => $worker->id,
        'table_number' => 5,
    ]);

    $this->actingAs($customer)
        ->put(route('orders.join'), ['code' => $order->code])
        ->assertRedirect(route('orders.show', $order));

    $order->refresh();

    expect($order->customer_id)->toBe($customer->id)
        ->and($order->customer_joined_at)->not->toBeNull()
        ->and($order->code)->toBeNull();
});

it('permite a un usuario rol user abrir la pagina de ordenes que muestra el formulario de unirme', function () {
    $customer = User::factory()->create(['role' => 'user']);

    $this->actingAs($customer)
        ->get(route('orders.create'))
        ->assertOk();
});
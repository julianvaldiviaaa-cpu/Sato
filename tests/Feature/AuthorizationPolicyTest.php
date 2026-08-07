<?php

use App\Models\Category;
use App\Models\Ingredient;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Saucer;
use App\Models\User;

function authorizationFixtures(): array
{
    $category = Category::create(['name' => 'Entradas']);
    $ingredient = Ingredient::create([
        'name' => 'Aguacate',
        'cost' => 15,
        'stock' => 10,
        'unit' => 'piece',
    ]);
    $saucer = Saucer::create([
        'category_id' => $category->id,
        'name' => 'Guacamole',
        'price' => 80,
        'available' => true,
    ]);
    $worker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create(['role' => 'user']);
    $order = Order::create([
        'worker_id' => $worker->id,
        'customer_id' => $customer->id,
        'table_number' => 1,
    ]);
    $orderItem = OrderItem::create([
        'order_id' => $order->id,
        'saucer_id' => $saucer->id,
        'quantity' => 1,
        'unit_price' => 80,
        'subtotal' => 80,
    ]);

    return compact('category', 'ingredient', 'saucer', 'worker', 'customer', 'order', 'orderItem');
}

it('permite a los administradores realizar cualquier accion protegida', function () {
    $data = authorizationFixtures();
    $admin = User::factory()->create(['role' => 'admin']);

    expect($admin->can('create', Category::class))->toBeTrue()
        ->and($admin->can('delete', $data['ingredient']))->toBeTrue()
        ->and($admin->can('update', $data['saucer']))->toBeTrue()
        ->and($admin->can('manage', $data['order']))->toBeTrue()
        ->and($admin->can('updateStatus', $data['orderItem']))->toBeTrue()
        ->and($admin->can('requestBill', $data['order']))->toBeTrue();
});

it('limita a los workers a ingredientes, menu de consulta y sus ordenes', function () {
    $data = authorizationFixtures();
    $otherOrder = Order::create([
        'worker_id' => User::factory()->create(['role' => 'worker'])->id,
        'table_number' => 2,
    ]);
    $otherOrderItem = OrderItem::create([
        'order_id' => $otherOrder->id,
        'saucer_id' => $data['saucer']->id,
        'quantity' => 1,
        'unit_price' => 80,
        'subtotal' => 80,
    ]);

    expect($data['worker']->can('create', Ingredient::class))->toBeTrue()
        ->and($data['worker']->can('view', $data['category']))->toBeTrue()
        ->and($data['worker']->can('view', $data['saucer']))->toBeTrue()
        ->and($data['worker']->can('manage', $data['order']))->toBeTrue()
        ->and($data['worker']->can('updateStatus', $data['orderItem']))->toBeTrue()
        ->and($data['worker']->can('updateStatus', $otherOrderItem))->toBeFalse()
        ->and($data['worker']->can('create', Category::class))->toBeFalse()
        ->and($data['worker']->can('update', $data['saucer']))->toBeFalse()
        ->and($data['worker']->can('update', $data['ingredient']))->toBeFalse();
});

it('limita a los usuarios a unirse y consultar solamente sus ordenes', function () {
    $data = authorizationFixtures();
    $anotherOrder = Order::create([
        'worker_id' => $data['worker']->id,
        'table_number' => 2,
    ]);

    expect($data['customer']->can('join', Order::class))->toBeTrue()
        ->and($data['customer']->can('view', $data['order']))->toBeTrue()
        ->and($data['customer']->can('view', $anotherOrder))->toBeFalse()
        ->and($data['customer']->can('create', Order::class))->toBeFalse()
        ->and($data['customer']->can('create', Ingredient::class))->toBeFalse()
        ->and($data['customer']->can('view', $data['category']))->toBeFalse()
        ->and($data['customer']->can('manage', $data['order']))->toBeFalse();
});

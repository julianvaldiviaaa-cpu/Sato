<?php

use App\Models\Order;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function makeDashboardOrder(User $worker, User $customer, string $status = 'open'): Order
{
    return Order::create([
        'table_number' => 4,
        'worker_id' => $worker->id,
        'customer_id' => $customer->id,
        'status' => $status,
    ]);
}

it('muestra en el dashboard las ordenes activas y atendidas del mesero', function () {
    $worker = User::factory()->create(['role' => 'worker']);
    $otherWorker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create(['role' => 'user']);

    $activeOrder = makeDashboardOrder($worker, $customer, 'open');
    $attendedOrder = makeDashboardOrder($worker, $customer, 'completed');
    makeDashboardOrder($otherWorker, $customer, 'open');

    $this->actingAs($worker)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard/Dashboard')
            ->has('activeOrders', 1)
            ->has('attendedOrders', 1)
            ->where('activeOrders.0.id', $activeOrder->id)
            ->where('attendedOrders.0.id', $attendedOrder->id));
});

it('solo muestra al mesero sus propias ordenes activas', function () {
    $worker = User::factory()->create(['role' => 'worker']);
    $otherWorker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create(['role' => 'user']);

    makeDashboardOrder($worker, $customer, 'open');
    $otherOrder = makeDashboardOrder($otherWorker, $customer, 'open');

    $this->actingAs($worker)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('activeOrders', 1)
            ->whereNot('activeOrders.0.id', $otherOrder->id));
});

it('muestra la orden activa y el historial del cliente', function () {
    $worker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create(['role' => 'user']);

    $activeOrder = makeDashboardOrder($worker, $customer, 'open');
    $completedOrder = makeDashboardOrder($worker, $customer, 'completed');

    $this->actingAs($customer)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard/Dashboard')
            ->has('orders', 2)
            ->where('activeOrder.id', $activeOrder->id)
            ->where('orders.0.id', $activeOrder->id)
            ->where('orders.1.id', $completedOrder->id));
});

it('no muestra una orden activa al cliente cuando no tiene ninguna', function () {
    $worker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create(['role' => 'user']);

    makeDashboardOrder($worker, $customer, 'completed');

    $this->actingAs($customer)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->whereNull('activeOrder')
            ->has('orders', 1));
});

it('muestra al administrador las ordenes del período al hacer clic en la tarjeta', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $worker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create(['role' => 'user']);

    $todayOrder = makeDashboardOrder($worker, $customer, 'completed');

    $this->actingAs($admin)
        ->get(route('dashboard.orders', 'today'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard/Roles/AdminOrders')
            ->where('period', 'today')
            ->has('orders.data', 1)
            ->where('orders.data.0.id', $todayOrder->id)
            ->where('summary.count', 1));
});

it('devuelve 404 cuando el periodo no es valido', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->get(route('dashboard.orders', 'americano'))
        ->assertNotFound();
});

it('muestra al administrador las ordenes por período con su total', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $worker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create(['role' => 'user']);

    $today = Order::create([
        'table_number' => 1,
        'worker_id' => $worker->id,
        'customer_id' => $customer->id,
        'status' => 'completed',
        'subtotal' => 100.0,
        'tax' => 16.0,
        'total' => 116.0,
        'created_at' => now(),
    ]);

    Order::create([
        'table_number' => 2,
        'worker_id' => $worker->id,
        'customer_id' => $customer->id,
        'status' => 'open',
        'subtotal' => 50.0,
        'tax' => 8.0,
        'total' => 58.0,
        'created_at' => now(),
    ]);

    $olderOrder = Order::create([
        'table_number' => 3,
        'worker_id' => $worker->id,
        'customer_id' => $customer->id,
        'status' => 'open',
        'subtotal' => 25.0,
        'tax' => 4.0,
        'total' => 29.0,
    ]);
    $olderOrder->created_at = now()->subWeeks(2);
    $olderOrder->save();
    $olderOrder->refresh();

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orderStats.today')
            ->where('orderStats.today.count', 2)
            ->where('orderStats.today.total', 174)
            ->where('orderStats.week.count', 2)
            ->where('orderStats.week.total', 174)
            ->where('orderStats.month.count', 2)
            ->where('orderStats.month.total', 174)
            ->where('orderStats.year.count', 3)
            ->where('orderStats.year.total', 203));
});
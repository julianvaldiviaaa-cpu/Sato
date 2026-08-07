<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Saucer;
use App\Models\User;

it('authenticates valid credentials and redirects authenticated users to the dashboard', function () {
    $user = User::factory()->create([
        'email' => 'customer@example.com',
        'password' => 'password',
    ]);

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);
});

it('rejects invalid credentials without revealing whether the email exists', function () {
    $this->post(route('login.store'), [
        'email' => 'missing@example.com',
        'password' => 'password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

it('logs users out through the logout route', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('logout'))
        ->assertRedirect(route('home'));

    $this->assertGuest();
});

it('allows an order customer to add available dishes and request the bill', function () {
    $worker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create(['role' => 'user']);
    $category = Category::create(['name' => 'Entradas']);
    $saucer = Saucer::create([
        'category_id' => $category->id,
        'name' => 'Sopa del dia',
        'price' => 100,
        'available' => true,
    ]);
    $order = Order::create([
        'worker_id' => $worker->id,
        'customer_id' => $customer->id,
        'table_number' => 1,
    ]);

    $this->actingAs($customer)
        ->post(route('orders.items.store', $order), [
            'items' => [['saucer_id' => $saucer->id, 'quantity' => 1]],
        ])
        ->assertRedirect();

    $this->actingAs($customer)
        ->post(route('orders.request-bill', $order), ['payment_method' => 'cash'])
        ->assertRedirect();

    expect($order->items()->count())->toBe(1)
        ->and($order->fresh()->bill_requested_at)->not->toBeNull();
});

it('does not allow unavailable dishes to be added to an order', function () {
    $worker = User::factory()->create(['role' => 'worker']);
    $customer = User::factory()->create(['role' => 'user']);
    $category = Category::create(['name' => 'Bebidas']);
    $saucer = Saucer::create([
        'category_id' => $category->id,
        'name' => 'Agua agotada',
        'price' => 20,
        'available' => false,
    ]);
    $order = Order::create([
        'worker_id' => $worker->id,
        'customer_id' => $customer->id,
        'table_number' => 2,
    ]);

    $this->actingAs($customer)
        ->post(route('orders.items.store', $order), [
            'items' => [['saucer_id' => $saucer->id, 'quantity' => 1]],
        ])
        ->assertSessionHasErrors('items.0.saucer_id');

    expect($order->items()->count())->toBe(0);
});

it('serves a category from the public menu route', function () {
    $category = Category::create(['name' => 'Postres']);

    $this->get(route('menu.category.show', $category))->assertSuccessful();
});

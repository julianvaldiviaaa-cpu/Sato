<?php

use App\Models\Order;
use App\UserRoles;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('orders.{order}', function ($user, Order $order) {
    return $user->id === $order->worker_id
        || $user->id === $order->customer_id;
});

Broadcast::channel('kitchen', function ($user) {
    return in_array($user->role, [UserRoles::Worker, UserRoles::Admin], true);
});
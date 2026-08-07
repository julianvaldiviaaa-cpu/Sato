<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use App\UserRoles;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRoles::User, UserRoles::Worker], true);
    }

    public function view(User $user, Order $order): bool
    {
        return $order->worker_id === $user->id || $order->customer_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->role === UserRoles::Worker;
    }

    public function update(User $user, Order $order): bool
    {
        return $this->manage($user, $order);
    }

    public function manage(User $user, Order $order): bool
    {
        return $user->role === UserRoles::Worker && $order->worker_id === $user->id;
    }

    public function addItems(User $user, Order $order): bool
    {
        return $this->manage($user, $order)
            || ($user->role === UserRoles::User && $order->customer_id === $user->id);
    }

    public function requestBill(User $user, Order $order): bool
    {
        return $user->role === UserRoles::User && $order->customer_id === $user->id;
    }

    public function join(User $user): bool
    {
        return $user->role === UserRoles::User;
    }
}

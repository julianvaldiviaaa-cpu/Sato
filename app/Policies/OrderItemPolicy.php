<?php

namespace App\Policies;

use App\Models\OrderItem;
use App\Models\User;
use App\UserRoles;

class OrderItemPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === UserRoles::Worker;
    }

    public function view(User $user, OrderItem $orderItem): bool
    {
        return $user->role === UserRoles::Worker;
    }

    public function create(User $user): bool
    {
        return $user->role === UserRoles::Worker;
    }

    public function update(User $user, OrderItem $orderItem): bool
    {
        return $this->updateStatus($user, $orderItem);
    }

    public function updateStatus(User $user, OrderItem $orderItem): bool
    {
        return $user->role === UserRoles::Worker
            && $orderItem->order->worker_id === $user->id;
    }
}

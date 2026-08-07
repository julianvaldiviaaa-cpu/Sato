<?php

namespace App\Policies;

use App\Models\Saucer;
use App\Models\User;
use App\UserRoles;

class SaucerPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === UserRoles::Worker;
    }

    public function view(User $user, Saucer $saucer): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Saucer $saucer): bool
    {
        return false;
    }

    public function delete(User $user, Saucer $saucer): bool
    {
        return false;
    }
}

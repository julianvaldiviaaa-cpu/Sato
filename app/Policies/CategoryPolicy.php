<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;
use App\UserRoles;

class CategoryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === UserRoles::Worker;
    }

    public function view(User $user, Category $category): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Category $category): bool
    {
        return false;
    }

    public function delete(User $user, Category $category): bool
    {
        return false;
    }
}

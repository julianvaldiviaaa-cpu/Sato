<?php

namespace App\Policies;

use App\Models\Ingredient;
use App\Models\User;
use App\UserRoles;

class IngredientPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === UserRoles::Worker;
    }

    public function view(User $user, Ingredient $ingredient): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $user->role === UserRoles::Worker;
    }

    public function update(User $user, Ingredient $ingredient): bool
    {
        return false;
    }

    public function delete(User $user, Ingredient $ingredient): bool
    {
        return false;
    }
}

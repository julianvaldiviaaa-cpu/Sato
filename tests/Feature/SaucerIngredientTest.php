<?php

use App\Models\Category;
use App\Models\Ingredient;
use App\Models\Saucer;
use App\Models\User;

it('agrega un ingrediente a un platillo', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $category = Category::create(['name' => 'Sushis', 'slug' => 'sushis']);
    $saucer = Saucer::create([
        'category_id' => $category->id,
        'name' => 'Sushi culero',
        'slug' => 'sushi-culero',
        'price' => 10,
        'available' => true,
    ]);
    $ingredient = Ingredient::create([
        'name' => 'Salmón',
        'slug' => 'salmon',
        'cost' => 5,
        'stock' => 10,
        'unit' => 'piece',
    ]);

    $this->actingAs($user)->post(route('saucers.ingredients.store', [
        'category' => $category,
        'saucer' => $saucer,
    ]), [
        'ingredient_id' => $ingredient->id,
        'quantity' => 300,
    ])->assertRedirect(route('saucers.manage', [$category, $saucer]));

    $this->assertDatabaseHas('saucer_ingredient', [
        'saucer_id' => $saucer->id,
        'ingredient_id' => $ingredient->id,
        'quantity' => 300,
    ]);
});

it('no duplica un ingrediente ya agregado', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $category = Category::create(['name' => 'Sushis', 'slug' => 'sushis']);
    $saucer = Saucer::create([
        'category_id' => $category->id,
        'name' => 'Sushi culero',
        'slug' => 'sushi-culero',
        'price' => 10,
        'available' => true,
    ]);
    $ingredient = Ingredient::create([
        'name' => 'Salmón',
        'slug' => 'salmon',
        'cost' => 5,
        'stock' => 10,
        'unit' => 'piece',
    ]);

    $saucer->ingredients()->attach($ingredient);

    $this->actingAs($user)->post(route('saucers.ingredients.store', [
        'category' => $category,
        'saucer' => $saucer,
    ]), [
        'ingredient_id' => $ingredient->id,
        'quantity' => 200,
    ])->assertRedirect(route('saucers.manage', [$category, $saucer]));

    $this->assertSame(1, $saucer->ingredients()->count());
});

it('elimina un ingrediente de un platillo', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $category = Category::create(['name' => 'Sushis', 'slug' => 'sushis']);
    $saucer = Saucer::create([
        'category_id' => $category->id,
        'name' => 'Sushi culero',
        'slug' => 'sushi-culero',
        'price' => 10,
        'available' => true,
    ]);
    $ingredient = Ingredient::create([
        'name' => 'Salmón',
        'slug' => 'salmon',
        'cost' => 5,
        'stock' => 10,
        'unit' => 'piece',
    ]);

    $saucer->ingredients()->attach($ingredient);

    $this->actingAs($user)->delete(route('saucers.ingredients.destroy', [
        'category' => $category,
        'saucer' => $saucer,
        'ingredient' => $ingredient,
    ]))->assertRedirect(route('saucers.manage', [$category, $saucer]));

    $this->assertDatabaseMissing('saucer_ingredient', [
        'saucer_id' => $saucer->id,
        'ingredient_id' => $ingredient->id,
    ]);
});

it('actualiza la cantidad de un ingrediente en un platillo', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $category = Category::create(['name' => 'Sushis', 'slug' => 'sushis']);
    $saucer = Saucer::create([
        'category_id' => $category->id,
        'name' => 'Sushi culero',
        'slug' => 'sushi-culero',
        'price' => 10,
        'available' => true,
    ]);
    $ingredient = Ingredient::create([
        'name' => 'Salmón',
        'slug' => 'salmon',
        'cost' => 5,
        'stock' => 10,
        'unit' => 'piece',
    ]);

    $saucer->ingredients()->attach($ingredient, ['quantity' => 2]);

    $this->actingAs($user)->patch(route('saucers.ingredients.update', [
        'category' => $category,
        'saucer' => $saucer,
        'ingredient' => $ingredient,
    ]), [
        'quantity' => 4,
    ])->assertRedirect(route('saucers.manage', [$category, $saucer]));

    $this->assertDatabaseHas('saucer_ingredient', [
        'saucer_id' => $saucer->id,
        'ingredient_id' => $ingredient->id,
        'quantity' => 4,
    ]);
});

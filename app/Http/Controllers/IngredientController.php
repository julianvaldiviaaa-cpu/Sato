<?php

namespace App\Http\Controllers;

use App\Http\Requests\IngredientRequest;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class IngredientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', Ingredient::class);
        $ingredients = Ingredient::latest()->paginate(12);
        return Inertia::render("Dashboard/Ingredients/Ingredients", [
            "ingredients" => $ingredients
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Ingredient::class);
        return Inertia::render("Dashboard/Ingredients/IngredientCreate");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(IngredientRequest $request)
    {
        Gate::authorize('create', Ingredient::class);
        $data = $request->validated();
        $ingredient = Ingredient::create($data);

        return redirect()->route("ingredients.show", $ingredient)->with("success", "Ingrediente Creado Correctamente");
    }

    /**
     * Display the specified resource.
     */
    public function show(Ingredient $ingredient)
    {
        Gate::authorize('view', $ingredient);
        return Inertia::render("Dashboard/Ingredients/IngredientShow", [
            "ingredient" => $ingredient
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ingredient $ingredient)
    {
        Gate::authorize('update', $ingredient);
        return Inertia::render("Dashboard/Ingredients/IngredientEdit", [
            "ingredient" => $ingredient,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(IngredientRequest $request, Ingredient $ingredient)
    {
        Gate::authorize('update', $ingredient);
        $data = $request->validated();
        $ingredient->update($data);

        return redirect()->route("ingredients.show", $ingredient)->with("success", "Ingrediente Actualizado Correctamente");
    }

    public function increaseStock(Ingredient $ingredient)
    {
        Gate::authorize('update', $ingredient);
        $ingredient->increment('stock');
    }

    public function decreaseStock(Ingredient $ingredient)
    {
        Gate::authorize('update', $ingredient);
        if ($ingredient->stock > 0) {
            $ingredient->decrement('stock');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ingredient $ingredient)
    {
        Gate::authorize('delete', $ingredient);
        $ingredient->delete();

        return redirect()->route("ingredients")->with("success", "Ingrediente Eliminado Correctamente");
    }
}

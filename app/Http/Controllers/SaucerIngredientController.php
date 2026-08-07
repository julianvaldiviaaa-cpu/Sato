<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaucerIngredientRequest;
use App\Models\Category;
use App\Models\Ingredient;
use App\Models\Saucer;
use Illuminate\Support\Facades\Gate;

class SaucerIngredientController extends Controller
{
    /**
     * Agrega un ingrediente a un platillo.
     */
    public function store(
        SaucerIngredientRequest $request,
        Category $category,
        Saucer $saucer
    ) {
        Gate::authorize('update', $saucer);
        $saucer->ingredients()->syncWithoutDetaching([
            $request->validated('ingredient_id') => [
                'quantity' => $request->validated('quantity'),
            ],
        ]);

        return redirect()
            ->route('saucers.manage', [$category, $saucer])
            ->with('success', 'Ingrediente agregado al platillo correctamente.');
    }

    /**
     * Actualiza la cantidad de un ingrediente en un platillo.
     */
    public function update(
        SaucerIngredientRequest $request,
        Category $category,
        Saucer $saucer,
        Ingredient $ingredient
    ) {
        Gate::authorize('update', $saucer);
        $saucer->ingredients()->updateExistingPivot($ingredient, [
            'quantity' => $request->validated('quantity'),
        ]);

        return redirect()
            ->route('saucers.manage', [$category, $saucer])
            ->with('success', 'Cantidad del ingrediente actualizada correctamente.');
    }

    /**
     * Elimina un ingrediente de un platillo.
     */
    public function destroy(
        Category $category,
        Saucer $saucer,
        Ingredient $ingredient
    ) {
        Gate::authorize('update', $saucer);
        $saucer->ingredients()->detach($ingredient);

        return redirect()
            ->route('saucers.manage', [$category, $saucer])
            ->with('success', 'Ingrediente eliminado del platillo correctamente.');
    }
}

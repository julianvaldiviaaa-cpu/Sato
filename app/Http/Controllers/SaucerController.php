<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaucerRequest;
use App\Models\Category;
use App\Models\Ingredient;
use App\Models\Saucer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SaucerController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(Category $category)
    {
        Gate::authorize('create', $category);
        return Inertia::render("Dashboard/Saucers/SaucerCreate", [
            "category" => $category,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SaucerRequest $request, Category $category)
    {
        Gate::authorize('create', $category);
        $data = $request->validated();
        $saucer = $category->saucers()->create($data);

        return redirect()->route("saucers.manage", [$category, $saucer])->with("success", "Platillo creado Correctamente");
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category, Saucer $saucer)
    {
        Gate::authorize('view', $category);
        Gate::authorize('view', $saucer);

        $saucer->load('images');


        return Inertia::render("Dashboard/Saucers/SaucerShow", [
            "category" => $category,
            "saucer" => $saucer,
        ]);
    }

    public function manage(Category $category, Saucer $saucer)
    {
        Gate::authorize('view', $category);
        Gate::authorize('view', $saucer);
        Gate::authorize('viewAny', Ingredient::class);
        $saucer->load(['images', 'ingredients']);

        return Inertia::render("Dashboard/Saucers/SaucerManage", [
            "category" => $category,
            "saucer" => $saucer,
            "ingredients" => Ingredient::orderBy("name")->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category, Saucer $saucer)
    {
        Gate::authorize('update', $saucer);
        return Inertia::render("Dashboard/Saucers/SaucerEdit", [
            "category" => $category,
            "saucer" => $saucer,
        ]);
    }

    public function updateStatus(Request $request, Category $category, Saucer $saucer)
    {
        Gate::authorize('update', $saucer);
        $data = $request->validate([
            "available" => ["required", "boolean"],
        ]);

        $saucer->update($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SaucerRequest $request, Category $category, Saucer $saucer)
    {
        Gate::authorize('update', $saucer);
        $data = $request->validated();
        $saucer->update($data);

        return redirect()->route("saucers.manage", [$category, $saucer])->with("success", "Platillo Actualizado Correctamente");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category, Saucer $saucer)
    {
        Gate::authorize('delete', $saucer);
        $saucer->delete();

        return redirect()->route("categories.show", $category)->with("success", "Platillo Eliminado Correctamente");
    }
}

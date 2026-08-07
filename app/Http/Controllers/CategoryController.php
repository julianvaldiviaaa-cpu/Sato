<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', Category::class);
        $categories = Category::latest()->paginate(10);
        return Inertia::render("Dashboard/Categories/Categories", [
            "categories" => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Category::class);
        return Inertia::render("Dashboard/Categories/CategoryCreate");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        Gate::authorize('create', Category::class);
        $data = $request->validated();
        $category = Category::create($data);

        return redirect()->route("categories.show", $category)->with("success", "Categoria Creada Correctamente");
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        Gate::authorize('view', $category);
        $category->load([
            "saucers" => fn ($query) => $query->latest(),
        ]);

        return Inertia::render("Dashboard/Categories/CategoryShow", [
            "category" => $category,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        Gate::authorize('update', $category);
        return Inertia::render("Dashboard/Categories/CategoryEdit", [
            "category" => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        Gate::authorize('update', $category);
        $data = $request->validated();
        $category->update($data);

        return redirect()->route("categories.show", $category)->with("success", "Categoria Actualizada Correctamente");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        Gate::authorize('delete', $category);
        $category->delete();

        return redirect()->route("categories")->with("success", "Categoria Eliminada Correctamente");
    }
}

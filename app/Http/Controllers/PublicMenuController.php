<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;

class PublicMenuController extends Controller
{
    public function index(){

        $categories = Category::with("saucers")->latest()->paginate();

        return Inertia::render("Public/Menu/Categories", [
            "categories" => $categories
        ]);
    }

    public function show(Category $category)
    {
        $categories = Category::with('saucers')
            ->whereKey($category->id)
            ->paginate();

        return Inertia::render('Public/Menu/Categories', [
            'categories' => $categories,
        ]);
    }
}

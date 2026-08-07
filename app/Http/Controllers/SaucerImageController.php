<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaucerImageRequest;
use App\Models\Category;
use App\Models\Saucer;
use App\Models\SaucerImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;

class SaucerImageController extends Controller
{
    /**
     * Guarda una nueva imagen del platillo.
     */
    public function store(
        SaucerImageRequest $request,
        Category $category,
        Saucer $saucer
    ) {
        Gate::authorize('update', $saucer);
        $data = $request->validated();

        $image = $request->file('image')->store('saucers', 'public');

        $position = $saucer->images()->max('position') + 1;

        $saucer->images()->create([
            'image' => $image,
            'position' => $position,
        ]);

        return redirect()
            ->route('saucers.manage', [$category, $saucer])
            ->with('success', 'Imagen agregada correctamente.');
    }

    /**
     * Actualiza la posición de una imagen.
     */
    public function updatePosition(
        Request $request,
        Category $category,
        Saucer $saucer,
        SaucerImage $image
    ) {
        Gate::authorize('update', $saucer);
        $data = $request->validate([
            'position' => ['required', 'integer', 'min:0'],
        ]);

        $image->update($data);

        return back()->with('success', 'Posición actualizada.');
    }

    /**
     * Elimina una imagen.
     */
    public function destroy(
        Category $category,
        Saucer $saucer,
        SaucerImage $image
    ) {
        Gate::authorize('update', $saucer);
        Storage::disk('public')->delete($image->image);

        $image->delete();

        return redirect()
            ->route('saucers.manage', [$category, $saucer])
            ->with('success', 'Imagen eliminada correctamente.');
    }
}

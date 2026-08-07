<?php

namespace App\Models;

use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Summary of Ingredient
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property float $cost
 * @property float $stock
 * @property string $unit
 * @property string $slug
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */

#[Fillable(["name", "description", "cost", "stock", "unit", "slug"])]
class Ingredient extends Model
{
    protected static function booted(): void
    {
        static::creating(function (Ingredient $ingredient) {
            $ingredient->slug = static::generateUniqueSlug($ingredient->name);
        });


        static::updating(function (Ingredient $ingredient) {
            if ($ingredient->isDirty('name')) {
                $ingredient->slug = static::generateUniqueSlug($ingredient->name, $ingredient->id);
            }
        });
    }

    protected static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        while (
            static::when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }

    public function getRouteKeyName(): string
    {
        return "slug";
    }

    protected function casts(): array
    {
        return [
            'cost' => 'decimal:2',
            'stock' => 'decimal:2',
        ];
    }

    public function saucers(): BelongsToMany
    {
        return $this->belongsToMany(Saucer::class, 'saucer_ingredient')
            ->withPivot('quantity');
    }
}

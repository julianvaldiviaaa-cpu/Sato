<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Summary of Saucer
 * @property int $id
 * @property int $category_id
 * @property string $name
 * @property string|null $description
 * @property float $price
 * @property bool $available
 * @property string $slug
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */

#[Fillable(["category_id", "name", "description", "price", "available", "slug"])]
class Saucer extends Model
{
    protected static function booted(): void
    {
        static::creating(function (Saucer $saucer) {
            $saucer->slug = static::generateUniqueSlug($saucer->name);
        });


        static::updating(function (Saucer $saucer) {
            if ($saucer->isDirty('name')) {
                $saucer->slug = static::generateUniqueSlug($saucer->name, $saucer->id);
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

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(SaucerImage::class)
            ->orderBy('position');
    }

    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'saucer_ingredient')
            ->withPivot('quantity')
            ->orderBy('name');
    }
}

<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Summary of SaucerImage
 *
 * @property int $id
 * @property int $saucer_id
 * @property string $image
 * @property int $position
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'saucer_id',
    'image',
    'position',
])]
class SaucerImage extends Model
{
    /**
     * Obtiene el platillo al que pertenece la imagen.
     */
    public function saucer(): BelongsTo
    {
        return $this->belongsTo(Saucer::class);
    }
}

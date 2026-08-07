<?php

namespace App\Models;

use App\Enums\OrderItemStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Summary of OrderItem
 * @property int $id
 * @property int $order_id
 * @property int $saucer_id
 * @property int $quantity
 * @property float $unit_price
 * @property float $subtotal
 * @property OrderItemStatus $status
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'order_id',
    'saucer_id',
    'quantity',
    'unit_price',
    'subtotal',
    'status',
    'notes',
])]
class OrderItem extends Model
{
    protected $attributes = [
        'quantity' => 1,
        'unit_price' => 0,
        'subtotal' => 0,
        'status' => 'pending',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'status' => OrderItemStatus::class,
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function saucer(): BelongsTo
    {
        return $this->belongsTo(Saucer::class);
    }
}
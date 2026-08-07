<?php

namespace App\Models;

use App\Enums\OrderPaymentMethod;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;

/**
 * Summary of order
 * @property int $id
 * @property int $worker_id
 * @property int|null $customer_id
 * @property int $table_number
 * @property int $code
 * @property string|null $folio
 * @property string $status
 * @property Carbon|null $customer_joined_at
 * @property Carbon|null $bill_requested_at
 * @property OrderPaymentMethod|null $payment_method
 * @property int $subtotal
 * @property int $tax
 * @property int $total
 * @property Carbon|null $paid_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'worker_id',
    'customer_id',
    'table_number',
    'code',
    'folio',
    'status',
    'customer_joined_at',
    'bill_requested_at',
    'payment_method',
    'subtotal',
    'tax',
    'total',
    'paid_at',
])]
class Order extends Model
{
    protected function casts(): array
    {
        return [
            'customer_joined_at' => 'datetime',
            'bill_requested_at' => 'datetime',
            'payment_method' => OrderPaymentMethod::class,
            'paid_at' => 'datetime',
            'subtotal' => 'decimal:2',
            'tax' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }
    protected static function booted(): void
    {
        static::creating(function (Order $order) {

            do {
                $code = str_pad(
                    (string) random_int(0, 999999),
                    6,
                    '0',
                    STR_PAD_LEFT
                );
            } while (
                self::where('code', $code)->exists()
            );

            $order->code = $code;
        });
    }

    public function worker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'worker_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}

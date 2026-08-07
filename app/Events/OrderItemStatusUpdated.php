<?php

namespace App\Events;

use App\Models\OrderItem;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderItemStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(public OrderItem $orderItem)
    {
    }

    public function broadcastOn(): Channel|array
    {
        return [
            new PrivateChannel('orders.'.$this->orderItem->order_id),
            new PrivateChannel('kitchen'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'item.status.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'order_id' => $this->orderItem->order_id,
            'order_item_id' => $this->orderItem->id,
            'saucer_name' => $this->orderItem->saucer?->name,
            'status' => $this->orderItem->status->value,
        ];
    }
}
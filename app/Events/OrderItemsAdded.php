<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderItemsAdded implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(public Order $order, public array $itemIds = [])
    {
    }

    public function broadcastOn(): Channel|array
    {
        return [
            new PrivateChannel('orders.'.$this->order->id),
            new PrivateChannel('kitchen'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'items.added';
    }

    public function broadcastWith(): array
    {
        return [
            'order_id' => $this->order->id,
            'item_ids' => $this->itemIds,
        ];
    }
}
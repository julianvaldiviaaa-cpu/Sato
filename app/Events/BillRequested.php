<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BillRequested implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(public Order $order)
    {
    }

    public function broadcastOn(): Channel|array
    {
        return new PrivateChannel('orders.'.$this->order->id);
    }

    public function broadcastAs(): string
    {
        return 'bill.requested';
    }

    public function broadcastWith(): array
    {
        return [
            'order_id' => $this->order->id,
        ];
    }
}
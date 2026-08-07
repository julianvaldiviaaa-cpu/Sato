<?php

namespace App\Http\Controllers;

use App\UserRoles;
use App\Events\OrderItemStatusUpdated;
use App\Http\Requests\OrderItemStatusRequest;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class KitchenController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', OrderItem::class);

        $ordersQuery = Order::with(['items.saucer', 'customer'])
            ->where('status', 'open')
            ->latest();

        if (request()->user()->role === UserRoles::Worker) {
            $ordersQuery->whereBelongsTo(request()->user(), 'worker');
        }

        $orders = $ordersQuery->get();

        return Inertia::render('Kitchen/Kitchen', [
            'orders' => $orders,
        ]);
    }

    public function updateStatus(OrderItemStatusRequest $request, OrderItem $orderItem)
    {
        Gate::authorize('updateStatus', $orderItem);
        abort_unless($orderItem->order->status === 'open', 403);

        $orderItem->update(['status' => $request->validated('status')]);

        OrderItemStatusUpdated::dispatch($orderItem);

        return back();
    }
}

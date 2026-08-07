<?php

namespace App\Http\Controllers;

use App\Enums\OrderItemStatus;
use App\Events\BillRequested;
use App\Events\OrderItemsAdded;
use App\Http\Requests\JoinOrderRequest;
use App\Http\Requests\OrderBillRequest;
use App\Http\Requests\OrderItemRequest;
use App\Http\Requests\OrderRequest;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Saucer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class OrderController extends Controller
{
    private const TAX_RATE = 0.16;

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('viewAny', Order::class);

        return Inertia::render("Orders/OrderCreate");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OrderRequest $request)
    {
        Gate::authorize('create', Order::class);

        $data = $request->validated();
        $order = Order::create([
            "table_number" => $data["table_number"],
            "worker_id" => $request->user()->id,
        ]);

        return redirect()->route("orders.show", $order)->with("success", "Orden creada correctamente. Ya puedes compartir el codigo con el cliente");
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        Gate::authorize('view', $order);

        $categories = Category::with("saucers.images")->latest()->paginate(20);

        return Inertia::render('Orders/OrderShow', [
            'order' => $order->load(['worker', 'customer', 'items.saucer.images']),
            'categories' => $categories
        ]);
    }

    public function storeItems(OrderItemRequest $request, Order $order)
    {
        Gate::authorize('addItems', $order);

        $itemIds = DB::transaction(function () use ($order, $request) {
            $order = Order::query()
                ->lockForUpdate()
                ->findOrFail($order->id);

            abort_unless($order->status === 'open', 403);

            $saucers = Saucer::query()
                ->where('available', true)
                ->whereIn('id', collect($request->validated('items'))->pluck('saucer_id'))
                ->get()
                ->keyBy('id');

            $itemIds = [];
            foreach ($request->items as $item) {
                $saucer = $saucers[$item['saucer_id']];
                $quantity = $item['quantity'];
                $lineSubtotal = $saucer->price * $quantity;

                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'saucer_id' => $saucer->id,
                    'quantity' => $quantity,
                    'unit_price' => $saucer->price,
                    'subtotal' => $lineSubtotal,
                    'status' => OrderItemStatus::Pending,
                    'notes' => $item['notes'] ?? null,
                ]);

                $itemIds[] = $orderItem->id;
            }

            $subtotal = (float) $order->items()->sum('subtotal');
            $tax = round($subtotal * static::TAX_RATE, 2);

            $order->update([
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $subtotal + $tax,
            ]);

            return $itemIds;
        });

        OrderItemsAdded::dispatch($order, $itemIds);

        return back()->with('success', 'Tu pedido se ha enviado a la cocina.');
    }

    public function requestBill(OrderBillRequest $request, Order $order)
    {
        Gate::authorize('requestBill', $order);
        abort_unless($order->status === 'open', 403);

        if ($order->bill_requested_at === null) {
            $order->update([
                'bill_requested_at' => now(),
                'payment_method' => $request->validated('payment_method'),
            ]);

            BillRequested::dispatch($order);
        }

        return back()->with('success', 'Has solicitado la cuenta.');
    }

    public function invoice(Order $order)
    {
        Gate::authorize('view', $order);

        $this->ensureFolio($order);

        return Inertia::render('Orders/OrderInvoice', [
            'order' => $order->load(['worker', 'customer', 'items.saucer']),
            'business' => config('invoice'),
        ]);
    }

    public function markPaid(Order $order)
    {
        Gate::authorize('manage', $order);
        abort_unless(
            $order->status === 'open',
            403
        );

        $order->update([
            'paid_at' => now(),
            'status' => 'completed',
        ]);

        return back()->with('success', 'Orden marcada como pagada.');
    }

    private function ensureFolio(Order $order): void
    {
        if ($order->folio !== null) {
            return;
        }

        $prefix = config('invoice.folio_prefix', 'F');
        $year = now()->year;
        $pattern = "{$prefix}-{$year}-";

        $last = Order::where('folio', 'like', "{$pattern}%")
            ->orderByDesc('folio')
            ->pluck('folio')
            ->first();

        $next = $last ? intval(substr($last, strlen($pattern))) + 1 : 1;

        $order->update([
            'folio' => $pattern . str_pad((string) $next, 4, '0', STR_PAD_LEFT),
        ]);
    }

    public function join(JoinOrderRequest $request)
    {
        Gate::authorize('join', Order::class);

        $order = Order::where("code", $request->code)->whereNull("customer_id")->firstOrFail();

        $order->update([
            "customer_id" => auth()->id(),
            "customer_joined_at" => now(),
            "code" => null,
        ]);


        return redirect()->route('orders.show', $order)
            ->with('success', 'Te has unido a la orden correctamente.');

    }
}

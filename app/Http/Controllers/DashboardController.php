<?php

namespace App\Http\Controllers;

use App\UserRoles;
use App\Models\Category;
use App\Models\Ingredient;
use App\Models\Order;
use App\Models\Saucer;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Order::class);

        $user = Auth::user();

        $data = [
            'stats' => [
                'categories' => Category::count(),
                'ingredients' => Ingredient::count(),
                'saucers' => Saucer::count(),
            ],
        ];

        if ($user->role === UserRoles::Admin) {
            $data['orderStats'] = [
                'today' => $this->orderStats($this->periodStart('today')),
                'week' => $this->orderStats($this->periodStart('week')),
                'month' => $this->orderStats($this->periodStart('month')),
                'year' => $this->orderStats($this->periodStart('year')),
            ];
        }

        if ($user->role === UserRoles::Worker) {
            $activeOrders = Order::with(['customer', 'items.saucer'])
                ->where('worker_id', $user->id)
                ->where('status', 'open')
                ->latest()
                ->get();

            $attendedOrders = Order::with(['customer', 'items.saucer'])
                ->where('worker_id', $user->id)
                ->where('status', 'completed')
                ->latest()
                ->get();

            $data['activeOrders'] = $activeOrders;
            $data['attendedOrders'] = $attendedOrders;
        }

        if ($user->role === UserRoles::User) {
            $activeOrder = Order::with(['worker', 'items.saucer'])
                ->where('customer_id', $user->id)
                ->where('status', 'open')
                ->latest()
                ->first();

            $orders = Order::with(['worker', 'items.saucer'])
                ->where('customer_id', $user->id)
                ->latest()
                ->get();

            $data['activeOrder'] = $activeOrder;
            $data['orders'] = $orders;
        }

        return Inertia::render('Dashboard/Dashboard', $data);
    }

    public function ordersByPeriod(string $period)
    {
        abort_unless(in_array($period, ['today', 'week', 'month', 'year'], true), 404);
        Gate::authorize('viewAny', Order::class);

        $orders = Order::with(['worker', 'customer'])
            ->where('created_at', '>=', $this->periodStart($period))
            ->latest('created_at')
            ->paginate(15);

        return Inertia::render('Dashboard/Roles/AdminOrders', [
            'orders' => $orders,
            'period' => $period,
            'summary' => $this->orderStats($this->periodStart($period)),
        ]);
    }

    private function orderStats(CarbonInterface $start): array
    {
        $row = Order::query()
            ->where('created_at', '>=', $start)
            ->selectRaw('COUNT(*) as count, COALESCE(SUM(total), 0) as total')
            ->first();

        return [
            'count' => (int) $row->count,
            'total' => (float) $row->total,
        ];
    }

    private function periodStart(string $period): CarbonInterface
    {
        return match ($period) {
            'week' => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            'year' => now()->startOfYear(),
            default => now()->startOfDay(),
        };
    }
}

<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\KitchenController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\LogoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PublicMenu;
use App\Http\Controllers\PublicMenuController;
use App\Http\Controllers\SaucerController;
use App\Http\Controllers\SaucerImageController;
use App\Http\Controllers\SaucerIngredientController;
use App\Http\Controllers\SignupController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

// ================ Auth =================
Route::get("/signup", [SignupController::class, "index"])->name("signup");
Route::post("/signup", [SignupController::class, "store"])->name("signup.store");

Route::get("/login", [LoginController::class, "index"])->name("login");
Route::post("/login", [LoginController::class, "store"])->middleware('throttle:5,1')->name("login.store");

Route::post("/logout", [LogoutController::class, "store"])->name("logout");

Route::get("/email/verify", function () {
    return Inertia::render("Auth/EmailVerify");
})->middleware("auth")->name("verification.notice");

Route::get("/email/verify/{id}/{hash}", function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect()->route("dashboard")->with("success", "Tu correo electrónico ha sido verificado. Empieza Creando tu Primer Presupuesto!");
})->middleware(['auth', 'signed',])->name("verification.verify");

Route::post("email/verify/resend", function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return back()->with("success", "Se ha enviado un correo electrónico de verificación a tu dirección electrónico.");
})->middleware(["auth", "throttle:1,1"])->name("verification.send");


Route::prefix('orders')
    ->middleware(['auth', 'verified'])
    ->controller(OrderController::class)
    ->group(function () {

        Route::get('create', 'create')->name('orders.create');
        Route::post('/', 'store')->name('orders.store');

        Route::prefix('{order}')->scopeBindings()->group(function () {
            Route::get('/', 'show')->name('orders.show');
            Route::post('items', 'storeItems')->name('orders.items.store');
            Route::post('request-bill', 'requestBill')->name('orders.request-bill');
            Route::get('invoice', 'invoice')->name('orders.invoice');
            Route::post('pay', 'markPaid')->name('orders.pay');
        });

        // Cliente
        Route::put('join', 'join')->name('orders.join');
    });


Route::prefix('kitchen')
    ->middleware(['auth', 'verified'])
    ->controller(KitchenController::class)
    ->group(function () {
        Route::get('/', 'index')->name('kitchen');
        Route::patch('items/{orderItem}/status', 'updateStatus')->name('kitchen.items.status');
    });

Route::prefix("menu")->group(function () {
    Route::get("categories", [PublicMenuController::class, "index"])->name("menu.categories");
    Route::prefix("{category}")->group(function(){
        Route::get("/", [PublicMenuController::class, "show"])->name("menu.category.show");
    });
});


Route::prefix("dashboard")->scopeBindings()->middleware(["auth", "verified"])->group(function () {
    Route::get("/", [DashboardController::class, "index"])->name("dashboard");
    Route::get("orders/{period}", [DashboardController::class, "ordersByPeriod"])->name("dashboard.orders");

    Route::prefix("ingredients")
        ->controller(IngredientController::class)
        ->group(function () {
            Route::get("/", "index")->name("ingredients");
            Route::get("create", "create")->name("ingredients.create");
            Route::post("/", "store")->name("ingredients.store");

            Route::prefix("{ingredient}")->group(function () {
                Route::get("/", "show")->name("ingredients.show");
                Route::get("edit", "edit")->name("ingredients.edit");
                Route::put("/", "update")->name("ingredients.update");
                Route::patch("increment", [IngredientController::class, "increaseStock"])->name("ingredients.increment");
                Route::patch("decrement", [IngredientController::class, "decreaseStock"])->name("ingredients.decrement");
                Route::delete("/", "destroy")->name("ingredients.destroy");
            });

        });

    Route::prefix("categories")->group(function () {
        Route::get("/", [CategoryController::class, "index"])->name("categories");
        Route::get("create", [CategoryController::class, "create"])->name("categories.create");
        Route::post("/", [CategoryController::class, "store"])->name("categories.store");

        Route::prefix("{category}")->group(function () {
            Route::get("/", [CategoryController::class, "show"])->name("categories.show");
            Route::get("edit", [CategoryController::class, "edit"])->name("categories.edit");
            Route::put("/", [CategoryController::class, "update"])->name("categories.update");
            Route::delete("/", [CategoryController::class, "destroy"])->name("categories.destroy");

            Route::prefix("saucers")->group(function () {
                Route::get("/create", [SaucerController::class, "create"])->name("saucers.create");
                Route::post("/", [SaucerController::class, "store"])->name("saucers.store");

                Route::prefix("{saucer}")->group(function () {
                    Route::get("/", [SaucerController::class, "show"])->name("saucers.show");
                    Route::get("manage", [SaucerController::class, "manage"])->name("saucers.manage");
                    Route::get("edit", [SaucerController::class, "edit"])->name("saucers.edit");
                    Route::put("/", [SaucerController::class, "update"])->name("saucers.update");
                    Route::patch("status", [SaucerController::class, "updateStatus"])->name("saucers.status");
                    Route::delete("/", [SaucerController::class, "destroy"])->name("saucers.destroy");


                    Route::prefix("images")->group(function () {

                        Route::post("/", [SaucerImageController::class, "store"])
                            ->name("saucers.images.store");

                        Route::patch("{image}/position", [SaucerImageController::class, "updatePosition"])
                            ->name("saucers.images.position");

                        Route::delete("{image}", [SaucerImageController::class, "destroy"])
                            ->name("saucers.images.destroy");

                    });

                    Route::prefix("ingredients")->group(function () {
                        Route::post("/", [SaucerIngredientController::class, "store"])
                            ->name("saucers.ingredients.store");

                        Route::patch("{ingredient}", [SaucerIngredientController::class, "update"])
                            ->name("saucers.ingredients.update");

                        Route::delete("{ingredient}", [SaucerIngredientController::class, "destroy"])
                            ->name("saucers.ingredients.destroy");
                    });


                });

            });

        });

    });

});

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->index();
            $table->foreignId('saucer_id')->index();
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('unit_price')->default(0);
            $table->decimal('subtotal')->default(0);
            $table->enum('status', [
                'pending',
                'preparing',
                'ready',
                'delivered',
                'cancelled',
            ])->default('pending');
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->foreign('order_id', 'order_items_order_id_foreign')
                ->references('id')->on('orders')->cascadeOnDelete();
            $table->foreign('saucer_id', 'order_items_saucer_id_foreign')
                ->references('id')->on('saucers')->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};

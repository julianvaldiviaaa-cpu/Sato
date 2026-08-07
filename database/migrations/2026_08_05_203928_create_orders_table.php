<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_id')
                ->constrained('users')
                ->restrictOnDelete();
            $table->foreignId("customer_id")->nullable()->constrained("users")->nullOnDelete();
            $table->unsignedSmallInteger('table_number');
            $table->string('code', 6)->nullable();
            $table->enum('status', [
                'open',
                'completed',
                'cancelled',
            ])->default('open');
            $table->timestamp('customer_joined_at')->nullable();
            $table->decimal("subtotal")->nullable();
            $table->decimal("tax")->nullable();
            $table->decimal("total")->nullable();
            $table->timestamp("paid_at")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

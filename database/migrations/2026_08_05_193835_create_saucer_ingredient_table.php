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
        Schema::create('saucer_ingredient', function (Blueprint $table) {
            $table->id();
            $table->foreignId('saucer_id')
                ->constrained('saucers')
                ->cascadeOnDelete();
            $table->foreignId('ingredient_id')
                ->constrained('ingredients')
                ->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['saucer_id', 'ingredient_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saucer_ingredient');
    }
};

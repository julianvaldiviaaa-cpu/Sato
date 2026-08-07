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
        Schema::create('saucer_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('saucer_id')
        ->constrained("saucers")
        ->cascadeOnDelete();

            $table->string('image');

            $table->unsignedInteger('position')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saucer_images');
    }
};

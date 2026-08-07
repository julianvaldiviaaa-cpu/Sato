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

        Schema::table('saucers', function (Blueprint $table) {
            $table->text('description')->nullable()->change();

            if (! Schema::hasColumn('saucers', 'category_id')) {
                $table->foreignId("category_id")->constrained("categories")->cascadeOnDelete();
            }

            if (! Schema::hasColumn('saucers', 'available')) {
                $table->boolean("available")->default(true);
            }

            if (! Schema::hasColumn('saucers', 'slug')) {
                $table->string('slug')->unique();
            }
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('saucers', function (Blueprint $table) {
            //
        });
    }
};

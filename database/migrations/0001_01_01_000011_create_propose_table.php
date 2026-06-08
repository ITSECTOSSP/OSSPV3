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
        Schema::create('legislative_propose', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('propose_no');

            $table->text('propose_title');

            $table->foreignId('city_council_id')
                ->constrained('legislative_city_council')
                ->nullable()
                ->cascadeOnDelete();

            $table->foreignId('measure_type_id')
                ->constrained('legislative_measure_type')
                ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('propose');
    }
};

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
        Schema::create('legislative_approve', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->text('approve_title');
            $table->string('approve_no');

            $table->date('enact_adopt_date')->nullable();
            $table->year('series_year')->nullable();

            // ✅ FIXED: propose_id (UUID FK nullable safe)
            $table->uuid('propose_id')->nullable();
            $table->foreign('propose_id')
                ->references('id')
                ->on('legislative_propose')
                ->nullOnDelete();

            // ✅ FIXED: city council FK (nullable BEFORE constraint safety)
            $table->unsignedBigInteger('city_council_id')->nullable();
            $table->foreign('city_council_id')
                ->references('id')
                ->on('legislative_city_council')
                ->nullOnDelete();

            // measure type (required)
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
        Schema::dropIfExists('approve_');
    }
};

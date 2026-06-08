<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('legislative_propose_councilor', function (Blueprint $table) {
            $table->id();

            $table->foreignUuid('legislative_propose_id')
                ->constrained('legislative_propose')
                ->cascadeOnDelete();

            $table->foreignId('councilor_id')
                ->constrained('legislative_city_councilor')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique(
                ['legislative_propose_id', 'councilor_id'],
                'propose_councilor_unique'
            );

            $table->index('legislative_propose_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('legislative_propose_councilor');
    }
};
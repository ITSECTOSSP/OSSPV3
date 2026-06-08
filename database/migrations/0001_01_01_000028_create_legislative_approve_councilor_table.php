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
        Schema::create('legislative_approve_councilor', function (Blueprint $table) {
            $table->id();

            $table->foreignUuid('legislative_approve_id')
                ->constrained('legislative_approve')
                ->cascadeOnDelete();

            $table->foreignId('councilor_id')
                ->constrained('legislative_city_councilor')
                ->cascadeOnDelete();

            $table->enum('role', ['introducer', 'co_introducer']);

            $table->timestamps();

            // ✅ prevent duplicates
            $table->unique(
                ['legislative_approve_id', 'councilor_id', 'role'],
                'approve_councilor_role_unique'
            );

            // ✅ faster filtering
            $table->index(['legislative_approve_id', 'role']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legislative_approve_councilor');
    }
};

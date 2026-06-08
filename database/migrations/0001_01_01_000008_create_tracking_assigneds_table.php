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
        Schema::create('tracking_assigneds', function (Blueprint $table) {
            $table->id();
            $table->string('assigned_remarks')
                ->nullable();

                // ✅ Fk
        $table->unsignedBigInteger('tracking_titles_id');
        $table->foreign('tracking_titles_id')
              ->references('id')
              ->on('tracking_titles')
              ->cascadeOnDelete();

                // ✅ Fk
        $table->unsignedBigInteger('ossp_sections_id');
        $table->foreign('ossp_sections_id')
              ->references('id')
              ->on('ossp_sections')
              ->cascadeOnDelete();

                // ✅ Fk
        $table->unsignedBigInteger('tracking_assigned_statuses_id');
        $table->foreign('tracking_assigned_statuses_id')
              ->references('id')
              ->on('tracking_assigned_statuses')
              ->cascadeOnDelete();

              $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracking_assigneds');
    }
};

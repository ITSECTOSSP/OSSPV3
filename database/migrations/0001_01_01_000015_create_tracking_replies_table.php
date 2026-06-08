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
        Schema::create('tracking_replies', function (Blueprint $table) {
            $table->id();

            // Relation to tracking title
            $table->foreignId('tracking_titles_id')
                  ->constrained('tracking_titles')
                  ->cascadeOnDelete();

            // Section that replied
            $table->foreignId('ossp_sections_id')
                  ->constrained('ossp_sections')
                  ->cascadeOnDelete();

            // Reply remarks
            $table->text('reply_remarks');

            // User tracking
            $table->foreignId('created_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->foreignId('updated_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tracking_replies');
    }
};
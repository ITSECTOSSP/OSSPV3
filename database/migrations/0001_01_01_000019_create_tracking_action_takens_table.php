<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tracking_action_takens', function (Blueprint $table) {
            $table->id();

            // Link to reply
            $table->foreignId('tracking_reply_id')
                ->constrained('tracking_replies')
                ->onDelete('cascade');

            // Action description
            $table->text('action_taken_text');

            // Optional user who created this action
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps(); // created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tracking_action_taken');
    }
};
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
        Schema::create('tracking_files', function (Blueprint $table) {
            $table->id();
            $table->string('tfiles_file_path');
            $table->string('tfiles_original_name');
            $table->string('tfiles_mime_type');
            $table->unsignedBigInteger('tfiles_file_size');
            $table->integer('tfiles_page_count')->nullable();

            $table->foreignId('tracking_titles_id')
                ->nullable()
                ->constrained('tracking_titles')
                ->nullOnDelete();

            $table->uuid('upload_token')->nullable()->index();

            $table->foreignId('uploaded_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('ossp_sections_id')
                ->nullable()
                ->constrained('ossp_sections')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracking_files');
    }
};

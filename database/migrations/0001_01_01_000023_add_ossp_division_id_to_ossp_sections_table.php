<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('ossp_sections', function (Blueprint $table) {
            $table->foreignId('ossp_division_id')
                  ->nullable() // nullable in case some sections don't have a division yet
                  ->after('sections_name')
                  ->constrained('ossp_divisions')
                  ->onDelete('set null'); // optional: when division is deleted, set null
        });
    }

    public function down(): void
    {
        Schema::table('ossp_sections', function (Blueprint $table) {
            $table->dropForeign(['ossp_division_id']);
            $table->dropColumn('ossp_division_id');
        });
    }
};
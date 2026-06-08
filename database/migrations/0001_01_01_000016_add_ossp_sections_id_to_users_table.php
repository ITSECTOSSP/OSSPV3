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
        Schema::table('users', function (Blueprint $table) {

            $table->foreignId('ossp_sections_id')
                ->nullable()
                ->constrained('ossp_sections')
                ->nullOnDelete()
                ->after('role_id');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropForeign(['ossp_sections_id']);
            $table->dropColumn('ossp_sections_id');

        });
    }
};
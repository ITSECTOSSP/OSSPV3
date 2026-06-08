<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tracking_assigneds', function (Blueprint $table) {
            // Date when status becomes 2
            $table->timestamp('status_2_date')->nullable()->after('tracking_assigned_statuses_id');

            // Date when status becomes 3
            $table->timestamp('status_3_date')->nullable()->after('status_2_date');
        });
    }

    public function down(): void
    {
        Schema::table('tracking_assigneds', function (Blueprint $table) {
            $table->dropColumn(['status_2_date', 'status_3_date']);
        });
    }
};
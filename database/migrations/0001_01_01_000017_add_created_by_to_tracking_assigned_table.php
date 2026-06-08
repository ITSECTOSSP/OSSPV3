<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tracking_assigneds', function (Blueprint $table) {
            $table->unsignedBigInteger('created_by')->nullable()->after('tracking_assigned_statuses_id');

            // Foreign key to users table
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('tracking_assigned', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn('created_by');
        });
    }
};
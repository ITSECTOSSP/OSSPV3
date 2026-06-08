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
        Schema::table('legislative_city_councilor', function (Blueprint $table) {
            $table->unsignedBigInteger('district_id')->nullable()->after('id');

            $table->foreign('district_id')
                ->references('id')
                ->on('legislative_district')
                ->nullOnDelete();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('legislative_city_councilor', function (Blueprint $table) {
            //
        });
    }
};

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
        /**
         * LEGISLATIVE DISTRICT TABLE
         */
        Schema::create('legislative_district', function (Blueprint $table) {
            $table->id();

            $table->string('district_name');
            $table->string('details')->nullable();

            $table->timestamps();
        });

        /**
         * ADD DISTRICT FK TO LEGISLATIVE CITY COUNCILOR
         */
        Schema::table('legislative_city_councilor', function (Blueprint $table) {
            $table->foreignId('legislative_district_id')
                ->nullable()
                ->after('id')
                ->constrained('legislative_district')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('legislative_city_councilor', function (Blueprint $table) {
            $table->dropForeign(['legislative_district_id']);
            $table->dropColumn('legislative_district_id');
        });

        Schema::dropIfExists('legislative_district');
    }
};
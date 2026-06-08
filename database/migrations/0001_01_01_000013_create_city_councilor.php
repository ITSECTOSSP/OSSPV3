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
        Schema::create('legislative_city_councilor', function (Blueprint $table) {
            $table->id();
            $table->string('councilor_name');
            $table->string('details')->nullable();
            $table->string('contact')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legislative_city_councilor');
        Schema::dropIfExists('city_councilor');
    }
};

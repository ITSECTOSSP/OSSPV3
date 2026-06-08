<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('legislative_city_council_councilor', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('city_council_id');
            $table->unsignedBigInteger('councilor_id');

            // Optional but recommended
            $table->timestamps();

            // Foreign keys
            $table->foreign('city_council_id')
                ->references('id')
                ->on('legislative_city_council')
                ->onDelete('cascade');

            $table->foreign('councilor_id')
                ->references('id')
                ->on('legislative_city_councilor')
                ->onDelete('cascade');

            $table->unique(
                ['city_council_id', 'councilor_id'],
                'lc_councilor_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('legislative_city_council_councilor');
    }
};

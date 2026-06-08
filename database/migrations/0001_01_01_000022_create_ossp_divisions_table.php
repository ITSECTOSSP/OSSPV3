<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ossp_divisions', function (Blueprint $table) {
            $table->id();
            $table->string('divisions_name');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ossp_divisions');
    }
};
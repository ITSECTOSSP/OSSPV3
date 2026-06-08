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
    Schema::create('tracking_titles', function (Blueprint $table) {
        $table->id();

        $table->string('titles_dcn');
        $table->string('titles_title');
        $table->string('titles_from')->nullable();
        $table->string('titles_subject')->nullable();

        // ✅ Fk
        $table->unsignedBigInteger('document_type_id');

        $table->foreign('document_type_id')
              ->references('id')
              ->on('document_types')
              ->cascadeOnDelete();

                // ✅ Fk
        $table->unsignedBigInteger('classifications_id')->default(1);

        $table->foreign('classifications_id')
              ->references('id')
              ->on('tracking_classifications')
              ->cascadeOnDelete();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracking_titles');
    }
};

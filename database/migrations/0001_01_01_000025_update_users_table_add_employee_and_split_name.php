<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
    Schema::table('users', function (Blueprint $table) {

        // 🔥 add new fields
        $table->string('employee_number')->unique()->after('id');
        $table->string('first_name')->after('employee_number');
        $table->string('middle_name')->nullable()->after('first_name');
        $table->string('last_name')->after('middle_name');

        // ❌ remove old name
        $table->dropColumn('name');
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {

        $table->string('name');

        $table->dropColumn([
            'employee_number',
            'first_name',
            'middle_name',
            'last_name'
        ]);
    });
}
};

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class document_types_seed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('document_types')->insert([
            [
                'id' => 1,
                'types_name' => 'GENERAL COMMUNICATION',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'types_name' => 'MEMORANDUM',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'types_name' => 'OFFICE ORDER',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'types_name' => 'BARANGAY COMPLAINT',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'types_name' => 'BARANGAY BUDGET',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 6,
                'types_name' => 'BARANGAY ORDINANCE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 7,
                'types_name' => 'BARANGAY RESOLUTION',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 8,
                'types_name' => 'PROPOSED RESOLUTION',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 9,
                'types_name' => 'PROPOSED ORDINANCE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class tracking_classifications_seed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tracking_classifications')->insert([
            [
                'id' => 1,
                'classifications_name' => 'Communications',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'classifications_name' => 'Transactional',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'classifications_name' => 'Order of Business',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'classifications_name' => 'City Council Measure',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'classifications_name' => 'Internal',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'classifications_name' => 'Similarity',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

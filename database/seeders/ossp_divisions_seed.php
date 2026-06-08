<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ossp_divisions_seed extends Seeder
{
    public function run(): void
    {
        DB::table('ossp_divisions')->insert([
            [
                'id' => 1,
                'divisions_name' => 'ADMINISTRATIVE DIVISION',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'divisions_name' => 'JOURNAL AND MINUTES DIVISION',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'divisions_name' => 'LEGISLATIVE SERVICES DIVISION',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'divisions_name' => 'DEPARTMENT HEAD',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

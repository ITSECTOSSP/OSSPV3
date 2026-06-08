<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class legis_mea_type extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
    {
    DB::table('legislative_measure_type')->insert(
        [
            [
            'id' => 1,
            'measure_name' => 'ORDINANCE',
            'created_at' => now(),
            'updated_at' => now(),
            ],
            [
            'id' => 2,
            'measure_name' => 'RESOLUTION',
            'created_at' => now(),
            'updated_at' => now(),
            ]
    ]);
    }
}

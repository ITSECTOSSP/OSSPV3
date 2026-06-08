<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class ossp_assigned_status_seed extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
    {
    DB::table('tracking_assigned_statuses')->insert([
        [
            'id' => 1,
            'status_name' => 'ASSIGNED',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 2,
            'status_name' => 'RECEIVED',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 3,
            'status_name' => 'ACCOMPLISHED',
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ]);
    }
}

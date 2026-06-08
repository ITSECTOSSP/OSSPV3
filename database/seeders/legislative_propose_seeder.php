<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class legislative_propose_seeder extends Seeder
{
    public function run(): void
    {
        $proposals = [];

        for ($i = 1; $i <= 30; $i++) {
            $proposals[] = [
                'id' => (string) Str::uuid(),
                'propose_no' => 'PROP-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'propose_title' => 'Proposed Legislative Measure Title ' . $i,
                
                // adjust these if your IDs differ
                'city_council_id' => rand(1, 23),
                'measure_type_id' => rand(1, 2),

                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('legislative_propose')->insert($proposals);
    }
}
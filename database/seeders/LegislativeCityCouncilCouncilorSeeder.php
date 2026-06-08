<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LegislativeCityCouncilCouncilorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /**
         * FORMAT:
         * council_id => [councilor_ids]
         */
        $data = [
            23 => [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 24, 25, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 41, 42],
 
            22 => [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 22, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 40, 41, 42, 43],

            21 => [2, 5, 6],
        ];

        foreach ($data as $councilId => $councilorIds) {
            foreach ($councilorIds as $councilorId) {

                DB::table('legislative_city_council_councilor')->updateOrInsert(
                    [
                        'city_council_id' => $councilId,
                        'councilor_id' => $councilorId,
                    ],
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
}

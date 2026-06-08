<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ossp_sections_seed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('ossp_sections')->insert([
             [
                'id' => 16,
                'sections_name' => 'DEPARTMENT HEAD',
                'ossp_division_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 1,
                'sections_name' => 'ADMINISTRATIVE DIVISION',
                'ossp_division_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'sections_name' => 'JOURNAL AND MINUTES DIVISION',
                'ossp_division_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'sections_name' => 'LEGISLATIVE SERVICES DIVISION',
                'ossp_division_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'sections_name' => 'RECORDS AND CORRESPONDENCE SECTION',
                'ossp_division_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'sections_name' => 'PERSONNEL SECTION',
                'ossp_division_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 6,
                'sections_name' => 'FINANCE AND ACCOUNTING SECTION',
                'ossp_division_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 7,
                'sections_name' => 'GENERAL SERVICES SECTION',
                'ossp_division_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 8,
                'sections_name' => 'JOURNAL AND TRANSCRIPTION SECTION',
                'ossp_division_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 9,
                'sections_name' => 'MINUTES SECTION',
                'ossp_division_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 10,
                'sections_name' => 'COMMITTEE AFFAIRS SECTION',
                'ossp_division_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 11,
                'sections_name' => 'SPECIAL COMMITTEE SECTION',
                'ossp_division_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 12,
                'sections_name' => 'AGENDA AND BRIEFING SECTION',
                'ossp_division_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 13,
                'sections_name' => 'ORDINANCE AND RESOLUTION SECTION',
                'ossp_division_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 14,
                'sections_name' => 'LEGISLATIVE RESEARCH SECTION',
                'ossp_division_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 15,
                'sections_name' => 'REFERENCE AND ARCHIVES SECTION',
                'ossp_division_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

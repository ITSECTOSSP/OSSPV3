<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class legislative_district_seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $districts = [
            ['district_name' => 'District I'],
            ['district_name' => 'District II'],
            ['district_name' => 'District III'],
            ['district_name' => 'District IV'],
            ['district_name' => 'District V'],
            ['district_name' => 'District VI'],
            ['district_name' => 'Ex-Officio'],
        ];

        DB::table('legislative_district')->insert($districts);
    }
}
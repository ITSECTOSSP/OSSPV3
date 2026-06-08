<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        $this->call([
        cc_seeder::class,
        user_role_seed::class,
        legis_mea_type::class,
        document_types_seed::class,
        ossp_assigned_status_seed::class,
        ossp_divisions_seed::class,
        ossp_sections_seed::class,
        tracking_classifications_seed::class,
        tracking_titles_seed::class,
        user_seed::class,   
        legislative_district_seeder::class,
        legislative_city_councilor_seeder::class,
        LegislativeCityCouncilCouncilorSeeder ::class,
        legislative_propose_seeder::class,
    ]);
       
    }
}

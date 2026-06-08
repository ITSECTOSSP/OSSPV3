<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class user_seed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'id' => 1,
                'employee_number' => 'EMP-001',
                'first_name' => 'Francis Christian',
                'middle_name' => 'Zenarosa',
                'last_name' => 'Virgen',
                'email' => 'francis1@gmail.com',
                'password' => '$2y$12$ELBoHsqGg2FMJ6aQhkXjG.RvK7bvbMoJaEuU4daaVQWmnnmtbE7Aq',
                'ossp_sections_id' => 2,
                'role_id' => 1,
            ],

            [
                'id' => 2,
                'employee_number' => 'EMP-002',
                'first_name' => 'John',
                'middle_name' => 'Doe',
                'last_name' => 'Smith',
                'email' => 'john@example.com',
                'password' => '$2y$12$ELBoHsqGg2FMJ6aQhkXjG.RvK7bvbMoJaEuU4daaVQWmnnmtbE7Aq',
                'ossp_sections_id' => 8,
                'role_id' => 2,
            ],

            [
                'id' => 3,
                'employee_number' => 'EMP-003',
                'first_name' => 'Jane',
                'middle_name' => 'Marie',
                'last_name' => 'Santos',
                'email' => 'jane@example.com',
                'password' => '$2y$12$ELBoHsqGg2FMJ6aQhkXjG.RvK7bvbMoJaEuU4daaVQWmnnmtbE7Aq',
                'ossp_sections_id' => 7,
                'role_id' => 2,
            ],

            [
                'id' => 4,
                'employee_number' => 'EMP-004',
                'first_name' => 'Michael',
                'middle_name' => 'Lee',
                'last_name' => 'Garcia',
                'email' => 'michael@example.com',
                'password' => '$2y$12$ELBoHsqGg2FMJ6aQhkXjG.RvK7bvbMoJaEuU4daaVQWmnnmtbE7Aq',
                'ossp_sections_id' => 4,
                'role_id' => 2,
            ],
        ]);
    }
}
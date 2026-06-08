<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class user_role_seed extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insert([
            [
                'id' => 1,
                'name' => 'ADMIN',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'DEPARTMENT HEAD',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => 'DIVISION CHIEF',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'name' => 'SECTION CHIEF',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'name' => 'STAFF',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

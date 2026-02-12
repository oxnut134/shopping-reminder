<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
                User::create([
            'name'     => 'cat',
            'email'    => 'cat@test.com',
            'password' => Hash::make('abc12345'), // ハッシュ化して保存
        ]);
    }
}

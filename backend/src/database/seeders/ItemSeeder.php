<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Item;
use Illuminate\Support\Carbon;

class ItemSeeder extends Seeder
{
    public function run(): void
    {
        // user_id = 1 のためのテストデータ
        $items = [
            ['item_name' => 'たまねぎ', 'amount' => '3個', 'is_checked' => false, 'menu' => true],
            ['item_name' => 'にんじん', 'amount' => '1本', 'is_checked' => false, 'menu' => true],
            ['item_name' => '豚肉', 'amount' => '200g', 'is_checked' => true, 'menu' => false, 'bought_at' => now()],
            ['item_name' => 'ジャガイモ', 'amount' => '2個', 'is_checked' => true, 'menu' => true, 'bought_at' => now()->subDays(6)],
            ['item_name' => 'レタス', 'amount' => '1個', 'is_checked' => true, 'menu' => true, 'bought_at' => now()->subDays(3)],
            ['item_name' => 'トマト', 'amount' => '2個', 'is_checked' => true, 'menu' => true, 'bought_at' => now()->subDays(1)],
        ];

        foreach ($items as $item) {
            Item::create(array_merge($item, ['user_id' => 1]));
        }
    }
}
